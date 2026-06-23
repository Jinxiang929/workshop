import type { BingoCard, GameState, WinningLine } from '../types';

const PLAY_URL = 'https://meeting-bingo.vercel.app';

/**
 * Build an emoji grid of the card: 🟩 winning square, 🟦 filled, ⬜ empty,
 * ⭐ free space.
 */
function buildGrid(card: BingoCard, winningLine: WinningLine | null): string {
  const winning = new Set(winningLine?.squares ?? []);
  return card.squares
    .map((row) =>
      row
        .map((sq) => {
          if (winning.has(sq.id)) return '🟩';
          if (sq.isFreeSpace) return '⭐';
          if (sq.isFilled) return '🟦';
          return '⬜';
        })
        .join(''),
    )
    .join('\n');
}

/**
 * Build the shareable text summary. Pastes cleanly into Slack/Teams/Discord.
 */
export function buildShareText(game: GameState): string {
  if (!game.card) return '';
  const seconds =
    game.startedAt && game.completedAt
      ? Math.round((game.completedAt - game.startedAt) / 1000)
      : null;
  const time = seconds !== null ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : '—';

  return [
    '🎯 Meeting Bingo — BINGO!',
    buildGrid(game.card, game.winningLine),
    `⏱ ${time} · 🏆 "${game.winningWord ?? ''}"`,
    `Play: ${PLAY_URL}`,
  ].join('\n');
}

export type ShareResult = 'shared' | 'copied' | 'failed';

/**
 * Share via the Web Share API on mobile, falling back to clipboard on desktop.
 * Requires a user gesture + https.
 */
export async function shareResult(game: GameState): Promise<ShareResult> {
  const text = buildShareText(game);
  if (!text) return 'failed';

  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: 'Meeting Bingo', text });
      return 'shared';
    }
  } catch {
    // User cancelled or share failed — fall through to clipboard.
  }

  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
