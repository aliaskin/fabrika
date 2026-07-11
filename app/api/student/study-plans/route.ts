import { NextResponse } from 'next/server';

import { requireStudentOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const auth = await requireStudentOrAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece öğrenci veya admin görüntüleyebilir.' }, { status: 403 });
  }

  const plans = await prisma.studyPlan.findMany({
    where: auth.user.role === 'admin' ? { isActive: true } : { studentId: auth.user.id, isActive: true },
    orderBy: { createdAt: 'desc' },
    include: { student: { select: { id: true, fullName: true, username: true } } }
  });

  return NextResponse.json({ plans });
}

