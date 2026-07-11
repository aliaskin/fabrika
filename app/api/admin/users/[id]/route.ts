import { NextResponse } from 'next/server';

import { hashPassword, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type Params = {
  params: { id: string };
};

type UpdateUserBody = {
  username?: string;
  email?: string | null;
  fullName?: string;
  classLevel?: string | null;
  password?: string;
  role?: 'admin' | 'teacher' | 'student';
  isActive?: boolean;
};

const roles = ['admin', 'teacher', 'student'] as const;

export async function PATCH(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as UpdateUserBody;
  const data: {
    username?: string;
    email?: string | null;
    fullName?: string;
    classLevel?: string | null;
    passwordHash?: string;
    role?: 'admin' | 'teacher' | 'student';
    isActive?: boolean;
  } = {};

  if (typeof body.username === 'string' && body.username.trim()) data.username = body.username.trim();
  if (typeof body.email === 'string') data.email = body.email.trim() || null;
  if (body.email === null) data.email = null;
  if (typeof body.fullName === 'string' && body.fullName.trim()) data.fullName = body.fullName.trim();
  if (typeof body.classLevel === 'string') data.classLevel = body.classLevel.trim() || null;
  if (body.classLevel === null) data.classLevel = null;
  if (typeof body.password === 'string' && body.password.trim()) data.passwordHash = await hashPassword(body.password.trim());
  if (body.role) {
    if (!roles.includes(body.role)) {
      return NextResponse.json({ message: 'Geçersiz rol.' }, { status: 400 });
    }
    data.role = body.role;
  }
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ message: 'Güncellenecek alan bulunamadı.' }, { status: 400 });
  }

  try {
    const user = await prisma.userAccount.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        classLevel: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    await writeAuditLog({
      event: 'admin_user_update',
      actor: auth.user.username,
      meta: { role: auth.user.role, targetUser: user.username, targetRole: user.role, changed: Object.keys(data) }
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: 'Kullanıcı güncellenemedi.' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const user = await prisma.userAccount.update({
    where: { id: params.id },
    data: { isActive: false },
    select: { username: true, role: true }
  });

  await writeAuditLog({
    event: 'admin_user_deactivate',
    actor: auth.user.username,
    meta: { role: auth.user.role, targetUser: user.username, targetRole: user.role }
  });

  return NextResponse.json({ ok: true });
}
