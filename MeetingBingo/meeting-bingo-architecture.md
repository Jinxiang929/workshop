# Meeting Bingo — Architecture Plan

**Version**: 1.0  
**Date**: December 11, 2025  
**Status**: Ready for Implementation  
**Build Target**: 90-minute MVP  
**Stack Philosophy**: Free & Open Source Only  

---

## Executive Summary

This architecture plan defines the technical design for Meeting Bingo, a browser-based bingo game with live audio transcription. The design prioritizes simplicity, zero-cost infrastructure, and rapid development within a 90-minute workshop constraint.

### Architecture Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | React 18 + TypeScript | Workshop familiarity, strong typing |
| Build Tool | Vite | Fast HMR, minimal config |
| Styling | Tailwind CSS | Rapid UI development |
| Speech Recognition | Web Speech API | Free, browser-native, no keys needed |
| State Management | React useState + Context | Simple, no dependencies |
| Persistence | localStorage | No backend required |
| Animation | CSS + canvas-confetti | Lightweight, no deps |
| Deployment | Vercel | Free tier, instant deploys |

### Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Hosting | $0 | Free tier (100GB bandwidth) |
| Web Speech API | $0 | Browser-native |
| Domain | $0 | Use Vercel subdomain |
| CDN | $0 | Included with Vercel |
| **Total** | **$0/month** | — |

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER ENVIRONMENT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         REACT APPLICATION                              │  │
│  │                                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────┐ │  │
│  │  │   UI Layer   │  │  Game Logic  │  │    Speech Recognition        │ │  │
│  │  │              │  │              │  │                              │ │  │
│  │  │ • Components │  │ • Card Gen   │  │ • Web Speech API             │ │  │
│  │  │ • Layouts    │  │ • Win Check  │  │ • Transcript Processing      │ │  │
│  │  │ • Styles     │  │ • Scoring    │  │ • Word Detection             │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────────────┬───────────────┘ │  │
│  │         │                 │                         │                  │  │
│  │         └─────────────────┼─────────────────────────┘                  │  │
│  │                           │                                            │  │
│  │                    ┌──────▼──────┐                                     │  │
│  │                    │   Context   │                                     │  │
│  │                    │    State    │                                     │  │
│  │                    └──────┬──────┘                                     │  │
│  │                           │                                            │  │
│  │                    ┌──────▼──────┐                                     │  │
│  │                    │ localStorage│                                     │  │
│  │                    │ Persistence │                                     │  │
│  │                    └─────────────┘                                     │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     BROWSER APIS (Built-in, Free)                      │  │
│  │                                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ Web Speech  │  │   Audio     │  │   Clipboard │  │   Share     │   │  │
│  │  │     API     │  │   Context   │  │     API     │  │     API     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL EDGE NETWORK                             │
│                         (Static Hosting, CDN, SSL)                           │
│                                                                             │
│                           meetingbingo.vercel.app                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            DATA FLOW                                      │
└──────────────────────────────────────────────────────────────────────────┘

1. CARD GENERATION FLOW
   ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
   │  Select   │───▶│  Shuffle  │───▶│  Pick 24  │───▶│  Render   │
   │ Category  │    │   Words   │    │   Words   │    │   Card    │
   └───────────┘    └───────────┘    └───────────┘    └───────────┘

2. SPEECH RECOGNITION FLOW
   ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
   │   Audio   │───▶│  Speech   │───▶│ Transcript│───▶│   Word    │
   │   Input   │    │    API    │    │   Text    │    │ Detection │
   └───────────┘    └───────────┘    └───────────┘    └─────┬─────┘
                                                            │
   ┌───────────┐    ┌───────────┐    ┌───────────┐         │
   │  Update   │◀───│  Fill     │◀───│  Match    │◀────────┘
   │    UI     │    │  Square   │    │  Found?   │
   └───────────┘    └───────────┘    └───────────┘

3. WIN DETECTION FLOW
   ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
   │  Square   │───▶│  Check    │───▶│  BINGO?   │───▶│ Celebrate │
   │  Filled   │    │  Lines    │    │   Yes!    │    │   & Share │
   └───────────┘    └───────────┘    └───────────┘    └───────────┘
```

---

## Project Structure

```
meeting-bingo/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── postcss.config.js
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root component, routing
│   ├── index.css                   # Tailwind imports
│   │
│   ├── components/
│   │   ├── LandingPage.tsx         # Welcome screen
│   │   ├── CategorySelect.tsx      # Category picker
│   │   ├── GameBoard.tsx           # Main game container
│   │   ├── BingoCard.tsx           # 5x5 card grid
│   │   ├── BingoSquare.tsx         # Individual square
│   │   ├── TranscriptPanel.tsx     # Live transcript display
│   │   ├── WinScreen.tsx           # Victory celebration
│   │   ├── GameControls.tsx        # Buttons and toggles
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Toast.tsx
│   │
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts # Web Speech API wrapper
│   │   ├── useGame.ts              # Game state management
│   │   ├── useBingoDetection.ts    # Win condition checker
│   │   └── useLocalStorage.ts      # Persistence helper
│   │
│   ├── lib/
│   │   ├── cardGenerator.ts        # Card randomization logic
│   │   ├── wordDetector.ts         # Buzzword matching
│   │   ├── bingoChecker.ts         # Win condition logic
│   │   └── shareUtils.ts           # Share functionality
│   │
│   ├── data/
│   │   └── categories.ts           # Buzzword category data
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   │
│   └── context/
│       └── GameContext.tsx         # Global game state
│
└── README.md
```

---

## Core Type Definitions

```typescript
// src/types/index.ts

// =============================================
// CATEGORY & WORDS
// =============================================
export type CategoryId = 'agile' | 'corporate' | 'tech';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  words: string[];
}

// =============================================
// BINGO CARD
// =============================================
export interface BingoSquare {
  id: string;              // Unique ID: "row-col" e.g., "2-3"
  word: string;
  isFilled: boolean;
  isAutoFilled: boolean;   // Filled by speech recognition
  isFreeSpace: boolean;
  filledAt: number | null; // Timestamp
  row: number;
  col: number;
}

export interface BingoCard {
  squares: BingoSquare[][]; // 5x5 grid
  words: string[];          // Flat list for detection
}

// =============================================
// GAME STATE
// =============================================
export type GameStatus = 'idle' | 'setup' | 'playing' | 'won';

export interface WinningLine {
  type: 'row' | 'column' | 'diagonal';
  index: number;           // 0-4 for row/col, 0-1 for diagonal
  squares: string[];       // IDs of winning squares
}

export interface GameState {
  status: GameStatus;
  category: CategoryId | null;
  card: BingoCard | null;
  isListening: boolean;
  startedAt: number | null;
  completedAt: number | null;
  winningLine: WinningLine | null;
  winningWord: string | null;
  filledCount: number;
}

// =============================================
// SPEECH RECOGNITION
// =============================================
export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

// =============================================
// UI STATE
// =============================================
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
}
```

---

## Core Logic Implementation

### Card Generator

```typescript
// src/lib/cardGenerator.ts

import { BingoCard, BingoSquare, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a unique bingo card for a category
 */
export function generateCard(categoryId: CategoryId): BingoCard {
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) throw new Error(`Unknown category: ${categoryId}`);
  
  // Shuffle and pick 24 words (25th is free space)
  const shuffledWords = shuffle(category.words);
  const selectedWords = shuffledWords.slice(0, 24);
  
  // Build 5x5 grid
  const squares: BingoSquare[][] = [];
  let wordIndex = 0;
  
  for (let row = 0; row < 5; row++) {
    const rowSquares: BingoSquare[] = [];
    
    for (let col = 0; col < 5; col++) {
      const isFreeSpace = row === 2 && col === 2;
      
      const square: BingoSquare = {
        id: `${row}-${col}`,
        word: isFreeSpace ? 'FREE' : selectedWords[wordIndex++],
        isFilled: isFreeSpace, // Free space starts filled
        isAutoFilled: false,
        isFreeSpace,
        filledAt: isFreeSpace ? Date.now() : null,
        row,
        col,
      };
      
      rowSquares.push(square);
    }
    
    squares.push(rowSquares);
  }
  
  return {
    squares,
    words: selectedWords, // For efficient word detection
  };
}

/**
 * Get all words on card (excluding free space)
 */
export function getCardWords(card: BingoCard): string[] {
  return card.words;
}
```

### Bingo Checker

```typescript
// src/lib/bingoChecker.ts

import { BingoCard, WinningLine } from '../types';

/**
 * Check all possible winning lines
 * Returns the first winning line found, or null
 */
export function checkForBingo(card: BingoCard): WinningLine | null {
  const { squares } = card;
  
  // Check rows (5 possible)
  for (let row = 0; row < 5; row++) {
    if (squares[row].every(sq => sq.isFilled)) {
      return {
        type: 'row',
        index: row,
        squares: squares[row].map(sq => sq.id),
      };
    }
  }
  
  // Check columns (5 possible)
  for (let col = 0; col < 5; col++) {
    const columnFilled = squares.every(row => row[col].isFilled);
    if (columnFilled) {
      return {
        type: 'column',
        index: col,
        squares: squares.map(row => row[col].id),
      };
    }
  }
  
  // Check diagonal (top-left to bottom-right)
  const diagonal1Filled = [0, 1, 2, 3, 4].every(i => squares[i][i].isFilled);
  if (diagonal1Filled) {
    return {
      type: 'diagonal',
      index: 0,
      squares: [0, 1, 2, 3, 4].map(i => `${i}-${i}`),
    };
  }
  
  // Check diagonal (top-right to bottom-left)
  const diagonal2Filled = [0, 1, 2, 3, 4].every(i => squares[i][4 - i].isFilled);
  if (diagonal2Filled) {
    return {
      type: 'diagonal',
      index: 1,
      squares: [0, 1, 2, 3, 4].map(i => `${i}-${4 - i}`),
    };
  }
  
  return null;
}

/**
 * Count filled squares
 */
export function countFilled(card: BingoCard): number {
  return card.squares.flat().filter(sq => sq.isFilled).length;
}

/**
 * Check how close to bingo (for UI hints)
 */
export function getClosestToWin(card: BingoCard): { needed: number; line: string } | null {
  const { squares } = card;
  let closest = { needed: 5, line: '' };
  
  // Check all lines
  const lines = [
    // Rows
    ...squares.map((row, i) => ({ 
      squares: row, 
      name: `Row ${i + 1}` 
    })),
    // Columns
    ...[0, 1, 2, 3, 4].map(col => ({ 
      squares: squares.map(row => row[col]), 
      name: `Column ${col + 1}` 
    })),
    // Diagonals
    { 
      squares: [0, 1, 2, 3, 4].map(i => squares[i][i]), 
      name: 'Diagonal ↘' 
    },
    { 
      squares: [0, 1, 2, 3, 4].map(i => squares[i][4 - i]), 
      name: 'Diagonal ↙' 
    },
  ];
  
  for (const line of lines) {
    const filled = line.squares.filter(sq => sq.isFilled).length;
    const needed = 5 - filled;
    if (needed < closest.needed && needed > 0) {
      closest = { needed, line: line.name };
    }
  }
  
  return closest.needed < 5 ? closest : null;
}
```

### Word Detector

```typescript
// src/lib/wordDetector.ts

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalize text for comparison
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .trim();
}

/**
 * Check if transcript contains any card words
 * Returns array of detected words
 */
export function detectWords(
  transcript: string, 
  cardWords: string[],
  alreadyFilled: Set<string>
): string[] {
  const normalizedTranscript = normalizeText(transcript);
  const detected: string[] = [];
  
  for (const word of cardWords) {
    // Skip already filled words
    if (alreadyFilled.has(word.toLowerCase())) continue;
    
    const normalizedWord = normalizeText(word);
    
    // Handle multi-word phrases
    if (normalizedWord.includes(' ')) {
      // Direct substring match for phrases
      if (normalizedTranscript.includes(normalizedWord)) {
        detected.push(word);
      }
    } else {
      // Word boundary match for single words
      const regex = new RegExp(`\\b${escapeRegex(normalizedWord)}\\b`, 'i');
      if (regex.test(normalizedTranscript)) {
        detected.push(word);
      }
    }
  }
  
  return detected;
}

/**
 * Common variations/synonyms mapping
 */
export const WORD_ALIASES: Record<string, string[]> = {
  'ci/cd': ['ci cd', 'cicd', 'continuous integration'],
  'mvp': ['minimum viable product', 'm.v.p.'],
  'roi': ['return on investment', 'r.o.i.'],
  'api': ['a.p.i.', 'interface'],
  'devops': ['dev ops', 'dev-ops'],
};

/**
 * Enhanced detection with aliases
 */
export function detectWordsWithAliases(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>
): string[] {
  const detected = detectWords(transcript, cardWords, alreadyFilled);
  
  // Check for aliases
  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase())) continue;
    if (detected.includes(word)) continue;
    
    const aliases = WORD_ALIASES[word.toLowerCase()];
    if (aliases) {
      for (const alias of aliases) {
        if (normalizeText(transcript).includes(alias)) {
          detected.push(word);
          break;
        }
      }
    }
  }
  
  return detected;
}
```

### Speech Recognition Hook

```typescript
// src/hooks/useSpeechRecognition.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { SpeechRecognitionState } from '../types';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Get the SpeechRecognition constructor
const SpeechRecognition = 
  (window as any).SpeechRecognition || 
  (window as any).webkitSpeechRecognition;

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
  
  // Initialize recognition instance
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
      
      setState(prev => ({
        ...prev,
        transcript: prev.transcript + final,
        interimTranscript: interim,
      }));
      
      // Callback with new transcript
      if (final && onResultCallback.current) {
        onResultCallback.current(final);
      }
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setState(prev => ({
        ...prev,
        error: event.error,
        isListening: false,
      }));
    };
    
    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      setState(prev => {
        if (prev.isListening) {
          try {
            recognition.start();
          } catch (e) {
            // Already running
          }
        }
        return prev;
      });
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      recognition.stop();
    };
  }, []);
  
  const startListening = useCallback((onResult?: (transcript: string) => void) => {
    if (!recognitionRef.current) return;
    
    onResultCallback.current = onResult || null;
    
    setState(prev => ({
      ...prev,
      isListening: true,
      transcript: '',
      interimTranscript: '',
      error: null,
    }));
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already running
    }
  }, []);
  
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setState(prev => ({
      ...prev,
      isListening: false,
    }));
    
    recognitionRef.current.stop();
    onResultCallback.current = null;
  }, []);
  
  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
    }));
  }, []);
  
  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}
```

---

## Component Implementation

### Main App Component

```typescript
// src/App.tsx

import { useState } from 'react';
import { GameState, CategoryId } from './types';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';
import { generateCard } from './lib/cardGenerator';

type Screen = 'landing' | 'category' | 'game' | 'win';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [game, setGame] = useState<GameState>({
    status: 'idle',
    category: null,
    card: null,
    isListening: false,
    startedAt: null,
    completedAt: null,
    winningLine: null,
    winningWord: null,
    filledCount: 0,
  });
  
  const handleStart = () => {
    setScreen('category');
  };
  
  const handleCategorySelect = (categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1, // Free space
    });
    setScreen('game');
  };
  
  const handleWin = (winningLine: any, winningWord: string) => {
    setGame(prev => ({
      ...prev,
      status: 'won',
      completedAt: Date.now(),
      winningLine,
      winningWord,
    }));
    setScreen('win');
  };
  
  const handlePlayAgain = () => {
    setScreen('category');
  };
  
  const handleBackToHome = () => {
    setScreen('landing');
    setGame({
      status: 'idle',
      category: null,
      card: null,
      isListening: false,
      startedAt: null,
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 0,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      {screen === 'category' && (
        <CategorySelect 
          onSelect={handleCategorySelect}
          onBack={handleBackToHome}
        />
      )}
      {screen === 'game' && game.card && (
        <GameBoard 
          game={game}
          setGame={setGame}
          onWin={handleWin}
        />
      )}
      {screen === 'win' && (
        <WinScreen 
          game={game}
          onPlayAgain={handlePlayAgain}
          onHome={handleBackToHome}
        />
      )}
    </div>
  );
}
```

### Bingo Square Component

```typescript
// src/components/BingoSquare.tsx

import { BingoSquare as BingoSquareType } from '../types';
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
      className={cn(
        'aspect-square p-2 border-2 rounded-lg transition-all duration-200',
        'flex items-center justify-center text-center',
        'text-xs sm:text-sm font-medium',
        'hover:scale-105 active:scale-95',
        // Default state
        !isFilled && 'bg-white border-gray-200 text-gray-700 hover:border-blue-300',
        // Filled state
        isFilled && !isFreeSpace && 'bg-blue-500 border-blue-600 text-white',
        // Auto-filled animation
        isAutoFilled && 'animate-pulse',
        // Free space
        isFreeSpace && 'bg-amber-100 border-amber-300 text-amber-700 cursor-default',
        // Winning square
        isWinningSquare && 'bg-green-500 border-green-600 text-white ring-2 ring-green-300',
      )}
    >
      <span className={cn(
        'break-words leading-tight',
        isFilled && !isFreeSpace && 'line-through opacity-90'
      )}>
        {isFreeSpace ? '⭐ FREE' : word}
      </span>
    </button>
  );
}
```

### Transcript Panel Component

```typescript
// src/components/TranscriptPanel.tsx

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
  isListening 
}: Props) {
  // Show last 100 characters of transcript
  const displayTranscript = transcript.slice(-100);
  
  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          'w-3 h-3 rounded-full',
          isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
        )} />
        <span className="text-sm font-medium text-gray-600">
          {isListening ? '🎤 Listening...' : '🎤 Paused'}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 min-h-[40px] mb-2">
        <span className="text-gray-800">
          {displayTranscript || 'Waiting for speech...'}
        </span>
        <span className="text-gray-400 italic">
          {interimTranscript}
        </span>
      </div>
      
      {detectedWords.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-500">Detected:</span>
          {detectedWords.slice(-5).map((word, i) => (
            <span 
              key={i}
              className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
            >
              ✨ {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Buzzword Data

```typescript
// src/data/categories.ts

import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'agile',
    name: 'Agile & Scrum',
    description: 'Sprint planning, standups, and retrospectives',
    icon: '🏃',
    words: [
      'sprint', 'backlog', 'standup', 'retrospective', 'velocity',
      'blocker', 'story points', 'epic', 'user story', 'scrum master',
      'product owner', 'kanban', 'burndown', 'refinement', 'iteration',
      'acceptance criteria', 'definition of done', 'capacity', 'throughput',
      'cycle time', 'lead time', 'swimlane', 'ceremony', 'timeboxed',
      'increment', 'artifact', 'transparency', 'inspection', 'adaptation',
      'self-organizing', 'cross-functional', 'servant leader', 'impediment',
      'spike', 'technical debt', 'refactor', 'MVP', 'release', 'deployment',
      'continuous integration', 'CI/CD', 'demo', 'stakeholder', 'prioritize',
      'scope creep', 'sprint goal', 'daily scrum', 'planning poker'
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate Speak',
    description: 'Synergy, leverage, and circling back',
    icon: '💼',
    words: [
      'synergy', 'leverage', 'circle back', 'take offline', 'bandwidth',
      'low-hanging fruit', 'move the needle', 'deep dive', 'touch base',
      'action item', 'deliverable', 'stakeholder', 'alignment', 'visibility',
      'paradigm shift', 'best practice', 'value proposition', 'ROI',
      'bottom line', 'top of mind', 'streamline', 'optimize', 'scalable',
      'proactive', 'holistic', 'robust', 'ecosystem', 'pivot', 'disruption',
      'innovation', 'thought leader', 'core competency', 'mission critical',
      'game changer', 'win-win', 'net-net', 'helicopter view', 'granular',
      'drill down', 'boil the ocean', 'bleeding edge', 'north star',
      'parking lot', 'table this', 'unpack', 'double-click', 'socialize'
    ],
  },
  {
    id: 'tech',
    name: 'Tech & Engineering',
    description: 'APIs, cloud, and architecture discussions',
    icon: '💻',
    words: [
      'API', 'cloud', 'microservices', 'serverless', 'containerized',
      'kubernetes', 'docker', 'CI/CD', 'pipeline', 'deployment',
      'scalability', 'latency', 'throughput', 'database', 'schema',
      'migration', 'refactor', 'technical debt', 'architecture',
      'infrastructure', 'DevOps', 'observability', 'monitoring',
      'alerting', 'incident', 'postmortem', 'SLA', 'uptime',
      'performance', 'optimization', 'caching', 'load balancing',
      'security', 'authentication', 'authorization', 'encryption',
      'compliance', 'audit', 'code review', 'pull request', 'merge',
      'branch', 'release', 'rollback', 'feature flag', 'A/B test'
    ],
  },
];
```

---

## Deployment Configuration

### Vite Configuration

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});
```

### Tailwind Configuration

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

### Package.json

```json
{
  "name": "meeting-bingo",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "canvas-confetti": "^1.9.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}
```

---

## Implementation Phases

### Phase 1: Foundation (20 minutes)

```bash
# Initialize project
npm create vite@latest meeting-bingo -- --template react-ts
cd meeting-bingo
npm install
npm install canvas-confetti
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Tasks**:
1. Configure Tailwind CSS
2. Create type definitions
3. Set up project structure
4. Create category data file

### Phase 2: Core Game (30 minutes)

**Tasks**:
1. Build LandingPage component
2. Build CategorySelect component
3. Build BingoCard and BingoSquare components
4. Implement card generation logic
5. Implement manual square toggle
6. Implement BINGO detection

### Phase 3: Speech Recognition (25 minutes)

**Tasks**:
1. Create useSpeechRecognition hook
2. Implement word detection logic
3. Wire auto-fill to card state
4. Add TranscriptPanel component
5. Handle microphone permissions

### Phase 4: Polish & Deploy (15 minutes)

**Tasks**:
1. Add confetti celebration
2. Build WinScreen component
3. Implement share functionality
4. Deploy to Vercel
5. Test end-to-end flow

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Web Speech API unavailable | Low | High | Feature detection; graceful fallback to manual mode |
| Poor transcription accuracy | Medium | Medium | Manual tap always available; word aliases |
| Workshop time overrun | Medium | Medium | Prioritized phases; P2 features are droppable |
| Cross-browser issues | Low | Low | Target Chrome primarily; progressive enhancement |
| Audio not captured | Medium | Medium | User education; hold phone near speaker |

---

## Testing Checklist

### Manual Testing (Workshop)

```markdown
## Pre-Meeting Test
- [ ] App loads on Chrome
- [ ] Category selection works
- [ ] Card generates with 24 unique words
- [ ] Free space is pre-filled
- [ ] Manual tap fills squares
- [ ] BINGO triggers on 5-in-a-row

## Speech Test
- [ ] Microphone permission requested
- [ ] Listening indicator shows
- [ ] Transcript displays spoken text
- [ ] Buzzwords auto-fill squares
- [ ] Multiple words detected in sentence

## Win Test
- [ ] BINGO detected (row/col/diagonal)
- [ ] Confetti plays
- [ ] Winning line highlighted
- [ ] Game stats displayed
- [ ] Share button works
```

---

## Future Architecture (Post-MVP)

### Multiplayer Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                     FUTURE: MULTIPLAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Option A: WebSocket Server (Requires Backend)                  │
│  • Real-time sync across players                                │
│  • Shared game state                                            │
│  • Live leaderboard                                             │
│  • Cost: $5-20/month for hosting                                │
│                                                                 │
│  Option B: Peer-to-Peer (WebRTC)                                │
│  • No backend required                                          │
│  • Direct browser connections                                   │
│  • Limited to ~10 players                                       │
│  • Cost: Free                                                   │
│                                                                 │
│  Option C: Firebase Realtime Database                           │
│  • Managed real-time sync                                       │
│  • Free tier generous                                           │
│  • Easy implementation                                          │
│  • Cost: Free up to 100 concurrent                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Sources

Mozilla Developer Network. "Web Speech API." *MDN Web Docs*, 2024, https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API.

Mozilla Developer Network. "SpeechRecognition." *MDN Web Docs*, 2024, https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition.

Can I Use. "Speech Recognition API." *Can I Use*, 2024, https://caniuse.com/speech-recognition.

Vercel. "Documentation." *Vercel*, 2025, https://vercel.com/docs.

Vite. "Getting Started." *Vite*, 2024, https://vitejs.dev/guide/.

Tailwind CSS. "Documentation." *Tailwind Labs*, 2024, https://tailwindcss.com/docs.

React. "Documentation." *React*, 2024, https://react.dev.

TypeScript. "Handbook." *Microsoft*, 2024, https://www.typescriptlang.org/docs/.

Canvas Confetti. "GitHub Repository." *GitHub*, https://github.com/catdad/canvas-confetti.

Fisher, Ronald A. and Frank Yates. "Statistical Tables for Biological, Agricultural and Medical Research." *Oliver and Boyd*, 1938.

---

*Document prepared for 021.School Workshop*  
*Implementation Target: 90 minutes to functional MVP*
