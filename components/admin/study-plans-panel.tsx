'use client';

import { FormEvent, useState } from 'react';
import { FileText } from 'lucide-react';

type Student = { id: string; fullName: string; username: string };
type StudyPlan = {
  id: string;
  title: string;
  content: string;
  pdfUrl: string | null;
  startDate: string | Date | null;
  endDate: string | Date | null;
  isActive: boolean;
  student: Student;
};

export function StudyPlansPanel({ students, initialPlans }: { students: Student[]; initialPlans: StudyPlan[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [form, setForm] = useState({
    studentId: students[0]?.id ?? '',
    title: '',
    content: '',
    pdfUrl: '',
    startDate: '',
    endDate: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const refreshPlans = async () => {
    const res = await fetch('/api/admin/study-plans', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (Array.isArray(data.plans)) setPlans(data.plans);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/study-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.message ?? 'Ders programı kaydedilemedi.');
      return;
    }
    setMessage('Ders programı kaydedildi.');
    setForm((current) => ({ ...current, title: '', content: '', pdfUrl: '', startDate: '', endDate: '', isActive: true }));
    await refreshPlans();
  };

  const togglePlan = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/admin/study-plans/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive })
    });
    if (res.ok) await refreshPlans();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-black">Ders Programı Ata</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <select
            value={form.studentId}
            onChange={(event) => setForm((current) => ({ ...current, studentId: event.target.value }))}
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>{student.fullName} ({student.username})</option>
            ))}
          </select>
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Başlık"
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />
          <input type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]" />
          <input type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]" />
          <textarea
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            placeholder="Program içeriği"
            rows={6}
            className="md:col-span-2 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
          />
          <label className="md:col-span-2 rounded-xl border border-dashed border-[#ff611a]/30 bg-[#ff611a]/5 px-4 py-3 text-sm text-gray-700">
            <span className="font-semibold text-[#ff611a]">Ders programı PDF ekle</span>
            <input
              type="file"
              accept="application/pdf"
              className="mt-2 block w-full text-xs"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setError('');
                try {
                  const pdfUrl = await readPdfAsDataUrl(file);
                  setForm((current) => ({ ...current, pdfUrl }));
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'PDF yüklenemedi.');
                }
              }}
            />
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
          Aktif program
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-[#ff611a] px-5 py-2 text-sm font-semibold text-white">Kaydet</button>
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-black">{plan.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{plan.student.fullName}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePlan(plan.id, !plan.isActive)}
                className={plan.isActive ? 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500'}
              >
                {plan.isActive ? 'Aktif' : 'Pasif'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {plan.startDate ? new Date(plan.startDate).toLocaleDateString('tr-TR') : '-'} - {plan.endDate ? new Date(plan.endDate).toLocaleDateString('tr-TR') : '-'}
            </p>
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700">{plan.content}</p>
            {plan.pdfUrl ? (
              <a href={plan.pdfUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#ff611a]">
                <FileText className="h-4 w-4" />
                PDF Programı Gör
              </a>
            ) : null}
          </article>
        ))}
      </div>
      {plans.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">Henüz ders programı yok.</div>
      ) : null}
    </div>
  );
}
  const readPdfAsDataUrl = async (file: File) => {
    if (file.type !== 'application/pdf') {
      throw new Error('Sadece PDF dosyası yükleyebilirsin.');
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('PDF dosyası en fazla 2 MB olmalı. Yayında büyük dosyalar için R2/Vercel Blob kullanılmalı.');
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('PDF okunamadı.'));
      reader.readAsDataURL(file);
    });
  };
