import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { FileText } from 'lucide-react';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminStudentDetailPage({ params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth) redirect('/admin');

  const student = await prisma.userAccount.findFirst({
    where: { id: params.id, role: 'student' },
    include: {
      studentAssignments: {
        orderBy: { createdAt: 'desc' },
        include: { assignment: { include: { teacher: { select: { fullName: true } } } } }
      },
      examResults: { orderBy: { examDate: 'desc' } },
      studyPlans: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!student) notFound();

  const completed = student.studentAssignments.filter((item) => item.status === 'completed' || item.status === 'checked').length;
  const progress = student.studentAssignments.length ? Math.round((completed / student.studentAssignments.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Öğrenci Detayı</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">{student.fullName}</h1>
            <p className="mt-2 text-sm text-gray-600">@{student.username} · {student.classLevel ?? 'Sınıf seçilmedi'} · Ödev ilerlemesi %{progress}</p>
          </div>
          <Link href="/admin/students" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">Öğrencilere Dön</Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-black">Ödevleri</h2>
            <div className="mt-4 space-y-3">
              {student.studentAssignments.map((item) => (
                <article key={item.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-black">{item.assignment.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{item.assignment.description}</p>
                      <p className="mt-2 text-xs text-gray-500">Öğretmen: {item.assignment.teacher.fullName}</p>
                    </div>
                    <span className="rounded-full bg-[#ff611a]/10 px-3 py-1 text-xs font-semibold text-[#ff611a]">{item.status}</span>
                  </div>
                  {item.feedback ? <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">{item.feedback}</p> : null}
                </article>
              ))}
              {student.studentAssignments.length === 0 ? <p className="text-sm text-gray-500">Henüz ödev yok.</p> : null}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black">Deneme Sonuçları</h2>
              <div className="mt-4 space-y-3">
                {student.examResults.map((exam) => (
                  <article key={exam.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-black">{exam.examName}</h3>
                      <strong className="text-[#ff611a]">{exam.net} net</strong>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{exam.examDate.toLocaleDateString('tr-TR')}</p>
                    {exam.weakTopics ? <p className="mt-2 text-sm text-red-600">Eksikler: {exam.weakTopics}</p> : null}
                    {exam.advice ? <p className="mt-2 text-sm text-gray-600">{exam.advice}</p> : null}
                    {exam.pdfUrl ? (
                      <a href={exam.pdfUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#ff611a]">
                        <FileText className="h-4 w-4" />
                        PDF
                      </a>
                    ) : null}
                  </article>
                ))}
                {student.examResults.length === 0 ? <p className="text-sm text-gray-500">Henüz deneme sonucu girilmedi.</p> : null}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black">Ders Programları</h2>
              <div className="mt-4 space-y-3">
                {student.studyPlans.map((plan) => (
                  <article key={plan.id} className="rounded-2xl border border-gray-100 p-4">
                    <h3 className="font-semibold text-black">{plan.title}</h3>
                    {plan.content ? <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{plan.content}</p> : null}
                    {plan.pdfUrl ? (
                      <a href={plan.pdfUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#ff611a]">
                        <FileText className="h-4 w-4" />
                        PDF
                      </a>
                    ) : null}
                  </article>
                ))}
                {student.studyPlans.length === 0 ? <p className="text-sm text-gray-500">Henüz ders programı yok.</p> : null}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
