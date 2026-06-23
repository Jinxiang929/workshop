import type { BingoCard as BingoCardType, WinningLine } from '../types';
import { BingoSquare } from './BingoSquare';

interface Props {
  card: BingoCardType;
  winningLine: WinningLine | null;
  onSquareClick: (row: number, col: number) => void;
}

export function BingoCard({ card, winningLine, onSquareClick }: Props) {
  const winningIds = new Set(winningLine?.squares ?? []);

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2" role="grid" aria-label="Bingo card">
      {card.squares.map((row) =>
        row.map((square) => (
          <BingoSquare
            key={square.id}
            square={square}
            isWinningSquare={winningIds.has(square.id)}
            onClick={() => onSquareClick(square.row, square.col)}
          />
        )),
      )}
    </div>
  );
}
