'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle, PhoneCall } from 'lucide-react';

import { contactInfo } from '@/data/site-content';

const actions = [
  {
    label: 'Ara',
    href: contactInfo.phoneHref,
    icon: PhoneCall
  },
  {
    label: 'WhatsApp',
    href: contactInfo.whatsappHref,
    icon: MessageCircle
  },
  {
    label: 'İletişim',
    href: '/iletisim',
    icon: MapPin
  }
];

export function FloatingActionBar() {
  return (
    <aside className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-3xl border border-[#ff611a]/25 bg-white/90 p-2 shadow-[0_14px_36px_rgba(0,0,0,0.12)] backdrop-blur">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isExternal = action.href.startsWith('http') || action.href.startsWith('tel:');

          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.32 }}
              className="group relative"
            >
              {isExternal ? (
                <a
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white text-gray-600 transition hover:-translate-y-0.5 hover:border-[#ff611a]/60 hover:text-[#ff611a]"
                  aria-label={action.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={action.href}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white text-gray-600 transition hover:-translate-y-0.5 hover:border-[#ff611a]/60 hover:text-[#ff611a]"
                  aria-label={action.label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              )}
              <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[#ff611a]/20 bg-white px-3 py-1 text-xs text-gray-700 opacity-0 shadow-sm transition group-hover:opacity-100">
                {action.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </aside>
  );
}
