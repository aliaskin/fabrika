import { NextResponse } from 'next/server';

import { getAdminSession, isAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type Params = {
  params: { key: string };
};

export async function PATCH(req: Request, { params }: Params) {
  if (!isAdminSession()) {
    return NextResponse.json({ message: 'Yetkisiz işlem' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { value } = body as { value?: string };
  if (typeof value !== 'string') {
    return NextResponse.json({ message: 'Geçersiz içerik.' }, { status: 400 });
  }

  const entry = await prisma.cmsEntry.upsert({
    where: { key: params.key },
    update: { value, deleted: false },
    create: { key: params.key, value, deleted: false }
  });

  const session = getAdminSession();
  await writeAuditLog({
    event: 'cms_update',
    actor: session?.username,
    meta: { key: params.key }
  });

  return NextResponse.json({ ok: true, entry });
}

export async function DELETE(_: Request, { params }: Params) {
  if (!isAdminSession()) {
    return NextResponse.json({ message: 'Yetkisiz işlem' }, { status: 401 });
  }

  const entry = await prisma.cmsEntry.upsert({
    where: { key: params.key },
    update: { deleted: true },
    create: { key: params.key, value: '', deleted: true }
  });

  const session = getAdminSession();
  await writeAuditLog({
    event: 'cms_delete',
    actor: session?.username,
    meta: { key: params.key }
  });

  return NextResponse.json({ ok: true, entry });
}
