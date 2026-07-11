'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Student = {
  id: string;
  fullName: string;
  username: string;
  classLevel?: string | null;
};

export default function NewAssignmentPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [className, setClassName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/teacher/students', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const studentList = Array.isArray(data.students) ? data.students : [];
        setStudents(studentList);
      })
      .catch(() => setStudents([]));
  }, []);

  const toggleStudent = (studentId: string) => {
    setStudentIds((current) =>
      current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId]
    );
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/teacher/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, className, dueDate, studentIds })
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? 'Ödev oluşturulamadı.');
      return;
    }

    router.push('/teacher');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <form onSubmit={onSubmit} className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Öğretmen Paneli</p>
        <h1 className="mt-2 text-3xl font-semibold text-black">Yeni Ödev Ver</h1>
        <p className="mt-2 text-sm text-gray-600">Ödevi oluştur, teslim tarihini belirle ve öğrencilere ata.</p>

        <div className="mt-6 space-y-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ödev başlığı"
            className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ödev açıklaması"
            rows={5}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              placeholder="Sınıf / grup"
              className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            />
          </div>

          <div className="rounded-2xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-black">Öğrenci Seç</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {students.map((student) => (
                <label key={student.id} className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-100 p-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={studentIds.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                  />
                  <span>{student.fullName} ({student.classLevel ?? student.username})</span>
                </label>
              ))}
              {students.length === 0 ? <p className="text-sm text-gray-500">Henüz öğrenci hesabı bulunamadı.</p> : null}
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/teacher')}
              className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600"
            >
              Vazgeç
            </button>
            <button
              disabled={loading}
              className="rounded-full bg-[#ff611a] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Kaydediliyor...' : 'Ödevi Kaydet'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
