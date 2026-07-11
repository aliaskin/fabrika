'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string | Date | null;
  className: string | null;
  teacher: { fullName: string };
  students: {
    id: string;
    status: 'assigned' | 'in_progress' | 'completed' | 'checked';
    feedback: string | null;
    student: { fullName: string; username: string };
  }[];
};

const statusLabels = {
  assigned: 'Atandı',
  in_progress: 'Devam ediyor',
  completed: 'Kontrol bekliyor',
  checked: 'Kontrol edildi'
};

export function AssignmentReviewPanel({ initialAssignments }: { initialAssignments: Assignment[] }) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [error, setError] = useState('');

  const refreshAssignments = async () => {
    const res = await fetch('/api/teacher/assignments', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (Array.isArray(data.assignments)) setAssignments(data.assignments);
  };

  const updateStudentAssignment = async (id: string, formData: FormData) => {
    setError('');
    const feedback = formData.get('feedback')?.toString() ?? '';
    const res = await fetch(`/api/teacher/assignments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'checked',
        feedback
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.message ?? 'Ödev kontrolü kaydedilemedi.');
      return;
    }
    await refreshAssignments();
  };

  return (
    <div className="space-y-5">
      {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {assignments.map((assignment) => (
        <article key={assignment.id} className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#ff611a]">{assignment.className ?? 'Genel'}</p>
              <h2 className="mt-1 text-xl font-semibold text-black">{assignment.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{assignment.description}</p>
              <p className="mt-2 text-xs text-gray-500">
                Teslim: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('tr-TR') : '-'}
              </p>
            </div>
            <span className="rounded-full bg-[#ff611a]/10 px-3 py-1 text-xs font-semibold text-[#ff611a]">
              {assignment.students.length} öğrenci
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3">Öğrenci</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3">Geri Bildirim</th>
                  <th className="px-4 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {assignment.students.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-4 font-medium text-black">{item.student.fullName}</td>
                    <td className="px-4 py-4 text-gray-600">{statusLabels[item.status]}</td>
                    <td className="px-4 py-4 text-gray-600">{item.feedback ?? '-'}</td>
                    <td className="px-4 py-4">
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          updateStudentAssignment(item.id, new FormData(event.currentTarget));
                        }}
                        className="flex min-w-[300px] gap-2"
                      >
                        <input
                          name="feedback"
                          defaultValue={item.feedback ?? ''}
                          placeholder="Geri bildirim"
                          className="h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
                        />
                        <button type="submit" className="inline-flex h-10 items-center gap-1 rounded-full bg-[#ff611a] px-3 text-xs font-semibold text-white">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Kontrol Et
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      ))}
      {assignments.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">Henüz ödev yok.</div>
      ) : null}
    </div>
  );
}
