import { CheckCircle2 } from 'lucide-react';

import { Container } from '@/components/shared/container';
import { MotionReveal } from '@/components/shared/motion-reveal';
import { outcomeItems } from '@/data/site-content';

export function OutcomesSection() {
  return (
    <section className="bg-[#fff8f4] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Öğrenciye Kattıklarımız</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#0b0b0b] md:text-4xl">
            Öğrenciye Kattıklarımız
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Fabrika Eğitim Akademi’de amaç yalnızca ders anlatmak değil; öğrencinin çalışma düzenini, sınav stratejisini ve akademik özgüvenini birlikte geliştirmektir.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomeItems.map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.03}>
              <article className="h-full rounded-lg border border-gray-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition hover:border-[#ff611a]/50">
                <CheckCircle2 className="h-5 w-5 text-[#ff611a]" />
                <h3 className="mt-4 text-base font-semibold text-[#0b0b0b]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
