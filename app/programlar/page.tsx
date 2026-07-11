import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { Container } from '@/components/shared/container';
import { MotionReveal } from '@/components/shared/motion-reveal';
import { Button } from '@/components/ui/button';
import { programs } from '@/data/site-content';

export const metadata: Metadata = {
  title: 'Programlar | Fabrika Eğitim Akademi',
  description:
    'Fabrika Eğitim Akademi’de 7. sınıf, 8. sınıf LGS, 11. sınıf, 12. sınıf YKS ve mezun programlarını inceleyin.'
};

export default function ProgramsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white via-[#fff8f4] to-white pb-14 pt-28 md:pb-20 md:pt-36">
        <Container>
          <MotionReveal>
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Fabrika Eğitim Akademi</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#0b0b0b] md:text-6xl">Programlarımız</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-700">
                Fabrika Eğitim Akademi’de her sınıf düzeyi için hedefe, seviyeye ve sınav takvimine uygun bir hazırlık süreci planlanır.
              </p>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-white pb-16 md:pb-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <MotionReveal key={program.id} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-[#ff611a]/60 hover:shadow-[0_18px_36px_rgba(255,97,26,0.1)]">
                  <h2 className="text-xl font-semibold text-[#0b0b0b]">{program.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{program.shortDescription}</p>
                  <ul className="mt-5 space-y-2 text-sm text-gray-700">
                    {program.bullets.slice(0, 5).map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff611a]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/programlar#${program.id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#ff611a]">
                    Detaylı Bilgi Al
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-gray-100 bg-[#fafafa] py-16 md:py-24">
        <Container>
          <div className="space-y-8">
            {programs.map((program, index) => (
              <MotionReveal key={program.id} delay={index * 0.03}>
                <article id={program.id} className="scroll-mt-28 rounded-lg border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8">
                  <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Program Detayı</p>
                      <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#0b0b0b]">{program.title}</h2>
                      <p className="mt-4 text-base leading-relaxed text-gray-600">{program.description}</p>
                    </div>
                    <div>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {program.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff611a]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 rounded-lg border border-[#ff611a]/20 bg-[#fff8f4] p-4 text-sm leading-relaxed text-gray-700">
                        {program.result}
                      </p>
                      <Button href="/iletisim" className="mt-5 w-full sm:w-auto">
                        Detaylı Bilgi Al
                      </Button>
                    </div>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
