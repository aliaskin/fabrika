

import { NextResponse } from 'next/server';

import { getAdminSession, hasSessionRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type UpdateAssignmentBody = {
  status?: 'assigned' | 'in_progress' | 'completed' | 'checked';
  feedback?: string;
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ message: 'Giriş gerekli.' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as UpdateAssignmentBody;
  const assignment = await prisma.studentAssignment.findUnique({
    where: { id: params.id },
    include: {
      student: { select: { username: true } },
      assignment: { select: { teacher: { select: { username: true } } } }
    }
  });

  if (!assignment) {
    return NextResponse.json({ message: 'Ödev kaydı bulunamadı.' }, { status: 404 });
  }

  const isOwnerStudent = session.role === 'student' && assignment.student.username === session.username;
  const isOwnerTeacher = session.role === 'teacher' && assignment.assignment.teacher.username === session.username;
  const isAdmin = hasSessionRole('admin');

  if (!isOwnerStudent && !isOwnerTeacher && !isAdmin) {
    return NextResponse.json({ message: 'Bu ödevi güncelleme yetkin yok.' }, { status: 403 });
  }

  const data: UpdateAssignmentBody & { completedAt?: Date | null } = {};

  if (isOwnerStudent) {
    return NextResponse.json({ message: 'Öğrenci ödev durumunu değiştiremez; kontrol öğretmen tarafından yapılır.' }, { status: 403 });
  }

  if (isOwnerTeacher || isAdmin) {
    if (body.status) data.status = body.status;
    if (typeof body.feedback === 'string') data.feedback = body.feedback;
    if (body.status === 'completed') data.completedAt = new Date();
  }

  const updated = await prisma.studentAssignment.update({
    where: { id: params.id },
    data,
    include: {
      student: { select: { fullName: true, username: true } },
      assignment: { select: { title: true } }
    }
  });

  await writeAuditLog({
    event: isOwnerStudent ? 'student_assignment_update' : 'assignment_update',
    actor: session.username,
    meta: { role: session.role, studentAssignmentId: updated.id, status: updated.status }
  });

  return NextResponse.json({ assignment: updated });
}
