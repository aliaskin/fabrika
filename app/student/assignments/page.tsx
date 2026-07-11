import Link from 'next/link';
import { redirect } from 'next/navigation';

import { StudentAssignmentPanel } from '@/components/student/student-assignment-panel';
import { requireStudentOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function StudentAssignmentsPage() {
  const auth = await requireStudentOrAdmin();
  if (!auth) redirect('/admin');

  const assignments = await prisma.studentAssignment.findMany({
    where: auth.user.role === 'admin' ? {} : { studentId: auth.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      assignment: {
        include: {
          teacher: { select: { fullName: true } }
        }
      }
    }
  });
  const serializedAssignments = JSON.parse(JSON.stringify(assignments));

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Öğrenci Paneli</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Ödevlerim</h1>
            <p className="mt-2 text-sm text-gray-600">Sana atanan ödevleri takip et ve durumunu güncelle.</p>
          </div>
          <Link href="/student" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">
            Dashboard
          </Link>
        </div>

        <StudentAssignmentPanel initialAssignments={serializedAssignments} />
      </div>
    </main>
  );
}
