import type { BingoCard, BingoSquare, ClosestLine, WinningLine } from '../types';

/**
 * Check all possible winning lines.
 * Returns the first winning line found, or null.
 */
export function checkForBingo(card: BingoCard): WinningLine | null {
  const { squares } = card;

  // Rows (5 possible).
  for (let row = 0; row < 5; row++) {
    if (squares[row].every((sq) => sq.isFilled)) {
      return {
        type: 'row',
        index: row,
        squares: squares[row].map((sq) => sq.id),
      };
    }
  }

  // Columns (5 possible).
  for (let col = 0; col < 5; col++) {
    const columnFilled = squares.every((row) => row[col].isFilled);
    if (columnFilled) {
      return {
        type: 'column',
        index: col,
        squares: squares.map((row) => row[col].id),
      };
    }
  }

  // Diagonal (top-left to bottom-right).
  if ([0, 1, 2, 3, 4].every((i) => squares[i][i].isFilled)) {
    return {
      type: 'diagonal',
      index: 0,
      squares: [0, 1, 2, 3, 4].map((i) => `${i}-${i}`),
    };
  }

  // Diagonal (top-right to bottom-left).
  if ([0, 1, 2, 3, 4].every((i) => squares[i][4 - i].isFilled)) {
    return {
      type: 'diagonal',
      index: 1,
      squares: [0, 1, 2, 3, 4].map((i) => `${i}-${4 - i}`),
    };
  }

  return null;
}

/**
 * Count filled squares (includes the free space).
 */
export function countFilled(card: BingoCard): number {
  return card.squares.flat().filter((sq) => sq.isFilled).length;
}

/**
 * How close to bingo the card is, for the near-win hint.
 * Returns the closest incomplete line plus the words/square-ids still missing
 * on it (drives the "Need: X" UI), or null if no line is started.
 */
export function getClosestToWin(card: BingoCard): ClosestLine | null {
  const { squares } = card;

  const lines: { squares: BingoSquare[]; name: string }[] = [
    ...squares.map((row, i) => ({ squares: row, name: `Row ${i + 1}` })),
    ...[0, 1, 2, 3, 4].map((col) => ({
      squares: squares.map((row) => row[col]),
      name: `Column ${col + 1}`,
    })),
    { squares: [0, 1, 2, 3, 4].map((i) => squares[i][i]), name: 'Diagonal ↘' },
    { squares: [0, 1, 2, 3, 4].map((i) => squares[i][4 - i]), name: 'Diagonal ↙' },
  ];

  let closest: ClosestLine | null = null;

  for (const line of lines) {
    const missing = line.squares.filter((sq) => !sq.isFilled);
    const needed = missing.length;
    // Only consider lines that are started but not complete.
    if (needed > 0 && needed < 5 && (!closest || needed < closest.needed)) {
      closest = {
        needed,
        line: line.name,
        missingWords: missing.map((sq) => sq.word),
        missingSquareIds: missing.map((sq) => sq.id),
      };
    }
  }

  return closest;
}
