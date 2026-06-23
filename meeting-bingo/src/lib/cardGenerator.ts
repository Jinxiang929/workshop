import type { BingoCard, BingoSquare, CategoryId } from '../types';
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
 * Generate a unique bingo card for a category.
 */
export function generateCard(categoryId: CategoryId): BingoCard {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) throw new Error(`Unknown category: ${categoryId}`);

  // Shuffle and pick 24 words (25th is the free space).
  const shuffledWords = shuffle(category.words);
  const selectedWords = shuffledWords.slice(0, 24);

  const squares: BingoSquare[][] = [];
  let wordIndex = 0;

  for (let row = 0; row < 5; row++) {
    const rowSquares: BingoSquare[] = [];

    for (let col = 0; col < 5; col++) {
      const isFreeSpace = row === 2 && col === 2;

      const square: BingoSquare = {
        id: `${row}-${col}`,
        word: isFreeSpace ? 'FREE' : selectedWords[wordIndex++],
        isFilled: isFreeSpace, // Free space starts filled.
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
    words: selectedWords, // Flat list for efficient word detection.
  };
}

/**
 * Get all words on the card (excluding the free space).
 */
export function getCardWords(card: BingoCard): string[] {
  return card.words;
}
