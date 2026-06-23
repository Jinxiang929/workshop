import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl bg-white shadow-sm border border-gray-200', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
