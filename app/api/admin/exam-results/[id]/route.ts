import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type Params = {
  params: { id: string };
};

type UpdateExamResultBody = {
  studentId?: string;
  examName?: string;
  examDate?: string;
  correct?: number;
  wrong?: number;
  empty?: number;
  net?: number;
  pdfUrl?: string | null;
  weakTopics?: string | null;
  advice?: string | null;
};

function calculateNet(correct: number, wrong: number) {
  return Math.round((correct - wrong / 4) * 100) / 100;
}

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const existing = await prisma.examResult.findUnique({
    where: { id: params.id },
    include: { student: { select: { classLevel: true } } }
  });
  if (!existing) {
    return NextResponse.json({ message: 'Deneme sonucu bulunamadı.' }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as UpdateExamResultBody;
  const correct = typeof body.correct === 'number' ? body.correct : existing.correct;
  const wrong = typeof body.wrong === 'number' ? body.wrong : existing.wrong;
  const data: {
    studentId?: string;
    examName?: string;
    examDate?: Date;
    correct?: number;
    wrong?: number;
    empty?: number;
    net?: number;
    pdfUrl?: string | null;
    weakTopics?: string | null;
    advice?: string | null;
  } = {};

  if (body.studentId) data.studentId = body.studentId;
  if (typeof body.examName === 'string' && body.examName.trim()) data.examName = body.examName.trim();
  if (body.examDate) data.examDate = new Date(body.examDate);
  if (typeof body.correct === 'number') data.correct = body.correct;
  if (typeof body.wrong === 'number') data.wrong = body.wrong;
  if (typeof body.empty === 'number') data.empty = body.empty;
  data.net = typeof body.net === 'number' ? body.net : calculateNet(correct, wrong);
  if (typeof body.pdfUrl === 'string' || body.pdfUrl === null) data.pdfUrl = body.pdfUrl?.trim() || null;
  if (typeof body.weakTopics === 'string' || body.weakTopics === null) data.weakTopics = body.weakTopics?.trim() || null;
  if (typeof body.advice === 'string' || body.advice === null) data.advice = body.advice?.trim() || null;

  const result = await prisma.examResult.update({
    where: { id: params.id },
    data,
    include: { student: { select: { id: true, fullName: true, username: true, classLevel: true } } }
  });

  await writeAuditLog({
    event: 'admin_exam_result_update',
    actor: auth.user.username,
    meta: { role: auth.user.role, examResultId: result.id }
  });

  return NextResponse.json({ result });
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  await prisma.examResult.delete({ where: { id: params.id } });
  await writeAuditLog({
    event: 'admin_exam_result_delete',
    actor: auth.user.username,
    meta: { role: auth.user.role, examResultId: params.id }
  });

  return NextResponse.json({ ok: true });
}
