'use client';

import type { Game } from '@/entities/Game';

interface GameHistoryProps {
  games: Game[];
  currentGameId: number | null;
  onSelectGame: (id: number) => void;
  onNewGame: () => void;
}

function formatDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return date.toLocaleString();
}

function getResultLabel(game: Game): { text: string; className: string } {
  if (game.status === 'won') {
    return { text: `Winner: ${game.winner}`, className: game.winner === 'X' ? 'result-x' : 'result-o' };
  }
  if (game.status === 'draw') {
    return { text: 'Draw', className: 'result-draw' };
  }
  return { text: 'In Progress', className: 'result-inprogress' };
}

export default function GameHistory({
  games,
  currentGameId,
  onSelectGame,
  onNewGame,
}: GameHistoryProps) {
  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>Game History</h2>
        <button className="btn-new-game" onClick={onNewGame}>
          New Game
        </button>
      </div>
      {games.length === 0 ? (
        <p className="no-games">No games yet. Start a new game!</p>
      ) : (
        <ul className="history-list">
          {games.map((game) => {
            const result = getResultLabel(game);
            return (
              <li
                key={game.id}
                className={[
                  'history-item',
                  currentGameId === game.id ? 'history-item-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSelectGame(game.id)}
              >
                <span className="game-id">Game #{game.id}</span>
                <span className={`game-result ${result.className}`}>{result.text}</span>
                <span className="game-date">{formatDate(game.createdAt)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
