'use client';

import { FormEvent, useMemo, useState } from 'react';
import { RotateCcw, UserPlus } from 'lucide-react';

type Role = 'admin' | 'teacher' | 'student';

type User = {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  classLevel: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string | Date;
};

const roleLabels: Record<Role, string> = {
  admin: 'Admin',
  teacher: 'Öğretmen',
  student: 'Öğrenci'
};

export function UserManagementPanel({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'student' as Role,
    classLevel: 'yks'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stats = useMemo(
    () => ({
      total: users.length,
      teachers: users.filter((user) => user.role === 'teacher').length,
      students: users.filter((user) => user.role === 'student').length
    }),
    [users]
  );

  const refreshUsers = async () => {
    const res = await fetch('/api/admin/users', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (Array.isArray(data.users)) setUsers(data.users);
  };

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? 'Kullanıcı oluşturulamadı.');
      return;
    }

    setForm({ fullName: '', username: '', email: '', password: '', role: 'student', classLevel: 'yks' });
    setMessage('Kullanıcı oluşturuldu.');
    await refreshUsers();
  };

  const updateUser = async (id: string, body: Record<string, unknown>) => {
    setError('');
    setMessage('');
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.message ?? 'Kullanıcı güncellenemedi.');
      return;
    }
    setMessage('Kullanıcı güncellendi.');
    await refreshUsers();
  };

  const resetPassword = async (id: string) => {
    const password = window.prompt('Yeni şifreyi girin');
    if (!password) return;
    await updateUser(id, { password });
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
          <strong className="mt-2 block text-3xl text-black">{stats.total}</strong>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Öğretmen</p>
          <strong className="mt-2 block text-3xl text-black">{stats.teachers}</strong>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Öğrenci</p>
          <strong className="mt-2 block text-3xl text-black">{stats.students}</strong>
        </div>
      </section>

      <form onSubmit={createUser} className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-[#ff611a]" />
          <h2 className="text-xl font-semibold text-black">Yeni Kullanıcı</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <input
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            placeholder="Ad soyad"
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />
          <input
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            placeholder="Kullanıcı adı"
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="E-posta (opsiyonel)"
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Şifre"
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />
          <select
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as Role }))}
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
          >
            <option value="student">Öğrenci</option>
            <option value="teacher">Öğretmen</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={form.classLevel}
            onChange={(event) => setForm((current) => ({ ...current, classLevel: event.target.value }))}
            disabled={form.role !== 'student'}
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a] disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="lgs">LGS</option>
            <option value="9">9. Sınıf</option>
            <option value="10">10. Sınıf</option>
            <option value="11">11. Sınıf</option>
            <option value="yks">YKS</option>
          </select>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            disabled={loading}
            className="rounded-full bg-[#ff611a] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Kaydediliyor...' : 'Kullanıcı Oluştur'}
          </button>
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </form>

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="text-xl font-semibold text-black">Kullanıcı Listesi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3">Ad Soyad</th>
                <th className="px-5 py-3">Kullanıcı</th>
                <th className="px-5 py-3">E-posta</th>
                <th className="px-5 py-3">Sınıf</th>
                <th className="px-5 py-3">Rol</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-5 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-5 py-4 font-medium text-black">{user.fullName}</td>
                  <td className="px-5 py-4 text-gray-600">{user.username}</td>
                  <td className="px-5 py-4 text-gray-600">{user.email ?? '-'}</td>
                  <td className="px-5 py-4">
                    {user.role === 'student' ? (
                      <select
                        value={user.classLevel ?? ''}
                        onChange={(event) => updateUser(user.id, { classLevel: event.target.value || null })}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600"
                      >
                        <option value="">Seçilmedi</option>
                        <option value="lgs">LGS</option>
                        <option value="9">9. Sınıf</option>
                        <option value="10">10. Sınıf</option>
                        <option value="11">11. Sınıf</option>
                        <option value="yks">YKS</option>
                      </select>
                    ) : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(event) => updateUser(user.id, { role: event.target.value })}
                      className="rounded-full border border-[#ff611a]/20 bg-[#ff611a]/10 px-3 py-1 text-xs font-semibold text-[#ff611a]"
                    >
                      <option value="admin">{roleLabels.admin}</option>
                      <option value="teacher">{roleLabels.teacher}</option>
                      <option value="student">{roleLabels.student}</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                      className={user.isActive ? 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500'}
                    >
                      {user.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => resetPassword(user.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-[#ff611a]/40 hover:text-[#ff611a]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Şifre Sıfırla
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    Henüz kullanıcı hesabı oluşturulmadı.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
