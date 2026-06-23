import { useEffect } from 'react';
import type { Toast as ToastType } from '../../types';
import { cn } from '../../lib/utils';

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 2500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-lg px-4 py-2 text-sm font-medium shadow-md animate-bounce-in',
        toast.type === 'success' && 'bg-green-600 text-white',
        toast.type === 'info' && 'bg-blue-600 text-white',
        toast.type === 'warning' && 'bg-amber-500 text-white',
      )}
    >
      {toast.message}
    </div>
  );
}

interface ToastStackProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

/** Bottom-center stack of transient toasts. The aria-live region announces
 * each message to screen readers (plan blocker #5). */
export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
