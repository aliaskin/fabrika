import Link from 'next/link';
import { redirect } from 'next/navigation';

import { UserManagementPanel } from '@/components/admin/user-management-panel';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminUsersPage() {
  const auth = await requireAdmin();
  if (!auth) redirect('/admin');

  const users = await prisma.userAccount.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      classLevel: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  });
  const serializedUsers = JSON.parse(JSON.stringify(users));

  return (
    <main className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Admin Kullanıcı Yönetimi</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Öğretmen, Öğrenci ve Admin Hesapları</h1>
            <p className="mt-2 text-sm text-gray-600">Yeni hesap oluştur, rol değiştir, pasifleştir veya şifre sıfırla.</p>
          </div>
          <Link href="/admin" className="rounded-full border border-[#ff611a]/30 px-5 py-2 text-sm font-semibold text-[#ff611a]">
            Panele Dön
          </Link>
        </div>

        <UserManagementPanel initialUsers={serializedUsers} />
      </div>
    </main>
  );
}
