import { NextResponse } from 'next/server';

import {
  createAdminSession,
  createSessionToken,
  findUserForLogin,
  getAdminCredentials,
  hashPassword,
  setAdminSessionCookie,
  verifyPassword
} from '@/lib/auth';
import { writeAuditLog } from '@/lib/audit';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body as {
    username?: string;
    password?: string;
  };

  if (!username?.trim() || !password?.trim()) {
    await writeAuditLog({
      event: 'admin_login_failed',
      actor: username ?? 'unknown',
      meta: { reason: 'missing_credentials' }
    });
    return NextResponse.json({ ok: false, message: 'Kullanıcı adı/e-posta ve şifre zorunludur.' }, { status: 400 });
  }

  const user = await findUserForLogin(username);

  if (user) {
    if (!user.isActive) {
      await writeAuditLog({
        event: 'admin_login_failed',
        actor: username,
        meta: { reason: 'inactive_user', role: user.role }
      });
      return NextResponse.json({ ok: false, message: 'Bu kullanıcı hesabı pasif durumda.' }, { status: 403 });
    }

    const passwordOk = await verifyPassword(password, user.passwordHash);
    if (!passwordOk) {
      await writeAuditLog({
        event: 'admin_login_failed',
        actor: username,
        meta: { reason: 'invalid_credentials' }
      });
      return NextResponse.json({ ok: false, message: 'Kullanıcı adı/e-posta veya şifre hatalı.' }, { status: 401 });
    }

    if (user.passwordHash === password) {
      await prisma.userAccount.update({
        where: { id: user.id },
        data: { passwordHash: await hashPassword(password) }
      });
    }

    const token = createSessionToken({
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role
    });
    setAdminSessionCookie(token);

    await writeAuditLog({
      event: 'login_success',
      actor: user.username,
      meta: { role: user.role, fullName: user.fullName }
    });

    return NextResponse.json({
      ok: true,
      role: user.role,
      username: user.username,
      fullName: user.fullName
    });
  }

  const creds = getAdminCredentials();
  if (username !== creds.username || password !== creds.password) {
    await writeAuditLog({
      event: 'admin_login_failed',
      actor: username ?? 'unknown',
      meta: { reason: 'invalid_credentials' }
    });
    return NextResponse.json({ ok: false, message: 'Kullanıcı adı/e-posta veya şifre hatalı.' }, { status: 401 });
  }

  const token = createAdminSession(username, 'admin');
  setAdminSessionCookie(token);

  await writeAuditLog({
    event: 'admin_login_success',
    actor: username,
    meta: { role: 'admin', source: 'env_fallback' }
  });

  return NextResponse.json({ ok: true, role: 'admin', username, fullName: username });
}
