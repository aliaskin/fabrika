import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

import { HeroSection } from '@/components/sections/hero-section';
import { OutcomesSection } from '@/components/sections/outcomes-section';
import { ServicesOverview } from '@/components/sections/services-overview';
import { WinnersList } from '@/components/sections/winners-list';
import { Container } from '@/components/shared/container';
import { MotionReveal } from '@/components/shared/motion-reveal';
import { Button } from '@/components/ui/button';
import { contactInfo, programs } from '@/data/site-content';

export const metadata: Metadata = {
  title: 'Fabrika Eğitim Akademi | Beşiktaş LGS ve YKS Hazırlık',
  description:
    'Fabrika Eğitim Akademi, Beşiktaş’ta LGS ve YKS hazırlık için butik eğitim, deneme takibi, özel ders ve koçluk desteği sunar.',
  openGraph: {
    title: 'Fabrika Eğitim Akademi | Beşiktaş LGS ve YKS Hazırlık',
    description:
      'Beşiktaş’ta LGS ve YKS hazırlık için butik eğitim, deneme takibi, özel ders ve koçluk desteği.'
  }
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <OutcomesSection />

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Öğrenciye Kattıklarımız</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#0b0b0b] md:text-4xl">
                Öğrencilerimizin yerleşim listesi
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Önceki başarı listesi ve admin panelinden eklenen güncel kayıtlar birlikte gösterilir.
              </p>
            </div>
            <Button href="/kazananlarimiz" variant="secondary" className="w-full gap-2 sm:w-auto">
              Tüm Liste
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10">
            <WinnersList limit={12} showControls={false} compact />
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Programlarımız</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#0b0b0b] md:text-4xl">
                Sınıf düzeyine göre planlanan hazırlık süreci
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Her program hedefe, seviyeye ve sınav takvimine göre yapılandırılır.
              </p>
            </div>
            <Button href="/programlar" variant="secondary" className="w-full gap-2 sm:w-auto">
              Tüm Programlar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <MotionReveal key={program.id} delay={index * 0.04}>
                <Link
                  href={`/programlar#${program.id}`}
                  className="block h-full rounded-lg border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-[#ff611a]/60 hover:shadow-[0_18px_36px_rgba(255,97,26,0.1)]"
                >
                  <h3 className="text-xl font-semibold text-[#0b0b0b]">{program.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{program.shortDescription}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#ff611a]">
                    Detaylı Bilgi Al
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-gray-100 bg-[#fafafa] py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <MotionReveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Hakkımızda</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#0b0b0b] md:text-4xl">
                  Beşiktaş’ta butik, planlı ve takip odaklı eğitim modeli
                </h2>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <div className="space-y-5 text-base leading-relaxed text-gray-600">
                <p>
                  Fabrika Eğitim Akademi, LGS ve YKS hazırlık sürecinde öğrencinin seviyesine göre ders, deneme, koçluk ve birebir takip desteğini birlikte planlar.
                </p>
                <p>
                  Amaç, öğrencinin yalnızca derse girmesi değil; çalışma düzenini koruması, eksiklerini fark etmesi ve sınav sürecini daha kontrollü yönetmesidir.
                </p>
                <Button href="/hakkimizda" variant="secondary" className="gap-2">
                  Hakkımızda
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <MotionReveal>
              <div className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff611a]/10 text-[#ff611a]">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Konum</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#0b0b0b]">Beşiktaş Merkez</h2>
                <p className="mt-4 text-base leading-relaxed text-gray-600">{contactInfo.address}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button href="/iletisim" className="w-full sm:w-auto">İletişime Geç</Button>
                  <a
                    href={contactInfo.mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:border-[#ff611a] hover:bg-[#ff611a]/5 hover:text-[#ff611a] sm:w-auto"
                  >
                    Konumu Aç
                  </a>
                </div>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <div className="h-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <iframe
                  title="Fabrika Eğitim Akademi Google Maps konumu"
                  src={contactInfo.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="aspect-[16/10] h-full min-h-[280px] w-full md:aspect-[16/7]"
                />
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
