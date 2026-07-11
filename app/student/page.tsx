

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { requireStudentOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function StudentPage() {
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

  const examResults = await prisma.examResult.findMany({
    where: auth.user.role === 'admin' ? {} : { studentId: auth.user.id },
    orderBy: { examDate: 'desc' },
    take: 5
  });

  const studyPlans = await prisma.studyPlan.findMany({
    where: auth.user.role === 'admin' ? { isActive: true } : { studentId: auth.user.id, isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  const completedAssignments = assignments.filter((item) => item.status === 'completed' || item.status === 'checked').length;
  const progressRate = assignments.length ? Math.round((completedAssignments / assignments.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Öğrenci Paneli</p>
          <h1 className="mt-2 text-3xl font-semibold text-black">Ödevlerim, Denemelerim ve Ders Programım</h1>
          <p className="mt-2 text-sm text-gray-600">
            Hoş geldin {auth.user.fullName}. Sana verilen ödevleri, son deneme sonuçlarını ve çalışma planını buradan takip edebilirsin.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/student/assignments" className="rounded-full bg-[#ff611a] px-4 py-2 text-sm font-semibold text-white">Ödevlerim</Link>
            <Link href="/student/exam-results" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">Deneme Sonuçlarım</Link>
            <Link href="/student/study-plan" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">Ders Programım</Link>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Ödev İlerlemesi</p>
            <strong className="mt-2 block text-3xl text-black">%{progressRate}</strong>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Bekleyen Ödev</p>
            <strong className="mt-2 block text-3xl text-black">{assignments.filter((item) => item.status === 'assigned' || item.status === 'in_progress').length}</strong>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Son Deneme</p>
            <strong className="mt-2 block text-3xl text-black">{examResults[0]?.net ?? '-'}</strong>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-black">Verilen Ödevler</h2>
            <div className="mt-5 space-y-3">
              {assignments.map((item) => (
                <article key={item.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-black">{item.assignment.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{item.assignment.description}</p>
                      <p className="mt-2 text-xs text-gray-500">Öğretmen: {item.assignment.teacher.fullName}</p>
                    </div>
                    <span className="rounded-full bg-[#ff611a]/10 px-3 py-1 text-xs font-semibold text-[#ff611a]">
                      {item.status === 'assigned'
                        ? 'Atandı'
                        : item.status === 'in_progress'
                          ? 'Devam Ediyor'
                          : item.status === 'completed'
                            ? 'Kontrol Bekliyor'
                            : 'Kontrol Edildi'}
                    </span>
                  </div>
                  {item.feedback ? <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">Geri bildirim: {item.feedback}</p> : null}
                </article>
              ))}
              {assignments.length === 0 ? <p className="text-sm text-gray-500">Henüz atanmış ödev yok.</p> : null}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black">Ders Programı</h2>
              <div className="mt-4 space-y-3">
                {studyPlans.map((plan) => (
                  <article key={plan.id} className="rounded-2xl border border-gray-100 p-4">
                    <h3 className="font-semibold text-black">{plan.title}</h3>
                    {plan.content ? <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{plan.content}</p> : null}
                    {plan.pdfUrl ? <Link href="/student/study-plan" className="mt-3 inline-block text-sm font-semibold text-[#ff611a]">PDF programı gör</Link> : null}
                  </article>
                ))}
                {studyPlans.length === 0 ? <p className="text-sm text-gray-500">Henüz aktif ders programı yok.</p> : null}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black">Son Denemeler</h2>
              <div className="mt-4 space-y-3">
                {examResults.map((exam) => (
                  <article key={exam.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-black">{exam.examName}</h3>
                      <strong className="text-[#ff611a]">{exam.net} net</strong>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{exam.examDate.toLocaleDateString('tr-TR')}</p>
                    <p className="mt-2 text-sm text-gray-600">Doğru: {exam.correct} · Yanlış: {exam.wrong} · Boş: {exam.empty}</p>
                    {exam.weakTopics ? <p className="mt-2 text-sm text-red-600">Eksik konular: {exam.weakTopics}</p> : null}
                    {exam.advice ? <p className="mt-2 text-sm text-gray-600">Çalışma önerisi: {exam.advice}</p> : null}
                  </article>
                ))}
                {examResults.length === 0 ? <p className="text-sm text-gray-500">Henüz deneme sonucu girilmedi.</p> : null}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
