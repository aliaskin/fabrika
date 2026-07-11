import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    fullName,
    phone,
    grade,
    role,
    message,
    sourcePage
  } = body as {
    fullName?: string;
    phone?: string;
    grade?: string;
    role?: string;
    message?: string;
    sourcePage?: string;
  };

  if (!fullName || !phone) {
    return NextResponse.json({ message: 'Ad soyad ve telefon zorunludur.' }, { status: 400 });
  }

  const record = await prisma.formSubmission.create({
    data: {
      fullName,
      phone,
      grade: grade ?? null,
      role: role ?? null,
      message: message ?? null,
      sourcePage: sourcePage ?? null
    }
  });

  await writeAuditLog({
    event: 'contact_form_submit',
    actor: fullName,
    meta: { id: record.id, sourcePage: sourcePage ?? 'unknown' }
  });

  return NextResponse.json({ ok: true });
}
