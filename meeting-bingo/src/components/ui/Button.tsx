import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' &&
          'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50',
        variant === 'ghost' && 'bg-transparent text-gray-600 hover:bg-gray-100',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
