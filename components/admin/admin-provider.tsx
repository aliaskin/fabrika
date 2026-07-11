'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type CmsEntry = {
  key: string;
  value: string;
  deleted: boolean;
};

type UserRole = 'admin' | 'teacher' | 'student';

type AdminContextType = {
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  role: UserRole | null;
  username: string | null;
  fullName: string | null;
  cmsMap: Record<string, CmsEntry>;
  loading: boolean;
  canEditCms: boolean;
  getValue: (key: string, fallback: string) => string;
  isDeleted: (key: string) => boolean;
  saveValue: (key: string, value: string) => Promise<void>;
  deleteValue: (key: string) => Promise<void>;
  logEvent: (event: string, meta?: Record<string, unknown>) => Promise<void>;
};

const AdminContext = createContext<AdminContextType | null>(null);

async function postJson(url: string, body: Record<string, unknown>) {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function safeReadJson<T>(res: Response, fallback: T): Promise<T> {
  try {
    const text = await res.text();
    if (!text) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

function getVisitorId() {
  if (typeof window === 'undefined') return 'server';
  const key = 'fabrika_visitor_id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cmsMap, setCmsMap] = useState<Record<string, CmsEntry>>({});

  const refreshSession = useCallback(async () => {
    const res = await fetch('/api/admin/session', { cache: 'no-store' });
    const data = await safeReadJson<{ isAdmin?: boolean; username?: string | null; fullName?: string | null; role?: UserRole | null }>(res, {});
    setRole(data.role ?? (data.isAdmin ? 'admin' : null));
    setUsername(data.username ?? null);
    setFullName(data.fullName ?? data.username ?? null);
  }, []);
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';
  const canEditCms = isAdmin;

  const refreshCms = useCallback(async () => {
    try {
      const res = await fetch('/api/cms', { cache: 'no-store' });
      const data = await safeReadJson<{ entries?: CmsEntry[] }>(res, {});
      const mapped = (data.entries ?? []).reduce((acc: Record<string, CmsEntry>, item: CmsEntry) => {
        acc[item.key] = item;
        return acc;
      }, {});
      setCmsMap(mapped);
    } catch {
      setCmsMap({});
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await Promise.all([refreshSession(), refreshCms()]);
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refreshCms, refreshSession]);

  useEffect(() => {
    if (loading || !role) return;
    if (role === 'teacher' && !pathname.startsWith('/teacher') && !pathname.startsWith('/api')) {
      router.replace('/teacher');
    }
    if (role === 'student' && !pathname.startsWith('/student') && !pathname.startsWith('/api')) {
      router.replace('/student');
    }
  }, [loading, pathname, role, router]);

  useEffect(() => {
    const analyticsEnabled =
      process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_LOGS === 'true';

    if (!analyticsEnabled) return;

    postJson('/api/log', {
      event: 'page_view',
      actor: getVisitorId(),
      meta: { pathname }
    }).catch(() => undefined);

    return () => {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const payload = JSON.stringify({
          event: 'page_leave',
          actor: getVisitorId(),
          meta: { pathname }
        });
        navigator.sendBeacon('/api/log', payload);
      }
    };
  }, [pathname]);

  const getValue = useCallback(
    (key: string, fallback: string) => {
      const entry = cmsMap[key];
      if (!entry || entry.deleted) return fallback;
      return entry.value;
    },
    [cmsMap]
  );

  const isDeleted = useCallback(
    (key: string) => {
      return Boolean(cmsMap[key]?.deleted);
    },
    [cmsMap]
  );

  const saveValue = useCallback(
    async (key: string, value: string) => {
      await fetch(`/api/cms/${encodeURIComponent(key)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      await refreshCms();
    },
    [refreshCms]
  );

  const deleteValue = useCallback(
    async (key: string) => {
      await fetch(`/api/cms/${encodeURIComponent(key)}`, {
        method: 'DELETE'
      });
      await refreshCms();
    },
    [refreshCms]
  );

  const logEvent = useCallback(async (event: string, meta?: Record<string, unknown>) => {
    await postJson('/api/log', {
      event,
      actor: username ?? getVisitorId(),
      meta
    });
  }, [username]);

  const value = useMemo<AdminContextType>(
    () => ({
      isAdmin,
      isTeacher,
      isStudent,
      role,
      username,
      fullName,
      cmsMap,
      loading,
      canEditCms,
      getValue,
      isDeleted,
      saveValue,
      deleteValue,
      logEvent
    }),
    [isAdmin, isTeacher, isStudent, role, username, fullName, cmsMap, loading, canEditCms, getValue, isDeleted, saveValue, deleteValue, logEvent]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used inside AdminProvider');
  }
  return context;
}
