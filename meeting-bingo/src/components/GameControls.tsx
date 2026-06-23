import { Button } from './ui/Button';

interface Props {
  isListening: boolean;
  speechSupported: boolean;
  onNewCard: () => void;
  onToggleListening: () => void;
}

export function GameControls({
  isListening,
  speechSupported,
  onNewCard,
  onToggleListening,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="secondary" onClick={onNewCard}>
        🔄 New Card
      </Button>

      {speechSupported ? (
        <Button
          variant={isListening ? 'primary' : 'secondary'}
          onClick={onToggleListening}
          aria-pressed={isListening}
        >
          {isListening ? '⏹ Stop Listening' : '🎤 Start Listening'}
        </Button>
      ) : (
        <span className="text-xs text-gray-500">
          Speech not supported in this browser — manual mode only.
        </span>
      )}
    </div>
  );
}
