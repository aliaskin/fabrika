import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText } from 'lucide-react';

import { requireStudentOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function StudentExamResultsPage() {
  const auth = await requireStudentOrAdmin();
  if (!auth) redirect('/admin');

  const results = await prisma.examResult.findMany({
    where: auth.user.role === 'admin' ? {} : { studentId: auth.user.id },
    orderBy: { examDate: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Öğrenci Paneli</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Deneme Sonuçlarım</h1>
            <p className="mt-2 text-sm text-gray-600">Son denemelerini, netlerini, eksik konularını ve çalışma önerilerini gör.</p>
          </div>
          <Link href="/student" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">
            Dashboard
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {results.map((exam) => (
            <article key={exam.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-black">{exam.examName}</h2>
                  <p className="mt-1 text-xs text-gray-500">{exam.examDate.toLocaleDateString('tr-TR')}</p>
                </div>
                <strong className="rounded-full bg-[#ff611a]/10 px-4 py-2 text-[#ff611a]">{exam.net} net</strong>
              </div>
              <p className="mt-4 text-sm text-gray-600">Doğru: {exam.correct} · Yanlış: {exam.wrong} · Boş: {exam.empty}</p>
              {exam.weakTopics ? <p className="mt-3 text-sm text-red-600">Eksik konular: {exam.weakTopics}</p> : null}
              {exam.advice ? <p className="mt-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">Neleri çalışmalıyım? {exam.advice}</p> : null}
              {exam.pdfUrl ? (
                <a href={exam.pdfUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#ff611a]">
                  <FileText className="h-4 w-4" />
                  Deneme PDF&apos;ini Gör
                </a>
              ) : null}
            </article>
          ))}
        </div>
        {results.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">Henüz deneme sonucu girilmedi.</div>
        ) : null}
      </div>
    </main>
  );
}
