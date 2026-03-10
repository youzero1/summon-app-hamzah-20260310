'use client';

import { useState, useEffect, useCallback } from 'react';
import Board from '@/components/Board';
import GameStatusDisplay from '@/components/GameStatus';
import GameHistory from '@/components/GameHistory';
import type { CellValue, Game } from '@/entities/Game';

interface GameData {
  id: number;
  board: string;
  currentTurn: 'X' | 'O';
  winner: 'X' | 'O' | null;
  status: 'in_progress' | 'won' | 'draw';
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch('/api/games');
      if (!res.ok) throw new Error('Failed to fetch games');
      const data: GameData[] = await res.json();
      setGames(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const startNewGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/games', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create game');
      const game: GameData = await res.json();
      setCurrentGame(game);
      setGames((prev) => [game, ...prev]);
    } catch (err) {
      setError('Could not start a new game. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectGame = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/games/${id}`);
      if (!res.ok) throw new Error('Failed to fetch game');
      const game: GameData = await res.json();
      setCurrentGame(game);
    } catch (err) {
      setError('Could not load game. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const makeMove = useCallback(
    async (position: number) => {
      if (!currentGame || currentGame.status !== 'in_progress') return;
      setError(null);
      try {
        const res = await fetch(`/api/games/${currentGame.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position }),
        });
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || 'Failed to make move.');
          return;
        }
        const updatedGame: GameData = await res.json();
        setCurrentGame(updatedGame);
        setGames((prev) =>
          prev.map((g) => (g.id === updatedGame.id ? updatedGame : g))
        );
      } catch (err) {
        setError('Could not make move. Please try again.');
        console.error(err);
      }
    },
    [currentGame]
  );

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const parsedBoard: CellValue[] = currentGame
    ? JSON.parse(currentGame.board)
    : [];

  return (
    <div className="app-container">
      <h1 className="app-title">Tic Tac Toe</h1>
      <div className="main-layout">
        {/* Game Panel */}
        <div className="game-panel">
          {loading && <div className="loading-screen">Loading...</div>}
          {!loading && !currentGame && (
            <div className="loading-screen">
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '16px', color: 'var(--color-text-muted)' }}>
                  No game selected. Start a new game!
                </p>
                <button className="btn-new-game" style={{ fontSize: '1rem', padding: '12px 28px' }} onClick={startNewGame}>
                  Start New Game
                </button>
              </div>
            </div>
          )}
          {!loading && currentGame && (
            <>
              <GameStatusDisplay
                currentTurn={currentGame.currentTurn}
                winner={currentGame.winner}
                status={currentGame.status}
              />
              <Board
                board={parsedBoard}
                onSquareClick={makeMove}
                gameOver={currentGame.status !== 'in_progress'}
              />
              {currentGame.status !== 'in_progress' && (
                <button
                  className="btn-new-game"
                  style={{ fontSize: '1rem', padding: '12px 28px', marginTop: '8px' }}
                  onClick={startNewGame}
                >
                  Play Again
                </button>
              )}
              {error && <div className="error-message">{error}</div>}
            </>
          )}
          {!loading && error && !currentGame && (
            <div className="error-message">{error}</div>
          )}
        </div>

        {/* History Panel */}
        <GameHistory
          games={games as unknown as Game[]}
          currentGameId={currentGame?.id ?? null}
          onSelectGame={selectGame}
          onNewGame={startNewGame}
        />
      </div>
    </div>
  );
}
