import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type CreateExamResultBody = {
  studentId?: string;
  examName?: string;
  examDate?: string;
  correct?: number;
  wrong?: number;
  empty?: number;
  net?: number;
  pdfUrl?: string;
  weakTopics?: string;
  advice?: string;
};

function calculateNet(correct: number, wrong: number) {
  return Math.round((correct - wrong / 4) * 100) / 100;
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin görüntüleyebilir.' }, { status: 403 });
  }

  const results = await prisma.examResult.findMany({
    orderBy: { examDate: 'desc' },
    include: {
      student: { select: { id: true, fullName: true, username: true, classLevel: true } }
    }
  });

  return NextResponse.json({ results });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as CreateExamResultBody;
  const studentId = body.studentId?.trim();
  const examName = body.examName?.trim();

  if (!studentId || !examName) {
    return NextResponse.json({ message: 'Öğrenci ve deneme adı zorunludur.' }, { status: 400 });
  }

  const student = await prisma.userAccount.findFirst({
    where: { id: studentId, role: 'student', isActive: true },
    select: { id: true, classLevel: true }
  });
  if (!student) {
    return NextResponse.json({ message: 'Aktif öğrenci bulunamadı.' }, { status: 404 });
  }

  const correct = Number(body.correct ?? 0);
  const wrong = Number(body.wrong ?? 0);
  const empty = Number(body.empty ?? 0);
  const net = typeof body.net === 'number' ? body.net : calculateNet(correct, wrong);

  const result = await prisma.examResult.create({
    data: {
      studentId,
      examName,
      examDate: body.examDate ? new Date(body.examDate) : new Date(),
      correct,
      wrong,
      empty,
      net,
      pdfUrl: body.pdfUrl?.trim() || null,
      weakTopics: body.weakTopics?.trim() || null,
      advice: body.advice?.trim() || null
    },
    include: {
      student: { select: { id: true, fullName: true, username: true, classLevel: true } }
    }
  });

  await writeAuditLog({
    event: 'admin_exam_result_create',
    actor: auth.user.username,
    meta: { role: auth.user.role, studentId, examResultId: result.id }
  });

  return NextResponse.json({ result });
}
