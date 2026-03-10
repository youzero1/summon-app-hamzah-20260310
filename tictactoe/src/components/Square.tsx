'use client';

import type { CellValue } from '@/entities/Game';

interface SquareProps {
  value: CellValue;
  onClick: () => void;
  disabled: boolean;
  isWinning?: boolean;
}

export default function Square({ value, onClick, disabled, isWinning }: SquareProps) {
  return (
    <button
      className={[
        'square',
        value === 'X' ? 'square-x' : value === 'O' ? 'square-o' : '',
        isWinning ? 'square-winning' : '',
        !value && !disabled ? 'square-empty' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={value ? `Square ${value}` : 'Empty square'}
    >
      {value}
    </button>
  );
}
