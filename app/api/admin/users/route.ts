import { NextResponse } from 'next/server';

import { hashPassword, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

type CreateUserBody = {
  username?: string;
  email?: string;
  fullName?: string;
  classLevel?: string;
  password?: string;
  role?: 'admin' | 'teacher' | 'student';
};

const roles = ['admin', 'teacher', 'student'] as const;

export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin görüntüleyebilir.' }, { status: 403 });
  }

  const users = await prisma.userAccount.findMany({
    orderBy: { createdAt: 'desc' },
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

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ message: 'Bu alanı sadece admin düzenleyebilir.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as CreateUserBody;
  const username = body.username?.trim();
  const email = body.email?.trim() || null;
  const fullName = body.fullName?.trim();
  const classLevel = body.classLevel?.trim() || null;
  const password = body.password?.trim();
  const role = body.role;

  if (!username || !fullName || !password || !role) {
    return NextResponse.json({ message: 'Kullanıcı adı, ad soyad, şifre ve rol zorunludur.' }, { status: 400 });
  }

  if (!roles.includes(role)) {
    return NextResponse.json({ message: 'Geçersiz rol.' }, { status: 400 });
  }

  try {
    const user = await prisma.userAccount.create({
      data: {
        username,
        email,
        fullName,
        classLevel: role === 'student' ? classLevel : null,
        passwordHash: await hashPassword(password),
        role
      },
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
      event: 'admin_user_create',
      actor: auth.user.username,
      meta: { role: auth.user.role, targetUser: user.username, targetRole: user.role }
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: 'Bu kullanıcı adı veya e-posta zaten kullanılıyor olabilir.' }, { status: 409 });
  }
}
