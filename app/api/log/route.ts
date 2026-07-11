import { NextResponse } from 'next/server';
import { writeAuditLog } from '@/lib/audit';
import { getAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req
    .json()
    .catch(async () => {
      const raw = await req.text().catch(() => '');
      if (!raw) return {};
      try {
        return JSON.parse(raw) as Record<string, unknown>;
      } catch {
        return {};
      }
    });
  const { event, actor, meta } = body as {
    event?: string;
    actor?: string;
    meta?: Record<string, unknown>;
  };

  if (!event) {
    return NextResponse.json({ message: 'event alanı zorunlu.' }, { status: 400 });
  }

  const session = getAdminSession();
  const safeActor = actor ?? session?.username ?? null;
  const safeMeta = {
    ...(meta ?? {}),
    role: session?.role ?? null
  };

  try {
    await writeAuditLog({
      event,
      actor: safeActor,
      meta: safeMeta
    });
  } catch (err) {
    console.error('LOG ERROR:', err);
    // hata olsa bile endpoint patlamasın
    return NextResponse.json({ ok: false, warning: 'log kaydedilemedi' });
  }

  return NextResponse.json({ ok: true });
}
