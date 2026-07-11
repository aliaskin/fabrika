import { NextResponse } from 'next/server';

import { hasSessionRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const entries = await prisma.cmsEntry.findMany();
    return NextResponse.json({
      entries: entries.map((entry) => ({
        key: entry.key,
        value: entry.value,
        deleted: entry.deleted
      }))
    });
  } catch {
    return NextResponse.json({ entries: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!hasSessionRole('admin')) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { key, value, deleted } = body as { key?: string; value?: string; deleted?: boolean };

  if (!key || typeof value !== 'string') {
    return NextResponse.json({ message: 'Geçersiz veri.' }, { status: 400 });
  }

  const entry = await prisma.cmsEntry.upsert({
    where: { key },
    update: { value, deleted: Boolean(deleted) },
    create: { key, value, deleted: Boolean(deleted) }
  });

  return NextResponse.json({ ok: true, entry });
}
