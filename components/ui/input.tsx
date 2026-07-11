import * as React from 'react';

import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-xl border border-border bg-background/70 px-4 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
