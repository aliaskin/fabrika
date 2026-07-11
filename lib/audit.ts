import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

function getRequestMeta() {
  const h = headers();
  return {
    ip: h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    userAgent: h.get('user-agent') ?? null
  };
}

export async function writeAuditLog({
  event,
  actor,
  meta
}: {
  event: string;
  actor?: string | null;
  meta?: Record<string, unknown> | null;
}) {
  const { ip, userAgent } = getRequestMeta();
  try {
    await prisma.auditLog.create({
      data: {
        event,
        actor: actor ?? null,
        ip,
        userAgent,
        meta: meta ? JSON.stringify(meta) : null
      }
    });
  } catch (error) {
    console.error('AUDIT LOG ERROR:', error);
  }
}
