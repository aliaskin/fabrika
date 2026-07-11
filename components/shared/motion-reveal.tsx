'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type MotionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function MotionReveal({ children, className, delay = 0, y = 26 }: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
