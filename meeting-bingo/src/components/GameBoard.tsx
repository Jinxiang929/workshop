import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { BingoCard as BingoCardType, GameState, Toast, WinningLine } from '../types';
import { checkForBingo, countFilled, getClosestToWin } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';
import { generateCard } from '../lib/cardGenerator';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { BingoCard } from './BingoCard';
import { GameControls } from './GameControls';
import { TranscriptPanel } from './TranscriptPanel';
import { ToastStack } from './ui/Toast';
import { Button } from './ui/Button';

interface Props {
  game: GameState;
  setGame: Dispatch<SetStateAction<GameState>>;
  onWin: () => void;
  onHome: () => void;
}

const PRIVACY_MESSAGE =
  '🔒 Audio is processed locally and never recorded. The mic only hears your device.';

/** Among a winning line's squares, the word whose fill completed it (latest filledAt). */
function completingWord(card: BingoCardType, line: WinningLine): string | null {
  const byId = new Map(card.squares.flat().map((s) => [s.id, s]));
  let best: { word: string; at: number } | null = null;
  for (const id of line.squares) {
    const sq = byId.get(id);
    if (!sq || sq.isFreeSpace) continue;
    const at = sq.filledAt ?? 0;
    if (!best || at >= best.at) best = { word: sq.word, at };
  }
  return best?.word ?? null;
}

export function GameBoard({ game, setGame, onWin, onHome }: Props) {
  const speech = useSpeechRecognition();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const hasPromptedRef = useRef(false);
  const toastSeqRef = useRef(0);

  // Mirror current game so the speech callback can read fresh state for the
  // UX-only detection pass without re-subscribing the recognizer.
  const gameRef = useRef(game);
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const pushToast = useCallback((message: string, type: Toast['type']) => {
    const id = `t${toastSeqRef.current++}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Navigate to the win screen once the game is won.
  useEffect(() => {
    if (game.status === 'won') onWin();
  }, [game.status, onWin]);

  // Surface a fatal mic error (e.g. permission denied) and drop to manual mode.
  useEffect(() => {
    if (speech.error === 'not-allowed' || speech.error === 'service-not-allowed') {
      pushToast('🎙️ Mic blocked — playing in manual mode. Tap squares to fill.', 'warning');
    }
  }, [speech.error, pushToast]);

  // Apply a set of word-hits to the card atomically and detect a win.
  const applyAutoFill = useCallback(
    (final: string) => {
      setGame((prev) => {
        if (!prev.card || prev.status === 'won') return prev;

        // Derive the dedup set from prev INSIDE the updater — no parallel
        // alreadyFilled state, so concurrent chunks can't race (plan blocker #3).
        const alreadyFilled = new Set(
          prev.card.squares
            .flat()
            .filter((s) => s.isFilled && !s.isFreeSpace)
            .map((s) => s.word.toLowerCase()),
        );
        const hits = detectWordsWithAliases(final, prev.card.words, alreadyFilled);
        if (hits.length === 0) return prev;

        const hitSet = new Set(hits.map((w) => w.toLowerCase()));
        const now = Date.now();
        const newSquares = prev.card.squares.map((row) =>
          row.map((sq) =>
            !sq.isFilled && hitSet.has(sq.word.toLowerCase())
              ? { ...sq, isFilled: true, isAutoFilled: true, filledAt: now }
              : sq,
          ),
        );
        const newCard: BingoCardType = { ...prev.card, squares: newSquares };
        // Recompute from the card — never increment — so counts can't drift.
        const filledCount = countFilled(newCard);
        const win = checkForBingo(newCard);

        if (win) {
          return {
            ...prev,
            card: newCard,
            filledCount,
            status: 'won',
            winningLine: win,
            winningWord: completingWord(newCard, win),
            completedAt: now,
          };
        }
        return { ...prev, card: newCard, filledCount };
      });
    },
    [setGame],
  );

  // Speech result handler: fire UX feedback from committed state, then apply
  // the authoritative atomic fill.
  const handleResult = useCallback(
    (final: string) => {
      const current = gameRef.current;
      if (current.card && current.status !== 'won') {
        const alreadyFilled = new Set(
          current.card.squares
            .flat()
            .filter((s) => s.isFilled && !s.isFreeSpace)
            .map((s) => s.word.toLowerCase()),
        );
        const hits = detectWordsWithAliases(final, current.card.words, alreadyFilled);
        if (hits.length > 0) {
          setDetectedWords((prev) => [...prev, ...hits]);
          hits.forEach((w) => pushToast(`✨ ${w}`, 'success'));
        }
      }
      applyAutoFill(final);
    },
    [applyAutoFill, pushToast],
  );

  const handleToggleListening = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
      return;
    }
    if (!hasPromptedRef.current) {
      hasPromptedRef.current = true;
      pushToast(PRIVACY_MESSAGE, 'info');
    }
    speech.startListening(handleResult);
  }, [speech, handleResult, pushToast]);

  // Manual tap: toggle a square (free space is locked), recompute, detect win.
  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      setGame((prev) => {
        if (!prev.card || prev.status === 'won') return prev;
        const target = prev.card.squares[row][col];
        if (target.isFreeSpace) return prev;

        const now = Date.now();
        const willFill = !target.isFilled;
        const newSquares = prev.card.squares.map((r) =>
          r.map((sq) =>
            sq.id === target.id
              ? {
                  ...sq,
                  isFilled: willFill,
                  isAutoFilled: false,
                  filledAt: willFill ? now : null,
                }
              : sq,
          ),
        );
        const newCard: BingoCardType = { ...prev.card, squares: newSquares };
        const filledCount = countFilled(newCard);
        const win = checkForBingo(newCard);

        if (win) {
          return {
            ...prev,
            card: newCard,
            filledCount,
            status: 'won',
            winningLine: win,
            winningWord: completingWord(newCard, win),
            completedAt: now,
          };
        }
        return { ...prev, card: newCard, filledCount };
      });
    },
    [setGame],
  );

  const handleNewCard = useCallback(() => {
    setGame((prev) => {
      if (!prev.category) return prev;
      const card = generateCard(prev.category);
      return {
        ...prev,
        card,
        status: 'playing',
        startedAt: Date.now(),
        completedAt: null,
        winningLine: null,
        winningWord: null,
        filledCount: countFilled(card),
      };
    });
    setDetectedWords([]);
  }, [setGame]);

  if (!game.card) return null;

  const closest = getClosestToWin(game.card);
  const oneAway = closest?.needed === 1 ? closest : null;

  return (
    <main className="mx-auto max-w-xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <button onClick={onHome} className="text-sm font-medium text-gray-500 hover:text-gray-800">
          ← Home
        </button>
        <span className="text-lg font-bold text-gray-900">🎯 Meeting Bingo</span>
        <span
          className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
          aria-label={`${game.filledCount - 1} of 24 squares filled`}
        >
          {game.filledCount - 1}/24
        </span>
      </header>

      {oneAway && (
        <div
          className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-sm font-medium text-amber-700"
          aria-live="polite"
        >
          🔥 One away on {oneAway.line}! Need: {oneAway.missingWords.join(', ')}
        </div>
      )}

      <BingoCard card={game.card} winningLine={game.winningLine} onSquareClick={handleSquareClick} />

      <div className="mt-5">
        <GameControls
          isListening={speech.isListening}
          speechSupported={speech.isSupported}
          onNewCard={handleNewCard}
          onToggleListening={handleToggleListening}
        />
      </div>

      {speech.isSupported ? (
        <TranscriptPanel
          transcript={speech.transcript}
          interimTranscript={speech.interimTranscript}
          detectedWords={detectedWords}
          isListening={speech.isListening}
        />
      ) : (
        <p className="mt-4 text-center text-xs text-gray-500">
          Speech recognition isn’t available here — tap squares to play in manual mode.
        </p>
      )}

      <div className="mt-4 text-center">
        <Button variant="ghost" onClick={onHome}>
          Quit game
        </Button>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
