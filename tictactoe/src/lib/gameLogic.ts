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

export function checkWinner(board: CellValue[]): 'X' | 'O' | null {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as 'X' | 'O';
    }
  }
  return null;
}

export function checkDraw(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null) && checkWinner(board) === null;
}

export function isValidMove(
  board: CellValue[],
  position: number,
  status: string
): { valid: boolean; error?: string } {
  if (status !== 'in_progress') {
    return { valid: false, error: 'Game is already over.' };
  }
  if (position < 0 || position > 8 || !Number.isInteger(position)) {
    return { valid: false, error: 'Invalid position. Must be an integer 0-8.' };
  }
  if (board[position] !== null) {
    return { valid: false, error: 'Square is already occupied.' };
  }
  return { valid: true };
}

export function applyMove(
  board: CellValue[],
  position: number,
  player: 'X' | 'O'
): CellValue[] {
  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}

export function getNextTurn(current: 'X' | 'O'): 'X' | 'O' {
  return current === 'X' ? 'O' : 'X';
}
