'use client';

import { motion, useReducedMotion } from 'framer-motion';

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ x: [0, strength * 0.35, 0], y: [0, -strength * 0.35, 0] }}
      transition={{ duration: 0.55, ease: [0.2, 0.95, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
