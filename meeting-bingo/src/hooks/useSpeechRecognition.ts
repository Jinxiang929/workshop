import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpeechRecognitionState } from '../types';

// Minimal typings for the Web Speech API.
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Errors that should permanently stop listening. Everything else
// (no-speech, aborted, network, audio-capture) is transient and we keep going.
const FATAL_ERRORS = new Set(['not-allowed', 'service-not-allowed']);

// Keep only the tail of the transcript so it doesn't grow unbounded over a long
// meeting (plan §3).
const TRANSCRIPT_TAIL = 2000;

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechRecognitionState>({
    isSupported: !!SpeechRecognition,
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const onResultCallback = useRef<((transcript: string) => void) | null>(null);
  // Ref mirrors the user's *intent* to listen. The onend handler reads this to
  // decide whether to auto-restart — kept out of the setState updater so React
  // StrictMode's double-invoke can't trigger a double .start() (plan §2 / §3).
  const wantListeningRef = useRef(false);

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setState((prev) => ({
        ...prev,
        transcript: (prev.transcript + final).slice(-TRANSCRIPT_TAIL),
        interimTranscript: interim,
      }));

      if (final && onResultCallback.current) {
        onResultCallback.current(final);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const fatal = FATAL_ERRORS.has(event.error);
      if (fatal) {
        wantListeningRef.current = false;
      }
      setState((prev) => ({
        ...prev,
        error: event.error,
        // Only fatal errors clear isListening; transient errors keep the UI
        // in the listening state and we auto-restart in onend.
        isListening: fatal ? false : prev.isListening,
      }));
    };

    recognition.onend = () => {
      // Recognizer naturally stops on silence — restart if the user still
      // intends to listen. Side effect lives here, not in a setState updater.
      if (wantListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // Already running — ignore.
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      wantListeningRef.current = false;
      recognition.stop();
    };
  }, []);

  const startListening = useCallback((onResult?: (transcript: string) => void) => {
    if (!recognitionRef.current) return;

    onResultCallback.current = onResult || null;
    wantListeningRef.current = true;

    setState((prev) => ({
      ...prev,
      isListening: true,
      transcript: '',
      interimTranscript: '',
      error: null,
    }));

    try {
      recognitionRef.current.start();
    } catch {
      // Already running — ignore.
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    wantListeningRef.current = false;
    setState((prev) => ({ ...prev, isListening: false }));

    recognitionRef.current.stop();
    onResultCallback.current = null;
  }, []);

  const resetTranscript = useCallback(() => {
    setState((prev) => ({ ...prev, transcript: '', interimTranscript: '' }));
  }, []);

  return { ...state, startListening, stopListening, resetTranscript };
}
