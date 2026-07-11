import { NextResponse } from 'next/server';

import { getAdminSession, isAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const winners = await prisma.winner.findMany({
      where: { isActive: true },
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }]
    });
    return NextResponse.json({ winners });
  } catch {
    return NextResponse.json({ winners: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!isAdminSession()) {
    return NextResponse.json({ message: 'Yetkisiz işlem' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { fullName, university, department, year, rank, photoUrl, note } = body as {
    fullName?: string;
    university?: string;
    department?: string;
    year?: number;
    rank?: string;
    photoUrl?: string;
    note?: string;
  };

  if (!fullName || !university || !department || !year) {
    return NextResponse.json({ message: 'Zorunlu alanlar eksik.' }, { status: 400 });
  }

  const winner = await prisma.winner.create({
    data: {
      fullName,
      university,
      department,
      year,
      rank: rank ?? null,
      photoUrl: photoUrl ?? null,
      note: note ?? null
    }
  });

  const session = getAdminSession();
  await writeAuditLog({
    event: 'winner_create',
    actor: session?.username,
    meta: { winnerId: winner.id, fullName }
  });

  return NextResponse.json({ ok: true, winner });
}
