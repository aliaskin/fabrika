import { NextResponse } from 'next/server';

import { clearAdminSessionCookie, getAdminSession } from '@/lib/auth';
import { writeAuditLog } from '@/lib/audit';

export async function POST() {
  const session = getAdminSession();
  clearAdminSessionCookie();

  await writeAuditLog({
    event: 'admin_logout',
    actor: session?.username ?? 'unknown'
  });

  return NextResponse.json({ ok: true });
}
