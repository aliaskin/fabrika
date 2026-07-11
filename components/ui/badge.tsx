import * as React from 'react';

import { cn } from '@/lib/utils';

export function Badge({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-accent-foreground',
        className
      )}
    >
      {children}
    </span>
  );
}
