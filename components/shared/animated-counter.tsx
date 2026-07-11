'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
};

export function AnimatedCounter({ value, suffix = '', duration = 1200 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setCount(value);
      return;
    }

    let start = 0;
    const increment = Math.max(1, Math.ceil(value / (duration / 16)));

    const id = window.setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        window.clearInterval(id);
      }
      setCount(start);
    }, 16);

    return () => window.clearInterval(id);
  }, [duration, isInView, shouldReduceMotion, value]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      {count}
      {suffix}
    </span>
  );
}
