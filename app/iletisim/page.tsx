import type { Metadata } from 'next';
import { Globe2, MapPin, MessageCircle, Navigation, PhoneCall } from 'lucide-react';

import { Container } from '@/components/shared/container';
import { MotionReveal } from '@/components/shared/motion-reveal';
import { contactInfo } from '@/data/site-content';

export const metadata: Metadata = {
  title: 'İletişim ve Konum | Fabrika Eğitim Akademi',
  description:
    'Fabrika Eğitim Akademi iletişim bilgileri, Beşiktaş konumu, telefon, WhatsApp ve doğrudan konum bilgileri.'
};

const contactCards = [
  {
    title: 'Adres',
    text: contactInfo.address,
    href: contactInfo.mapHref,
    label: 'Konumu aç',
    icon: MapPin
  },
  {
    title: 'Telefon',
    text: contactInfo.phone,
    href: contactInfo.phoneHref,
    label: 'Hemen ara',
    icon: PhoneCall
  },
  {
    title: 'WhatsApp',
    text: 'WhatsApp üzerinden bilgi alın',
    href: contactInfo.whatsappHref,
    label: 'WhatsApp’tan yaz',
    icon: MessageCircle
  }
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white via-[#fff8f4] to-white pb-14 pt-28 md:pb-20 md:pt-36">
        <Container>
          <MotionReveal>
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">İletişim ve Konum</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#0b0b0b] md:text-6xl">
                Fabrika Eğitim Akademi’ye ulaşın
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-700">
                Beşiktaş merkezdeki akademimiz için telefon, WhatsApp veya doğrudan konum bağlantısını kullanabilirsiniz.
              </p>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-white pb-16 md:pb-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {contactCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <MotionReveal key={card.title} delay={index * 0.05}>
                  <article className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff611a]/10 text-[#ff611a]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-[#0b0b0b]">{card.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{card.text}</p>
                    <a
                      href={card.href}
                      target={card.href.startsWith('http') ? '_blank' : undefined}
                      rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ff611a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,97,26,0.28)] transition hover:-translate-y-0.5"
                    >
                      {card.label}
                    </a>
                  </article>
                </MotionReveal>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <MotionReveal>
              <div className="h-full rounded-lg border border-gray-200 bg-[#fafafa] p-6">
                <h2 className="text-2xl font-semibold text-[#0b0b0b]">Kayıt görüşmesi</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{contactInfo.hoursNote}</p>
                <div className="mt-6 space-y-3 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-[#ff611a]" />
                    <a href={contactInfo.website} target="_blank" rel="noreferrer" className="hover:text-[#ff611a]">
                      {contactInfo.website}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-[#ff611a]" />
                    {contactInfo.institution}
                  </p>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={contactInfo.mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:border-[#ff611a] hover:text-[#ff611a]"
                  >
                    Konumu Aç
                  </a>
                  <a
                    href={contactInfo.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:border-[#ff611a] hover:text-[#ff611a]"
                  >
                    WhatsApp’tan Yaz
                  </a>
                  <a
                    href={contactInfo.phoneHref}
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:border-[#ff611a] hover:text-[#ff611a]"
                  >
                    Hemen Ara
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
                  className="aspect-[16/10] h-full min-h-[340px] w-full md:aspect-[16/7]"
                />
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
