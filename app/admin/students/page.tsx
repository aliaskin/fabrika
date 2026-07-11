import Link from 'next/link';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminStudentsPage() {
  const auth = await requireAdmin();
  if (!auth) redirect('/admin');

  const students = await prisma.userAccount.findMany({
    where: { role: 'student' },
    orderBy: { fullName: 'asc' },
    include: {
      studentAssignments: { select: { status: true } },
      examResults: { orderBy: { examDate: 'desc' }, take: 1 },
      studyPlans: { where: { isActive: true }, select: { id: true } }
    }
  });

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Admin Paneli</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Öğrenci İnceleme</h1>
            <p className="mt-2 text-sm text-gray-600">Öğrenci ilerlemesini, son denemesini ve aktif programını takip et.</p>
          </div>
          <Link href="/admin" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">Panele Dön</Link>
        </div>

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3">Öğrenci</th>
                  <th className="px-5 py-3">Sınıf</th>
                  <th className="px-5 py-3">Durum</th>
                  <th className="px-5 py-3">Ödev İlerlemesi</th>
                  <th className="px-5 py-3">Son Net</th>
                  <th className="px-5 py-3">Aktif Program</th>
                  <th className="px-5 py-3">Detay</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const completed = student.studentAssignments.filter((item) => item.status === 'completed' || item.status === 'checked').length;
                  const progress = student.studentAssignments.length ? Math.round((completed / student.studentAssignments.length) * 100) : 0;
                  return (
                    <tr key={student.id} className="border-t border-gray-100">
                      <td className="px-5 py-4 font-medium text-black">{student.fullName}<span className="block text-xs font-normal text-gray-500">@{student.username}</span></td>
                      <td className="px-5 py-4 text-gray-600">{student.classLevel ?? '-'}</td>
                      <td className="px-5 py-4 text-gray-600">{student.isActive ? 'Aktif' : 'Pasif'}</td>
                      <td className="px-5 py-4 text-gray-600">%{progress}</td>
                      <td className="px-5 py-4 font-semibold text-[#ff611a]">{student.examResults[0]?.net ?? '-'}</td>
                      <td className="px-5 py-4 text-gray-600">{student.studyPlans.length}</td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/students/${student.id}`} className="rounded-full border border-[#ff611a]/30 px-3 py-1 text-xs font-semibold text-[#ff611a]">İncele</Link>
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 ? <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-500">Henüz öğrenci yok.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
