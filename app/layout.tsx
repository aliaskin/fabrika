import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans, Yesteryear } from 'next/font/google';

import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { FloatingActionBar } from '@/components/layout/floating-action-bar';
import { ScrollProgress } from '@/components/shared/scroll-progress';
import { AdminProvider } from '@/components/admin/admin-provider';
import { AdminToolbar } from '@/components/admin/admin-toolbar';

import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap'
});

const yesteryear = Yesteryear({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-yesteryear',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fabrikaegitim.com'),
  title: {
    default: 'Fabrika Eğitim Akademi | Beşiktaş LGS ve YKS Hazırlık',
    template: '%s | Fabrika Eğitim Akademi'
  },
  description:
    'Fabrika Eğitim Akademi, Beşiktaş’ta LGS ve YKS hazırlık için butik eğitim, deneme takibi, özel ders ve koçluk desteği sunar.',
  keywords: [
    'Beşiktaş LGS kursu',
    'Beşiktaş YKS kursu',
    'Fabrika Eğitim Akademi',
    'özel ders Beşiktaş',
    'koçluk ve deneme takibi'
  ],
  openGraph: {
    title: 'Fabrika Eğitim Akademi',
    description:
      'Beşiktaş’ta LGS ve YKS hazırlık için butik eğitim, deneme takibi, özel ders ve koçluk desteği.',
    type: 'website',
    locale: 'tr_TR'
  },
  robots: {
    index: true,
    follow: true
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fabrika Eğitim Akademi',
    description:
      'Beşiktaş’ta LGS ve YKS hazırlık için butik eğitim, deneme takibi, özel ders ve koçluk desteği.'
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body
        className={`${jakarta.variable} ${fraunces.variable} ${yesteryear.variable} font-sans antialiased bg-white text-black`}
      >
        <AdminProvider>
          <ScrollProgress />
          <SiteHeader />
          <FloatingActionBar />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
          <AdminToolbar />
        </AdminProvider>
      </body>
    </html>
  );
}