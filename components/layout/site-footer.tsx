import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/shared/container';
import { contactInfo, navigation } from '@/data/site-content';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b] py-12 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <Image
                src="/fabrika-egitim-logo.svg"
                alt="Fabrika Eğitim Akademi logosu"
                width={120}
                height={74}
                className="h-16 w-auto object-contain brightness-0 invert"
                unoptimized
              />

              <div>
                <p className="text-lg font-semibold leading-tight text-white">
                  Fabrika Eğitim Akademi
                </p>
                <p className="mt-1 font-yesteryear text-3xl font-normal leading-none text-[#ff611a]">
                  Eğitimin Fabrikası
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              Beşiktaş’ta LGS ve YKS hazırlık sürecinde butik, planlı ve takip odaklı eğitim modeli.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
              Hızlı Linkler
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-[#ff611a]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
              İletişim
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
              <li>{contactInfo.address}</li>
              <li>
                <a href={contactInfo.phoneHref} className="transition hover:text-[#ff611a]">
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={contactInfo.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[#ff611a]"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-xs text-white/45">
          © {new Date().getFullYear()} Fabrika Eğitim Akademi. Tüm hakları saklıdır.
        </div>
      </Container>
    </footer>
  );
}