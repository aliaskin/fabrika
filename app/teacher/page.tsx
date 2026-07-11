

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { requireTeacherOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function TeacherPage() {
  const auth = await requireTeacherOrAdmin();
  if (!auth) redirect('/admin');

  const assignments = await prisma.assignment.findMany({
    where: auth.user.role === 'admin' ? {} : { teacherId: auth.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      teacher: { select: { fullName: true } },
      students: {
        include: {
          student: { select: { fullName: true, username: true } }
        }
      }
    }
  });

  const students = await prisma.userAccount.findMany({
    where: { role: 'student', isActive: true },
    orderBy: { fullName: 'asc' },
    select: { id: true, fullName: true, username: true }
  });

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Öğretmen Paneli</p>
          <h1 className="mt-2 text-3xl font-semibold text-black">Ödev ve Sınıf Takibi</h1>
          <p className="mt-2 text-sm text-gray-600">
            Hoş geldin {auth.user.fullName}. Buradan verilen ödevleri, öğrenci durumlarını ve sınıf ilerlemesini takip edebilirsin.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Verilen Ödev</p>
            <strong className="mt-2 block text-3xl text-black">{assignments.length}</strong>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Aktif Öğrenci</p>
            <strong className="mt-2 block text-3xl text-black">{students.length}</strong>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Kontrol Bekleyen</p>
            <strong className="mt-2 block text-3xl text-black">
              {assignments.reduce((total, assignment) => total + assignment.students.filter((item) => item.status === 'completed').length, 0)}
            </strong>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-black">Ödevler</h2>
              <p className="mt-1 text-sm text-gray-500">Öğrencilere atanmış ödevleri ve kontrol durumlarını gör.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/teacher/assignments" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">
                Ödev Kontrolü
              </Link>
              <Link href="/teacher/assignments/new" className="rounded-full bg-[#ff611a] px-5 py-2 text-sm font-semibold text-white">
                Yeni Ödev Ver
              </Link>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3">Ödev</th>
                  <th className="px-4 py-3">Sınıf</th>
                  <th className="px-4 py-3">Öğretmen</th>
                  <th className="px-4 py-3">Öğrenci</th>
                  <th className="px-4 py-3">Teslim</th>
                  <th className="px-4 py-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="border-t border-gray-100">
                    <td className="px-4 py-4 font-medium text-black">
                      <div>{assignment.title}</div>
                      <div className="mt-1 line-clamp-1 text-xs font-normal text-gray-500">{assignment.description}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{assignment.className ?? '-'}</td>
                    <td className="px-4 py-4 text-gray-600">{assignment.teacher.fullName}</td>
                    <td className="px-4 py-4 text-gray-600">{assignment.students.length}</td>
                    <td className="px-4 py-4 text-gray-600">{assignment.dueDate ? assignment.dueDate.toLocaleDateString('tr-TR') : '-'}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {assignment.students.length
                        ? `${assignment.students.filter((item) => item.status === 'checked').length}/${assignment.students.length} kontrol edildi`
                        : 'Öğrenci atanmadı'}
                    </td>
                  </tr>
                ))}
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                      Henüz ödev oluşturulmadı.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
