import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff611a] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.01]',
  {
    variants: {
      variant: {
        primary:
          'bg-[#ff611a] text-white shadow-[0_8px_25px_rgba(255,97,26,0.35)] hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(255,97,26,0.45)] active:scale-[0.98]',
        secondary:
          'bg-white text-black border border-gray-200 hover:border-[#ff611a] hover:text-[#ff611a] hover:bg-[#ff611a]/5',
        ghost: 'text-black hover:text-[#ff611a] hover:bg-[#ff611a]/10 transition'
      },
      size: {
        default: 'h-11 px-6',
        lg: 'h-12 px-8 text-base',
        sm: 'h-9 px-4 text-xs uppercase'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    if (href) {
      const linkProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;

      return (
        <Link href={href} className={cn(buttonVariants({ variant, size, className }))} {...linkProps}>
          {children}
        </Link>
      );
    }

    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
