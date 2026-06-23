import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { GameState } from '../types';
import { CATEGORIES } from '../data/categories';
import { shareResult } from '../lib/shareUtils';
import { BingoCard } from './BingoCard';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

function formatDuration(start: number | null, end: number | null): string {
  if (start === null || end === null) return '—';
  const seconds = Math.round((end - start) / 1000);
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  const [shareLabel, setShareLabel] = useState('📋 Share Result');

  useEffect(() => {
    // No sound — the user is in a meeting. Respect reduced-motion.
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  }, []);

  const handleShare = async () => {
    const result = await shareResult(game);
    setShareLabel(
      result === 'shared' ? '✅ Shared!' : result === 'copied' ? '✅ Copied!' : '⚠️ Share failed',
    );
    window.setTimeout(() => setShareLabel('📋 Share Result'), 2000);
  };

  const categoryName = CATEGORIES.find((c) => c.id === game.category)?.name ?? '—';

  return (
    <main className="mx-auto max-w-md px-4 py-10 text-center">
      <h1 className="text-4xl font-extrabold text-green-600 motion-safe:animate-bounce-in">
        🎉 BINGO! 🎉
      </h1>
      <p className="mt-2 text-gray-600">
        You completed a {game.winningLine?.type ?? 'line'} with{' '}
        <span className="font-semibold text-gray-900">“{game.winningWord ?? ''}”</span>.
      </p>

      {game.card && (
        <div className="mx-auto mt-6 max-w-xs">
          <BingoCard card={game.card} winningLine={game.winningLine} onSquareClick={() => {}} />
        </div>
      )}

      <Card className="mt-6 grid grid-cols-2 gap-3 p-4 text-left">
        <Stat label="Time to bingo" value={formatDuration(game.startedAt, game.completedAt)} />
        <Stat label="Winning word" value={game.winningWord ?? '—'} />
        <Stat label="Squares filled" value={`${game.filledCount - 1}/24`} />
        <Stat label="Category" value={categoryName} />
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        <Button size="lg" onClick={handleShare}>
          {shareLabel}
        </Button>
        <Button variant="secondary" onClick={onPlayAgain}>
          🔁 Play Again
        </Button>
        <Button variant="ghost" onClick={onHome}>
          🏠 Home
        </Button>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  );
}
