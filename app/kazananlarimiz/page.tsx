import type { Metadata } from 'next';

import { Container } from '@/components/shared/container';
import { MotionReveal } from '@/components/shared/motion-reveal';
import { WinnersList } from '@/components/sections/winners-list';

export const metadata: Metadata = {
  title: 'Kazananlarımız | Fabrika Eğitim Akademi',
  description:
    'Fabrika Eğitim Akademi’de admin panelinden yüklenen öğrenci yerleşim kayıtları ve kazananlarımız listesi.'
};

export default function WinnersPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white via-[#fff8f4] to-white pb-14 pt-28 md:pb-20 md:pt-36">
        <Container>
          <MotionReveal>
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Fabrika Eğitim Akademi</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#0b0b0b] md:text-6xl">Kazananlarımız</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-700">
                Önceki başarı listemiz ve admin panelinden yüklenen güncel öğrenci kayıtları bu sayfada birlikte listelenir.
              </p>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-white pb-16 md:pb-24">
        <Container>
          <WinnersList />
        </Container>
      </section>
    </>
  );
}
