import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  invert?: boolean;
  href?: string;
};

export function BrandMark({ className, invert = false, href = '/' }: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex w-[170px] shrink-0 items-center transition hover:opacity-90', className)}
      aria-label="Fabrika Eğitim Akademi"
    >
      <span
        className={cn(
          'relative block h-14 w-full overflow-hidden transition group-hover:scale-[1.02]',
          invert ? 'rounded-lg bg-white px-2 py-1' : ''
        )}
      >
        <Image
          src="/fabrika-egitim-logo.svg"
          alt="Fabrika Eğitim Akademi"
          fill
          priority
          unoptimized
          sizes="170px"
          className="object-contain"
        />
      </span>
    </Link>
  );
}
