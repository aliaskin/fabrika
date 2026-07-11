import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type Params = {
  params: { id: string };
};

type StudyPlanBody = {
  studentId?: string;
  title?: string;
  content?: string;
  pdfUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive?: boolean;
};

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as StudyPlanBody;
  const data: {
    studentId?: string;
    title?: string;
    content?: string;
    pdfUrl?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    isActive?: boolean;
  } = {};

  if (body.studentId) data.studentId = body.studentId;
  if (typeof body.title === 'string' && body.title.trim()) data.title = body.title.trim();
  if (typeof body.content === 'string' && body.content.trim()) data.content = body.content.trim();
  if (typeof body.pdfUrl === 'string') data.pdfUrl = body.pdfUrl.trim() || null;
  if (body.pdfUrl === null) data.pdfUrl = null;
  if (typeof body.startDate === 'string') data.startDate = body.startDate ? new Date(body.startDate) : null;
  if (body.startDate === null) data.startDate = null;
  if (typeof body.endDate === 'string') data.endDate = body.endDate ? new Date(body.endDate) : null;
  if (body.endDate === null) data.endDate = null;
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;

  const plan = await prisma.studyPlan.update({
    where: { id: params.id },
    data,
    include: { student: { select: { id: true, fullName: true, username: true } } }
  });

  await writeAuditLog({
    event: 'admin_study_plan_update',
    actor: auth.user.username,
    meta: { role: auth.user.role, studyPlanId: plan.id }
  });

  return NextResponse.json({ plan });
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const plan = await prisma.studyPlan.update({
    where: { id: params.id },
    data: { isActive: false },
    select: { id: true }
  });

  await writeAuditLog({
    event: 'admin_study_plan_deactivate',
    actor: auth.user.username,
    meta: { role: auth.user.role, studyPlanId: plan.id }
  });

  return NextResponse.json({ ok: true });
}
