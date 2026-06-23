import { useCallback } from 'react';
import type { CategoryId, GameState } from './types';
import { CATEGORIES } from './data/categories';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';
import { generateCard } from './lib/cardGenerator';
import { countFilled } from './lib/bingoChecker';
import { useLocalStorage } from './hooks/useLocalStorage';

type Screen = 'landing' | 'category' | 'game' | 'win';

const STORAGE_VERSION = 1;

const IDLE_GAME: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

interface Persisted {
  screen: Screen;
  game: GameState;
}

/** Resume an in-progress game on reload; a finished ('won') or empty game
 * resets to the landing page. A card built from a now-unknown category is
 * discarded (categories.ts drift, plan §3). */
function reconcile(p: Persisted): Persisted {
  const validCategory =
    p.game.category && CATEGORIES.some((c) => c.id === p.game.category);
  if (p.screen === 'game' && p.game.status === 'playing' && p.game.card && validCategory) {
    return p;
  }
  return { screen: 'landing', game: IDLE_GAME };
}

export default function App() {
  const [persisted, setPersisted, clear] = useLocalStorage<Persisted>(
    'meeting-bingo',
    STORAGE_VERSION,
    { screen: 'landing', game: IDLE_GAME },
  );
  // Reconcile persisted state on each render (resume in-progress, else reset).
  const { screen, game } = reconcile(persisted);

  const setScreen = useCallback(
    (next: Screen) => setPersisted((prev) => ({ ...prev, screen: next })),
    [setPersisted],
  );

  const setGame = useCallback<React.Dispatch<React.SetStateAction<GameState>>>(
    (update) =>
      setPersisted((prev) => ({
        ...prev,
        game: typeof update === 'function' ? (update as (g: GameState) => GameState)(prev.game) : update,
      })),
    [setPersisted],
  );

  const handleStart = useCallback(() => setScreen('category'), [setScreen]);

  const handleCategorySelect = useCallback(
    (categoryId: CategoryId) => {
      const card = generateCard(categoryId);
      setPersisted({
        screen: 'game',
        game: {
          status: 'playing',
          category: categoryId,
          card,
          isListening: false,
          startedAt: Date.now(),
          completedAt: null,
          winningLine: null,
          winningWord: null,
          filledCount: countFilled(card), // free space
        },
      });
    },
    [setPersisted],
  );

  const handleWin = useCallback(() => setScreen('win'), [setScreen]);

  const handlePlayAgain = useCallback(() => setScreen('category'), [setScreen]);

  const handleBackToHome = useCallback(() => {
    clear();
    setPersisted({ screen: 'landing', game: IDLE_GAME });
  }, [clear, setPersisted]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {screen === 'landing' && <LandingPage onStart={handleStart} />}

      {screen === 'category' && (
        <CategorySelect onSelect={handleCategorySelect} onBack={handleBackToHome} />
      )}

      {screen === 'game' && game.card && (
        <GameBoard game={game} setGame={setGame} onWin={handleWin} onHome={handleBackToHome} />
      )}

      {screen === 'win' && (
        <WinScreen game={game} onPlayAgain={handlePlayAgain} onHome={handleBackToHome} />
      )}
    </div>
  );
}
