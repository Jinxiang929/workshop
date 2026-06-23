import { cn } from '../lib/utils';

interface Props {
  transcript: string;
  interimTranscript: string;
  detectedWords: string[];
  isListening: boolean;
}

export function TranscriptPanel({
  transcript,
  interimTranscript,
  detectedWords,
  isListening,
}: Props) {
  // Show only the tail of the transcript.
  const displayTranscript = transcript.slice(-120);

  return (
    <div className="mt-4 rounded-lg bg-gray-100 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div
          className={cn(
            'h-3 w-3 rounded-full',
            isListening ? 'bg-red-500 motion-safe:animate-pulse' : 'bg-gray-400',
          )}
        />
        <span className="text-sm font-medium text-gray-600" aria-live="polite">
          {isListening ? '🎤 Listening…' : '🎤 Paused'}
        </span>
      </div>

      <div className="mb-2 min-h-[40px] text-sm text-gray-600">
        <span className="text-gray-800">{displayTranscript || 'Waiting for speech…'}</span>{' '}
        <span className="italic text-gray-400">{interimTranscript}</span>
      </div>

      {detectedWords.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-1 border-t border-gray-200 pt-2"
          aria-live="polite"
        >
          <span className="text-xs text-gray-500">Detected:</span>
          {detectedWords.slice(-5).map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
            >
              ✨ {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
