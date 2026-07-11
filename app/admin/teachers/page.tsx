import Link from 'next/link';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminTeachersPage() {
  const auth = await requireAdmin();
  if (!auth) redirect('/admin');

  const teachers = await prisma.userAccount.findMany({
    where: { role: 'teacher' },
    orderBy: { fullName: 'asc' },
    include: {
      teacherAssignments: {
        include: { students: { select: { status: true, studentId: true } } }
      }
    }
  });

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Admin Paneli</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Öğretmen Denetimi</h1>
            <p className="mt-2 text-sm text-gray-600">Öğretmenlerin verdiği ödevleri ve kontrol performansını izle.</p>
          </div>
          <Link href="/admin" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">Panele Dön</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {teachers.map((teacher) => {
            const assigned = teacher.teacherAssignments.flatMap((assignment) => assignment.students);
            const checked = assigned.filter((item) => item.status === 'checked').length;
            const waiting = assigned.filter((item) => item.status === 'completed').length;
            const activeStudents = new Set(assigned.map((item) => item.studentId)).size;
            return (
              <article key={teacher.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-black">{teacher.fullName}</h2>
                    <p className="mt-1 text-sm text-gray-500">@{teacher.username}</p>
                  </div>
                  <span className={teacher.isActive ? 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500'}>
                    {teacher.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">Toplam ödev</p><strong className="mt-1 block text-2xl">{teacher.teacherAssignments.length}</strong></div>
                  <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">Kontrol bekleyen</p><strong className="mt-1 block text-2xl">{waiting}</strong></div>
                  <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">Kontrol edilen</p><strong className="mt-1 block text-2xl">{checked}</strong></div>
                  <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">Aktif öğrenci</p><strong className="mt-1 block text-2xl">{activeStudents}</strong></div>
                </div>
              </article>
            );
          })}
        </div>
        {teachers.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">Henüz öğretmen yok.</div> : null}
      </div>
    </main>
  );
}

