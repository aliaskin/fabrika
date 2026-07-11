'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import type { NavItem } from '@/data/site-content';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export function MobileMenu({ open, onClose, navItems }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[65] bg-[#0b1016]/60 backdrop-blur-md md:hidden"
        >
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 mt-5 max-h-[calc(100dvh-2.5rem)] overflow-y-auto rounded-2xl border border-white/20 bg-[#111b29] p-5 text-white shadow-glow"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Menü</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/30 p-2 text-white/80 transition hover:text-white"
                aria-label="Menüyü kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Accordion type="multiple" defaultValue={['menu-main']} className="space-y-3">
              <AccordionItem value="menu-main" className="rounded-2xl border border-white/15 bg-white/5">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-white hover:text-white">
                  Sayfalar
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <nav className="space-y-2">
                    {navItems.map((item) =>
                      item.children?.length ? (
                        <Accordion key={item.href} type="single" collapsible className="rounded-xl border border-white/10 bg-white/[0.03]">
                          <AccordionItem value={`${item.href}-sub`} className="border-none bg-transparent">
                            <AccordionTrigger className="px-3 py-2 text-sm text-white">{item.label}</AccordionTrigger>
                            <AccordionContent className="px-3 pb-3">
                              <div className="space-y-2">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={onClose}
                                    className="block rounded-lg border border-white/10 px-3 py-2 text-xs text-white/80 transition hover:border-white/30 hover:bg-white/10"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className="block rounded-xl border border-white/10 px-4 py-3 text-sm transition hover:border-white/30 hover:bg-white/10"
                        >
                          {item.label}
                        </Link>
                      )
                    )}
                  </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-6">
              <Button href="/iletisim" size="lg" className="w-full" onClick={onClose}>
                Ücretsiz Seviye Analizi
              </Button>
              <Button href="/admin" variant="secondary" size="lg" className="mt-3 w-full" onClick={onClose}>
                Giriş / Panel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
