import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AssignmentReviewPanel } from '@/components/teacher/assignment-review-panel';
import { requireTeacherOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function TeacherAssignmentsPage() {
  const auth = await requireTeacherOrAdmin();
  if (!auth) redirect('/admin');

  const assignments = await prisma.assignment.findMany({
    where: auth.user.role === 'admin' ? {} : { teacherId: auth.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      teacher: { select: { fullName: true } },
      students: {
        include: { student: { select: { fullName: true, username: true } } }
      }
    }
  });
  const serializedAssignments = JSON.parse(JSON.stringify(assignments));

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Öğretmen Paneli</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Ödev Listesi ve Kontrol</h1>
            <p className="mt-2 text-sm text-gray-600">Verdiğin ödevlerin öğrenci durumlarını takip et, puan ve geri bildirim gir.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/teacher" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">
              Dashboard
            </Link>
            <Link href="/teacher/assignments/new" className="rounded-full bg-[#ff611a] px-5 py-2 text-sm font-semibold text-white">
              Yeni Ödev
            </Link>
          </div>
        </div>

        <AssignmentReviewPanel initialAssignments={serializedAssignments} />
      </div>
    </main>
  );
}
