'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<{ role?: 'admin' | 'teacher' | 'student' | null; fullName?: string | null } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setSession(data))
      .catch(() => setSession(null));
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? 'Giriş başarısız.');
      return;
    }

    const data = (await res.json().catch(() => ({}))) as { role?: 'admin' | 'teacher' | 'student' };

    if (data.role === 'teacher') {
      window.location.href = '/teacher';
    } else if (data.role === 'student') {
      window.location.href = '/student';
    } else {
      window.location.href = '/admin';
    }
  };

  if (session?.role) {
    const links =
      session.role === 'admin'
        ? [
            ['/admin/users', 'Kullanıcı Yönetimi'],
            ['/admin/teachers', 'Öğretmen Denetimi'],
            ['/admin/students', 'Öğrenci İnceleme'],
            ['/admin/exam-results', 'Deneme Sonuçları'],
            ['/admin/study-plans', 'Ders Programları'],
            ['/admin/loglar', 'Audit Loglar']
          ]
        : session.role === 'teacher'
          ? [
              ['/teacher', 'Öğretmen Dashboard'],
              ['/teacher/assignments', 'Ödev Kontrolü'],
              ['/teacher/assignments/new', 'Yeni Ödev']
            ]
          : [
              ['/student', 'Öğrenci Dashboard'],
              ['/student/assignments', 'Ödevlerim'],
              ['/student/exam-results', 'Deneme Sonuçlarım'],
              ['/student/study-plan', 'Ders Programım']
            ];

    return (
      <section className="min-h-screen bg-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Fabrika Eğitim Akademi</p>
          <h1 className="mt-3 text-3xl font-semibold text-black">Panel</h1>
          <p className="mt-2 text-sm text-gray-600">{session.fullName ?? 'Kullanıcı'} hesabıyla giriş yapıldı.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-black transition hover:border-[#ff611a]/30 hover:text-[#ff611a]">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-[#fff7f3] px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-md rounded-3xl border border-[#ff611a]/20 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <p className="text-xs uppercase tracking-[0.18em] text-[#ff611a]">Fabrika Eğitim Akademi</p>
        <h1 className="mt-3 text-3xl font-semibold text-black">Kullanıcı Girişi</h1>
        <p className="mt-2 text-sm text-gray-600">Rol hesabından otomatik okunur; admin, öğretmen ve öğrenci doğru panele yönlendirilir.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adı"
            className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff611a]"
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#ff611a] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(255,97,26,0.35)] transition hover:-translate-y-0.5 disabled:opacity-60"
            type="submit"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </section>
  );
}
