'use client';

import Square from './Square';
import type { CellValue } from '@/entities/Game';

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinningSquares(board: CellValue[]): number[] {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return [];
}

interface BoardProps {
  board: CellValue[];
  onSquareClick: (index: number) => void;
  gameOver: boolean;
}

export default function Board({ board, onSquareClick, gameOver }: BoardProps) {
  const winningSquares = getWinningSquares(board);

  return (
    <div className="board">
      {board.map((cell, index) => (
        <Square
          key={index}
          value={cell}
          onClick={() => onSquareClick(index)}
          disabled={gameOver}
          isWinning={winningSquares.includes(index)}
        />
      ))}
    </div>
  );
}
