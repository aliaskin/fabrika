'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, LayoutDashboard, LogIn, Menu, PhoneCall, UserCircle } from 'lucide-react';

import { BrandMark } from '@/components/shared/brand-mark';
import { Container } from '@/components/shared/container';
import { Magnetic } from '@/components/shared/magnetic';
import { Button } from '@/components/ui/button';
import { contactInfo, navigation } from '@/data/site-content';
import { cn } from '@/lib/utils';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { useAdmin } from '@/components/admin/admin-provider';

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { role } = useAdmin();
  const isPanelPath = pathname.startsWith('/admin') || pathname.startsWith('/teacher') || pathname.startsWith('/student');
  const panelHref = role === 'teacher' ? '/teacher' : role === 'student' ? '/student' : '/admin';
  const panelNavItems =
    role === 'teacher'
      ? [
          { label: 'Dashboard', href: '/teacher' },
          { label: 'Ödevler', href: '/teacher/assignments' },
          { label: 'Yeni Ödev', href: '/teacher/assignments/new' }
        ]
      : role === 'student'
        ? [
            { label: 'Dashboard', href: '/student' },
            { label: 'Ödevlerim', href: '/student/assignments' },
            { label: 'Denemelerim', href: '/student/exam-results' },
            { label: 'Ders Programım', href: '/student/study-plan' }
          ]
        : role === 'admin' && isPanelPath
          ? [
              { label: 'Panel', href: '/admin' },
              { label: 'Kullanıcılar', href: '/admin/users' },
              { label: 'Öğretmenler', href: '/admin/teachers' },
              { label: 'Öğrenciler', href: '/admin/students' },
              { label: 'Denemeler', href: '/admin/exam-results' },
              { label: 'Programlar', href: '/admin/study-plans' },
              { label: 'Audit', href: '/admin/loglar' }
            ]
          : navigation;
  const navItems = role === 'teacher' || role === 'student' || (role === 'admin' && isPanelPath) ? panelNavItems : navigation;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 pt-2 transition-all duration-300 md:pt-3'
        )}
      >
        <Container size="wide">
          <div
            className={cn(
              'flex items-center gap-2 rounded-2xl border px-3 py-3 transition-all duration-300 md:px-4 backdrop-blur-xl',
              isScrolled
                ? 'border-[#ff611a]/20 bg-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/5'
                : 'border-transparent bg-white/60'
            )}
          >
            <BrandMark className="w-[148px] shrink-0 xl:w-[170px]" href={role === 'teacher' || role === 'student' ? panelHref : '/'} />

            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex">
              {navItems.map((item) => {
                const active = pathname === item.href || item.children?.some((child) => child.href === pathname);
                return (
                  <div key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className="relative inline-flex items-center gap-0.5 rounded-full px-1.5 py-2 text-[11px] font-medium text-gray-600 transition hover:text-black xl:px-2 xl:text-[12px] 2xl:px-3 2xl:text-sm"
                    >
                      {active ? (
                        <motion.span
                          layoutId="active-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-[#ff611a]/10 border border-[#ff611a]/20"
                          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                        />
                      ) : null}
                      {item.label}
                      {item.children?.length ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                    </Link>

                    {item.children?.length ? (
                      <div className="pointer-events-none absolute left-0 top-full z-40 w-64 translate-y-1 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_14px_36px_rgba(0,0,0,0.12)]">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block rounded-xl px-3 py-2 text-sm transition',
                                pathname === child.href
                                  ? 'bg-[#ff611a]/10 text-[#ff611a]'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="hidden shrink-0 items-center gap-1.5 md:flex">
              <Link
                href={role ? panelHref : '/admin'}
                className="inline-flex h-10 items-center gap-1 rounded-full border border-[#ff611a]/25 bg-white px-2.5 text-xs font-semibold text-[#ff611a] transition hover:bg-[#ff611a]/10 2xl:px-3 2xl:text-sm"
              >
                {role ? <UserCircle className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {role ? 'Panel' : 'Giriş'}
              </Link>
              {!role ? (
                <>
                  <Magnetic>
                    <Button href="/iletisim" variant="primary" className="h-10 px-3 text-xs shadow-[0_10px_30px_rgba(255,97,26,0.35)] 2xl:px-5 2xl:text-sm">
                      Ücretsiz Seviye Analizi
                    </Button>
                  </Magnetic>
                  <a
                    href={contactInfo.phoneHref}
                    className="inline-flex h-10 items-center gap-1 rounded-full border border-gray-200 px-2.5 text-xs font-semibold text-gray-700 transition hover:border-[#ff611a] hover:text-[#ff611a] 2xl:px-3 2xl:text-sm"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Ara
                  </a>
                </>
              ) : (
                <Link
                  href={panelHref}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#ff611a] px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,97,26,0.25)]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Hesabım
                </Link>
              )}
            </div>

            <button
              type="button"
              className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-700 transition hover:border-[#ff611a]/40 hover:text-[#ff611a] md:hidden"
              onClick={() => setOpenMenu(true)}
              aria-label="Menüyü aç"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={openMenu} onClose={() => setOpenMenu(false)} navItems={navItems} />
    </>
  );
}
