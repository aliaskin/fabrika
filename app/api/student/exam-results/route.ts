import { NextResponse } from 'next/server';

import { requireStudentOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const auth = await requireStudentOrAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece öğrenci veya admin görüntüleyebilir.' }, { status: 403 });
  }

  const results = await prisma.examResult.findMany({
    where: auth.user.role === 'admin' ? {} : { studentId: auth.user.id },
    orderBy: { examDate: 'desc' },
    include: {
      student: { select: { id: true, fullName: true, username: true } }
    }
  });

  return NextResponse.json({ results });
}

