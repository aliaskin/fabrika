'use client';

import { useRouter } from 'next/navigation';
import { BookOpenCheck, GraduationCap, LogOut, ShieldCheck } from 'lucide-react';

import { useAdmin } from '@/components/admin/admin-provider';

export function AdminToolbar() {
  const router = useRouter();
  const { role, username } = useAdmin();

  if (!role) return null;

  const roleLabels = {
    admin: 'Admin',
    teacher: 'Öğretmen',
    student: 'Öğrenci'
  } as const;

  const RoleIcon = role === 'admin' ? ShieldCheck : role === 'teacher' ? BookOpenCheck : GraduationCap;

  return (
    <div className="fixed right-4 top-24 z-[80] rounded-2xl border border-[#ff611a]/25 bg-white/95 px-3 py-2 text-xs shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur md:right-6 md:top-28">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1 text-[#ff611a]">
          <RoleIcon className="h-3.5 w-3.5" />
          {roleLabels[role]}: {username}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-gray-600 transition hover:border-red-300 hover:text-red-600"
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.replace('/admin');
            router.refresh();
            window.location.href = '/admin';
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
          Çıkış
        </button>
      </div>
    </div>
  );
}
