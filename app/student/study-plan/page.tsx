import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText } from 'lucide-react';

import { requireStudentOrAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function StudentStudyPlanPage() {
  const auth = await requireStudentOrAdmin();
  if (!auth) redirect('/admin');

  const plans = await prisma.studyPlan.findMany({
    where: auth.user.role === 'admin' ? { isActive: true } : { studentId: auth.user.id, isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Öğrenci Paneli</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Ders Programım</h1>
            <p className="mt-2 text-sm text-gray-600">Aktif çalışma planlarını ve tarih aralıklarını takip et.</p>
          </div>
          <Link href="/student" className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700">
            Dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black">{plan.title}</h2>
              <p className="mt-2 text-xs text-gray-500">
                {plan.startDate ? plan.startDate.toLocaleDateString('tr-TR') : 'Başlangıç yok'} - {plan.endDate ? plan.endDate.toLocaleDateString('tr-TR') : 'Bitiş yok'}
              </p>
              {plan.content ? <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700">{plan.content}</p> : null}
              {plan.pdfUrl ? (
                <a href={plan.pdfUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#ff611a]">
                  <FileText className="h-4 w-4" />
                  Ders Programı PDF&apos;ini Gör
                </a>
              ) : null}
            </article>
          ))}
          {plans.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">Henüz aktif ders programı yok.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
