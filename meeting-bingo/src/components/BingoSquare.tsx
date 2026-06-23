import type { BingoSquare as BingoSquareType } from '../types';
import { cn } from '../lib/utils';

interface Props {
  square: BingoSquareType;
  isWinningSquare: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinningSquare, onClick }: Props) {
  const { word, isFilled, isAutoFilled, isFreeSpace } = square;

  return (
    <button
      onClick={onClick}
      disabled={isFreeSpace}
      // Accessibility: expose toggle state and a descriptive label rather than
      // relying on color alone (plan blocker #5).
      aria-pressed={isFilled}
      aria-label={
        isFreeSpace
          ? 'Free space, already filled'
          : `${word}, ${isFilled ? 'filled' : 'not filled'}`
      }
      className={cn(
        'relative aspect-square min-h-[44px] rounded-lg border-2 p-1 transition-all duration-200',
        'flex items-center justify-center text-center',
        'text-[10px] font-medium leading-tight sm:text-xs md:text-sm',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        !isFreeSpace && 'hover:scale-105 active:scale-95',
        // Default (unfilled) state.
        !isFilled && 'bg-white border-gray-200 text-gray-700 hover:border-blue-300',
        // Filled state — canonical token: solid #3b82f6 (blue-500) + white text
        // (resolves PRD §6.6 conflict).
        isFilled && !isFreeSpace && 'bg-blue-500 border-blue-600 text-white',
        // One-shot pop when auto-filled (not a perpetual pulse).
        isAutoFilled && 'animate-fill-pop',
        // Free space.
        isFreeSpace && 'bg-amber-100 border-amber-300 text-amber-700 cursor-default',
        // Winning square.
        isWinningSquare && 'bg-green-500 border-green-600 text-white ring-2 ring-green-300',
      )}
    >
      {/* Non-color affordance for filled squares: a check mark. */}
      {isFilled && !isFreeSpace && (
        <span className="absolute right-0.5 top-0.5 text-[8px]" aria-hidden="true">
          ✓
        </span>
      )}
      <span className={cn('break-words', isFilled && !isFreeSpace && 'opacity-95')}>
        {isFreeSpace ? '⭐ FREE' : word}
      </span>
    </button>
  );
}
