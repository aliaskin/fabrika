'use client';

type StudentAssignment = {
  id: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'checked';
  feedback: string | null;
  assignment: {
    title: string;
    description: string;
    dueDate: string | Date | null;
    teacher: { fullName: string };
  };
};

const statusLabels = {
  assigned: 'Atandı',
  in_progress: 'Devam ediyor',
  completed: 'Tamamlandı',
  checked: 'Kontrol edildi'
};

export function StudentAssignmentPanel({ initialAssignments }: { initialAssignments: StudentAssignment[] }) {
  return (
    <div className="space-y-4">
      {initialAssignments.map((item) => (
        <article key={item.id} className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-black">{item.assignment.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{item.assignment.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                <span>Öğretmen: {item.assignment.teacher.fullName}</span>
                <span>Teslim: {item.assignment.dueDate ? new Date(item.assignment.dueDate).toLocaleDateString('tr-TR') : '-'}</span>
              </div>
            </div>
            <span className="rounded-full bg-[#ff611a]/10 px-3 py-1 text-xs font-semibold text-[#ff611a]">
              {statusLabels[item.status]}
            </span>
          </div>
          {item.feedback ? <p className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">Geri bildirim: {item.feedback}</p> : null}
          <p className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            Bu alan bilgilendirme amaçlıdır. Ödev kontrol durumunu öğretmenin günceller.
          </p>
        </article>
      ))}
      {initialAssignments.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">Henüz ödev yok.</div>
      ) : null}
    </div>
  );
}
