import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = getAdminSession();
  return NextResponse.json({
    isAdmin: session?.role === 'admin',
    isTeacher: session?.role === 'teacher',
    isStudent: session?.role === 'student',
    role: session?.role ?? null,
    username: session?.username ?? null,
    fullName: session?.fullName ?? session?.username ?? null,
    userId: session?.userId ?? null,
    canEditCms: session?.role === 'admin'
  });
}
