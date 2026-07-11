import { NextResponse } from 'next/server';

import { requireTeacherOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const auth = await requireTeacherOrAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece öğretmen veya admin görüntüleyebilir.' }, { status: 403 });
  }

  const students = await prisma.userAccount.findMany({
    where: { role: 'student', isActive: true },
    orderBy: { fullName: 'asc' },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      classLevel: true,
      studentAssignments: {
        where: auth.user.role === 'admin' ? {} : { assignment: { teacherId: auth.user.id } },
        select: { status: true }
      }
    }
  });

  return NextResponse.json({ students });
}
