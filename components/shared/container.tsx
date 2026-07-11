import { cn } from '@/lib/utils';

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  size?: 'default' | 'wide' | 'narrow';
};

export function Container({ className, children, size = 'default' }: ContainerProps) {
  const maxWidth =
    size === 'wide'
      ? 'max-w-[1280px]'
      : size === 'narrow'
      ? 'max-w-[980px]'
      : 'max-w-[1180px]';

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-5 md:px-8 lg:px-10',
        maxWidth,
        className
      )}
    >
      {children}
    </div>
  );
}
