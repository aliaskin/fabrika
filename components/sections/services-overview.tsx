import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/shared/container';
import { MotionReveal } from '@/components/shared/motion-reveal';
import { services } from '@/data/site-content';

type ServicesOverviewProps = {
  limit?: number;
  withHeader?: boolean;
  withCta?: boolean;
};

export function ServicesOverview({ limit = 6, withHeader = true, withCta = true }: ServicesOverviewProps) {
  const list = services.slice(0, limit);

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        {withHeader ? (
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff611a]">Hizmetler</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#0b0b0b] md:text-4xl">
              LGS ve YKS sürecini destekleyen temel hizmetler
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Her başlık öğrencinin seviyesine, hedeflerine ve ihtiyaç duyduğu takip yoğunluğuna göre birlikte planlanır.
            </p>
          </div>
        ) : null}

        <div className={withHeader ? 'mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3' : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
          {list.map((service, index) => {
            const Icon = service.icon;

            return (
              <MotionReveal key={service.title} delay={index * 0.04}>
                <article className="group h-full rounded-lg border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-[#ff611a]/60 hover:shadow-[0_18px_36px_rgba(255,97,26,0.12)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff611a]/10 text-[#ff611a] transition group-hover:bg-[#ff611a] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#0b0b0b]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{service.description}</p>
                </article>
              </MotionReveal>
            );
          })}
        </div>

        {withCta ? (
          <div className="mt-10 flex justify-center">
            <Button href="/programlar" variant="secondary" size="lg" className="gap-2 border-gray-200 hover:border-[#ff611a] hover:text-[#ff611a]">
              Programları İncele
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
