'use client';

import { FormEvent, useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';

type Student = { id: string; fullName: string; username: string; classLevel: string | null };
type ExamResult = {
  id: string;
  examName: string;
  examDate: string | Date;
  correct: number;
  wrong: number;
  empty: number;
  net: number;
  pdfUrl: string | null;
  weakTopics: string | null;
  advice: string | null;
  student: Student;
};

export function ExamResultsPanel({ students, initialResults }: { students: Student[]; initialResults: ExamResult[] }) {
  const [results, setResults] = useState(initialResults);
  const [form, setForm] = useState({
    studentId: students[0]?.id ?? '',
    examName: '',
    examDate: '',
    correct: '',
    wrong: '',
    empty: '',
    pdfUrl: '',
    weakTopics: '',
    advice: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refreshResults = async () => {
    const res = await fetch('/api/admin/exam-results', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (Array.isArray(data.results)) setResults(data.results);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const correct = Number(form.correct || 0);
    const wrong = Number(form.wrong || 0);
    const empty = Number(form.empty || 0);

    const res = await fetch('/api/admin/exam-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        correct,
        wrong,
        empty
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.message ?? 'Deneme sonucu kaydedilemedi.');
      return;
    }
    setMessage('Deneme sonucu kaydedildi.');
    setForm((current) => ({ ...current, examName: '', examDate: '', correct: '', wrong: '', empty: '', pdfUrl: '', weakTopics: '', advice: '' }));
    await refreshResults();
  };

  const deleteResult = async (id: string) => {
    const res = await fetch(`/api/admin/exam-results/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? 'Deneme sonucu silinemedi.');
      return;
    }
    await refreshResults();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-black">Deneme Sonucu Gir</h2>
        <p className="mt-1 text-sm text-gray-500">Net, öğrencinin sınıfına göre hesaplanır: LGS için 3 yanlış 1 doğruyu, YKS için 4 yanlış 1 doğruyu götürür.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <select
            value={form.studentId}
            onChange={(event) => setForm((current) => ({ ...current, studentId: event.target.value }))}
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>{student.fullName} ({student.classLevel ?? 'sınıf yok'})</option>
            ))}
          </select>
          <input
            value={form.examName}
            onChange={(event) => setForm((current) => ({ ...current, examName: event.target.value }))}
            placeholder="Deneme adı"
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />
          <input
            type="date"
            value={form.examDate}
            onChange={(event) => setForm((current) => ({ ...current, examDate: event.target.value }))}
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
          />
          <div className="grid grid-cols-3 gap-2">
            <input type="number" value={form.correct} onChange={(event) => setForm((current) => ({ ...current, correct: event.target.value }))} placeholder="Doğru" className="h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]" />
            <input type="number" value={form.wrong} onChange={(event) => setForm((current) => ({ ...current, wrong: event.target.value }))} placeholder="Yanlış" className="h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]" />
            <input type="number" value={form.empty} onChange={(event) => setForm((current) => ({ ...current, empty: event.target.value }))} placeholder="Boş" className="h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]" />
          </div>
          <label className="rounded-xl border border-dashed border-[#ff611a]/30 bg-[#ff611a]/5 px-4 py-3 text-sm text-gray-700">
            <span className="font-semibold text-[#ff611a]">PDF ekle</span>
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
          <textarea value={form.weakTopics} onChange={(event) => setForm((current) => ({ ...current, weakTopics: event.target.value }))} placeholder="Eksik konular" className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]" />
          <textarea value={form.advice} onChange={(event) => setForm((current) => ({ ...current, advice: event.target.value }))} placeholder="Çalışma önerisi" className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-[#ff611a] px-5 py-2 text-sm font-semibold text-white">Kaydet</button>
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </form>

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3">Öğrenci</th>
                <th className="px-5 py-3">Deneme</th>
                <th className="px-5 py-3">Tarih</th>
                <th className="px-5 py-3">D/Y/B</th>
                <th className="px-5 py-3">Net</th>
                <th className="px-5 py-3">Eksikler</th>
                <th className="px-5 py-3">PDF</th>
                <th className="px-5 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-t border-gray-100">
                  <td className="px-5 py-4 font-medium text-black">{result.student.fullName}</td>
                  <td className="px-5 py-4 text-gray-600">{result.examName}</td>
                  <td className="px-5 py-4 text-gray-600">{new Date(result.examDate).toLocaleDateString('tr-TR')}</td>
                  <td className="px-5 py-4 text-gray-600">{result.correct}/{result.wrong}/{result.empty}</td>
                  <td className="px-5 py-4 font-semibold text-[#ff611a]">{result.net}</td>
                  <td className="px-5 py-4 text-gray-600">{result.weakTopics ?? '-'}</td>
                  <td className="px-5 py-4">
                    {result.pdfUrl ? (
                      <a href={result.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:text-[#ff611a]">
                        <FileText className="h-3.5 w-3.5" />
                        Gör
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => deleteResult(result.id)} className="rounded-full border border-red-100 p-2 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {results.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-500">Henüz deneme sonucu girilmedi.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
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
