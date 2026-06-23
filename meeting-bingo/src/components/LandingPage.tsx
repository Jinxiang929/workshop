import { Button } from './ui/Button';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="text-6xl" aria-hidden="true">
        🎯
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
        Meeting Bingo
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        Turn buzzword-filled meetings into a game. Mark squares as you hear the
        jargon — first to five in a row wins.
      </p>

      <Button size="lg" className="mt-8" onClick={onStart}>
        New Game
      </Button>

      <section className="mt-12 w-full text-left" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          How it works
        </h2>
        <ol className="mt-3 space-y-2 text-gray-700">
          <li>1. Pick a buzzword pack.</li>
          <li>2. Tap squares as you hear them — or enable the mic to auto-fill.</li>
          <li>3. Complete any row, column, or diagonal for BINGO.</li>
        </ol>
      </section>

      <p className="mt-8 text-xs text-gray-400">
        🔒 Audio is processed locally in your browser, never recorded or uploaded.
        Speech auto-fill uses your microphone only.
      </p>
    </main>
  );
}
