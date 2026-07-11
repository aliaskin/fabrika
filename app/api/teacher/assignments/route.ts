import { NextResponse } from 'next/server';

import { requireTeacherOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type CreateAssignmentBody = {
  title?: string;
  description?: string;
  dueDate?: string;
  className?: string;
  studentIds?: string[];
};

export async function GET() {
  const auth = await requireTeacherOrAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece öğretmen veya admin görüntüleyebilir.' }, { status: 403 });
  }

  const assignments = await prisma.assignment.findMany({
    where: auth.user.role === 'admin' ? {} : { teacherId: auth.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      teacher: { select: { id: true, fullName: true, username: true } },
      students: {
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, fullName: true, username: true } }
        }
      }
    }
  });

  return NextResponse.json({ assignments });
}

export async function POST(req: Request) {
  const auth = await requireTeacherOrAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece öğretmen veya admin düzenleyebilir.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as CreateAssignmentBody;
  const title = body.title?.trim();
  const description = body.description?.trim();
  const className = body.className?.trim() || null;
  const studentIds = Array.isArray(body.studentIds) ? Array.from(new Set(body.studentIds.filter(Boolean))) : [];

  if (!title || !description) {
    return NextResponse.json({ message: 'Ödev başlığı ve açıklaması zorunludur.' }, { status: 400 });
  }

  if (studentIds.length === 0) {
    return NextResponse.json({ message: 'En az bir öğrenci seçmelisin.' }, { status: 400 });
  }

  const studentCount = await prisma.userAccount.count({
    where: { id: { in: studentIds }, role: 'student', isActive: true }
  });
  if (studentCount !== studentIds.length) {
    return NextResponse.json({ message: 'Seçilen öğrencilerden biri bulunamadı veya pasif.' }, { status: 400 });
  }

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      className,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      teacherId: auth.user.id,
      students: {
        create: studentIds.map((studentId) => ({ studentId }))
      }
    },
    include: {
      teacher: { select: { id: true, fullName: true, username: true } },
      students: {
        include: {
          student: { select: { id: true, fullName: true, username: true } }
        }
      }
    }
  });

  await writeAuditLog({
    event: 'teacher_assignment_create',
    actor: auth.user.username,
    meta: { role: auth.user.role, assignmentId: assignment.id, studentCount: studentIds.length }
  });

  return NextResponse.json({ assignment });
}

