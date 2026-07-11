import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type StudyPlanBody = {
  studentId?: string;
  title?: string;
  content?: string;
  pdfUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
};

export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin görüntüleyebilir.' }, { status: 403 });
  }

  const plans = await prisma.studyPlan.findMany({
    orderBy: { createdAt: 'desc' },
    include: { student: { select: { id: true, fullName: true, username: true } } }
  });

  return NextResponse.json({ plans });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as StudyPlanBody;
  const studentId = body.studentId?.trim();
  const title = body.title?.trim();
  const content = body.content?.trim() || '';
  const pdfUrl = body.pdfUrl?.trim() || null;

  if (!studentId || !title || (!content && !pdfUrl)) {
    return NextResponse.json({ message: 'Öğrenci, başlık ve içerik veya PDF zorunludur.' }, { status: 400 });
  }

  const student = await prisma.userAccount.findFirst({
    where: { id: studentId, role: 'student', isActive: true },
    select: { id: true }
  });
  if (!student) {
    return NextResponse.json({ message: 'Aktif öğrenci bulunamadı.' }, { status: 404 });
  }

  const plan = await prisma.studyPlan.create({
    data: {
      studentId,
      title,
      content,
      pdfUrl,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      isActive: body.isActive ?? true
    },
    include: { student: { select: { id: true, fullName: true, username: true } } }
  });

  await writeAuditLog({
    event: 'admin_study_plan_create',
    actor: auth.user.username,
    meta: { role: auth.user.role, studentId, studyPlanId: plan.id }
  });

  return NextResponse.json({ plan });
}
