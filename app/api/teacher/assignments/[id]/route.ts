import { NextResponse } from 'next/server';

import { requireTeacherOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type Params = {
  params: { id: string };
};

type UpdateBody = {
  status?: 'assigned' | 'in_progress' | 'completed' | 'checked';
  feedback?: string | null;
};

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requireTeacherOrAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece öğretmen veya admin düzenleyebilir.' }, { status: 403 });
  }

  const record = await prisma.studentAssignment.findUnique({
    where: { id: params.id },
    include: { assignment: { select: { id: true, teacherId: true, title: true } } }
  });

  if (!record) {
    return NextResponse.json({ message: 'Ödev öğrenci kaydı bulunamadı.' }, { status: 404 });
  }

  if (auth.user.role !== 'admin' && record.assignment.teacherId !== auth.user.id) {
    return NextResponse.json({ message: 'Sadece kendi verdiğin ödevleri kontrol edebilirsin.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as UpdateBody;
  const data: {
    status?: 'assigned' | 'in_progress' | 'completed' | 'checked';
    feedback?: string | null;
    completedAt?: Date | null;
  } = {};

  if (body.status) data.status = body.status;
  if (typeof body.feedback === 'string' || body.feedback === null) data.feedback = body.feedback?.trim() || null;
  if (body.status === 'completed' || body.status === 'checked') data.completedAt = record.completedAt ?? new Date();

  const updated = await prisma.studentAssignment.update({
    where: { id: params.id },
    data,
    include: {
      student: { select: { id: true, fullName: true, username: true } },
      assignment: { select: { id: true, title: true } }
    }
  });

  await writeAuditLog({
    event: 'teacher_assignment_check',
    actor: auth.user.username,
    meta: { role: auth.user.role, studentAssignmentId: updated.id, assignmentId: updated.assignment.id }
  });

  return NextResponse.json({ assignment: updated });
}
