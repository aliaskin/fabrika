'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { heroContent } from '@/data/site-content';

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden px-0 pb-16 pt-28 sm:pt-32 md:min-h-screen md:pb-20 md:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-white via-[#fff8f4] to-white" />

      <Container>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <div className="relative w-60 sm:w-72 md:w-80 lg:w-[280px]">
            <div className="absolute inset-x-8 bottom-3 h-8 rounded-full bg-[#ff611a]/20 blur-2xl" />
            <Image
              src="/fabrika-egitim-logo.svg"
              alt="Fabrika Eğitim Akademi logosu"
              width={720}
              height={446}
              priority
              unoptimized
              className="relative h-auto w-full object-contain"
            />
          </div>

          <h1 className="mt-8 max-w-4xl text-3xl font-semibold leading-tight text-[#0b0b0b] sm:text-5xl md:text-6xl">
            {heroContent.title}
          </h1>
          <p className="mt-3 text-xl font-yesteryear text-[#ff611a] sm:text-2xl md:text-3xl">
            {heroContent.slogan}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            {heroContent.description}
          </p>

          <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Button href={heroContent.primaryCta.href} size="lg" className="w-full px-6 sm:w-auto">
              {heroContent.primaryCta.label}
            </Button>
            <Button href={heroContent.secondaryCta.href} variant="secondary" size="lg" className="w-full px-6 sm:w-auto">
              {heroContent.secondaryCta.label}
            </Button>
          </div>

          <p className="mt-6 text-sm font-medium text-gray-500">{heroContent.infoLine}</p>
        </motion.div>
      </Container>
    </section>
  );
}
