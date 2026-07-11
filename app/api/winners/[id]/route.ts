import { NextResponse } from 'next/server';

import { getAdminSession, isAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type Params = {
  params: { id: string };
};

export async function PATCH(req: Request, { params }: Params) {
  if (!isAdminSession()) {
    return NextResponse.json({ message: 'Yetkisiz işlem' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const winner = await prisma.winner.update({
    where: { id: params.id },
    data: {
      fullName: body.fullName,
      university: body.university,
      department: body.department,
      year: body.year,
      rank: body.rank,
      photoUrl: body.photoUrl,
      note: body.note,
      isActive: body.isActive
    }
  });

  const session = getAdminSession();
  await writeAuditLog({
    event: 'winner_update',
    actor: session?.username,
    meta: { winnerId: winner.id }
  });

  return NextResponse.json({ ok: true, winner });
}

export async function DELETE(_: Request, { params }: Params) {
  if (!isAdminSession()) {
    return NextResponse.json({ message: 'Yetkisiz işlem' }, { status: 401 });
  }

  await prisma.winner.update({
    where: { id: params.id },
    data: { isActive: false }
  });

  const session = getAdminSession();
  await writeAuditLog({
    event: 'winner_delete',
    actor: session?.username,
    meta: { winnerId: params.id }
  });

  return NextResponse.json({ ok: true });
}
