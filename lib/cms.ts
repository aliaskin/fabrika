import { prisma } from '@/lib/prisma';

export async function getCmsEntriesMap() {
  const entries = await prisma.cmsEntry.findMany();
  return entries.reduce<Record<string, { value: string; deleted: boolean }>>((acc, entry) => {
    acc[entry.key] = { value: entry.value, deleted: entry.deleted };
    return acc;
  }, {});
}

export async function getCmsValue(key: string, fallback: string) {
  const entry = await prisma.cmsEntry.findUnique({ where: { key } });
  if (!entry || entry.deleted) return fallback;
  return entry.value;
}
