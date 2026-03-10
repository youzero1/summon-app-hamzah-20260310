'use client';

import type { GameStatus } from '@/entities/Game';

interface GameStatusProps {
  currentTurn: 'X' | 'O';
  winner: 'X' | 'O' | null;
  status: GameStatus;
}

export default function GameStatusDisplay({ currentTurn, winner, status }: GameStatusProps) {
  let message: string;
  let className = 'status-message';

  if (status === 'won' && winner) {
    message = `Player ${winner} wins! 🎉`;
    className += winner === 'X' ? ' status-x' : ' status-o';
  } else if (status === 'draw') {
    message = "It's a draw! 🤝";
    className += ' status-draw';
  } else {
    message = `Player ${currentTurn}'s turn`;
    className += currentTurn === 'X' ? ' status-x' : ' status-o';
  }

  return <div className={className}>{message}</div>;
}
