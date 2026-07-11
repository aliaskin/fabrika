import * as React from 'react';

import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[120px] w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
