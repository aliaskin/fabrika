import { redirect } from 'next/navigation';
import Link from 'next/link';

import { getAdminSession, hasSessionRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminLogsPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin');
  if (!hasSessionRole('admin')) redirect('/admin');

  const [logs, submissions] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200
    }),
    prisma.formSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    })
  ]);

  return (
    <section className="min-h-screen bg-white px-4 pb-16 pt-36 md:pt-40">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#ff611a]">Admin Denetim Merkezi</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">Site Logları, Form Kayıtları ve Rol Hareketleri</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-[#ff611a]/30 px-5 py-2 text-sm font-semibold text-[#ff611a]">
            Panele Dön
          </Link>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-black">Son Form Başvuruları</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-3">Tarih</th>
                  <th className="py-2 pr-3">Ad Soyad</th>
                  <th className="py-2 pr-3">Telefon</th>
                  <th className="py-2 pr-3">Not</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-500">{item.createdAt.toLocaleString('tr-TR')}</td>
                    <td className="py-2 pr-3">{item.fullName}</td>
                    <td className="py-2 pr-3">{item.phone}</td>
                    <td className="py-2 pr-3 text-gray-500">{item.message ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-black">Audit Log</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-3">Tarih</th>
                  <th className="py-2 pr-3">Event</th>
                  <th className="py-2 pr-3">Actor</th>
                  <th className="py-2 pr-3">Rol / İşlem Detayı</th>
                  <th className="py-2 pr-3">IP</th>
                  <th className="py-2 pr-3">Meta</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-500">{log.createdAt.toLocaleString('tr-TR')}</td>
                    <td className="py-2 pr-3 font-medium">{log.event}</td>
                    <td className="py-2 pr-3">{log.actor ?? '-'}</td>
                    <td className="py-2 pr-3 text-gray-600">
                      {typeof log.meta === 'string' && log.meta.includes('teacher')
                        ? 'Öğretmen işlemi'
                        : typeof log.meta === 'string' && log.meta.includes('student')
                          ? 'Öğrenci işlemi'
                          : typeof log.meta === 'string' && log.meta.includes('admin')
                            ? 'Admin işlemi'
                            : '-'}
                    </td>
                    <td className="py-2 pr-3">{log.ip ?? '-'}</td>
                    <td className="max-w-[320px] truncate py-2 pr-3 text-gray-500">{log.meta ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
