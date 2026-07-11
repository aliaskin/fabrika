import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ExamResultsPanel } from '@/components/admin/exam-results-panel';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminExamResultsPage() {
  const auth = await requireAdmin();
  if (!auth) redirect('/admin');

  const [students, results] = await Promise.all([
    prisma.userAccount.findMany({
      where: { role: 'student', isActive: true },
      orderBy: { fullName: 'asc' },
      select: { id: true, fullName: true, username: true, classLevel: true }
    }),
    prisma.examResult.findMany({
      orderBy: { examDate: 'desc' },
      include: { student: { select: { id: true, fullName: true, username: true } } }
    })
  ]);
  const serializedResults = JSON.parse(JSON.stringify(results));

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Admin Paneli</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Deneme Sonucu Yönetimi</h1>
            <p className="mt-2 text-sm text-gray-600">Öğrenci denemelerini gir, eksik konuları ve çalışma önerilerini takip et.</p>
          </div>
          <Link href="/admin" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">Panele Dön</Link>
        </div>

        <ExamResultsPanel students={students} initialResults={serializedResults} />
      </div>
    </main>
  );
}
