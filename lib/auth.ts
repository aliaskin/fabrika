import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

import { prisma } from '@/lib/prisma';

const COOKIE_NAME = 'fabrika_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24;

export type UserRole = 'admin' | 'teacher' | 'student';

export type SessionPayload = {
  userId?: string;
  username: string;
  fullName?: string;
  role: UserRole;
  exp: number;
};

export type AuthContext = {
  session: SessionPayload;
  user: {
    id: string;
    username: string;
    email: string | null;
    fullName: string;
    role: UserRole;
    isActive: boolean;
  };
};

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? 'change-this-secret-in-production';
}

function toBase64Url(input: string) {
  return Buffer.from(input).toString('base64url');
}

function fromBase64Url(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function sign(value: string) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

function createToken(payload: SessionPayload) {
  const encoded = toBase64Url(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

function verifyToken(token: string): SessionPayload | null {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const validSignature = sign(encoded);
  if (signature.length !== validSignature.length) return null;
  const safeEqual = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(validSignature));
  if (!safeEqual) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function isBcryptHash(value: string) {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? 'admin',
    password: process.env.ADMIN_PASSWORD ?? 'admin123'
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  if (!passwordHash) return false;
  if (isBcryptHash(passwordHash)) {
    return bcrypt.compare(password, passwordHash);
  }

  return password === passwordHash;
}

export async function findUserForLogin(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  return prisma.userAccount.findFirst({
    where: {
      OR: [{ username: trimmed }, { email: trimmed }]
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      passwordHash: true,
      role: true,
      isActive: true
    }
  });
}

export function createSessionToken({
  userId,
  username,
  fullName,
  role
}: {
  userId?: string;
  username: string;
  fullName?: string;
  role: UserRole;
}) {
  return createToken({
    userId,
    username,
    fullName,
    role,
    exp: Date.now() + SESSION_TTL_MS
  });
}

export function createAdminSession(username: string, role: UserRole = 'admin') {
  return createSessionToken({ username, fullName: username, role });
}

export function setAdminSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
}

export function clearAdminSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const getAdminSession = getSession;

export function hasRole(roles: UserRole | UserRole[], session = getSession()) {
  if (!session) return false;
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(session.role);
}

export const hasSessionRole = hasRole;

export async function requireRole(roles: UserRole | UserRole[]): Promise<AuthContext | null> {
  const session = getSession();
  if (!session || !hasRole(roles, session)) return null;

  let user: AuthContext['user'] | null = null;

  try {
    user = await prisma.userAccount.findUnique({
      where: { username: session.username },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true
      }
    });
  } catch (error) {
    if (session.role !== 'admin' || session.username !== getAdminCredentials().username) {
      throw error;
    }
  }

  if (!user && session.role === 'admin' && session.username === getAdminCredentials().username) {
    return {
      session,
      user: {
        id: session.userId ?? 'env-admin',
        username: session.username,
        email: null,
        fullName: session.fullName ?? session.username,
        role: 'admin',
        isActive: true
      }
    };
  }

  if (!user || !user.isActive || user.role !== session.role) return null;
  return { session: { ...session, userId: user.id, fullName: user.fullName }, user };
}

export function requireAdmin() {
  return requireRole('admin');
}

export function requireTeacherOrAdmin() {
  return requireRole(['teacher', 'admin']);
}

export function requireStudentOrAdmin() {
  return requireRole(['student', 'admin']);
}

export function isAdminSession() {
  return hasRole('admin');
}

export function isTeacherSession() {
  return hasRole('teacher');
}

export function isStudentSession() {
  return hasRole('student');
}
