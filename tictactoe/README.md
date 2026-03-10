# Tic Tac Toe — Next.js Fullstack App

A fully-featured Tic Tac Toe game built with Next.js 14, TypeScript, TypeORM, and SQLite (better-sqlite3).

## Features

- Interactive 3×3 game board with X (blue) and O (red)
- Server-side game logic: win detection, draw detection, turn enforcement
- Persistent game history stored in SQLite
- REST API: create games, list games, fetch game state, make moves
- Responsive, dark-themed UI
- Highlight winning squares
- Browse and resume previous games

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout
    page.tsx            # Main game page (client component)
    globals.css         # Global styles
    api/
      games/
        route.ts        # POST: create game, GET: list games
        [id]/
          route.ts      # GET: get game, PUT: make a move
  components/
    Board.tsx           # 3x3 game board
    Square.tsx          # Individual square
    GameStatus.tsx      # Turn/winner/draw display
    GameHistory.tsx     # Past games list
  lib/
    database.ts         # TypeORM DataSource
    gameLogic.ts        # Win/draw/move logic
  entities/
    Game.ts             # TypeORM Game entity
```

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
cd tictactoe
npm i
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create or edit `.env` in the project root:

```
DATABASE_PATH=./data/tictactoe.db
```

The app auto-creates the `data/` directory and SQLite database on first run.

## Docker Deployment

### Build and Run with Docker Compose

```bash
cd tictactoe
docker-compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

Game data is persisted in a Docker volume (`tictactoe-data`).

### Manual Docker Build

```bash
docker build -t tictactoe .
docker run -p 3000:3000 -v tictactoe-data:/app/data tictactoe
```

## Coolify Deployment

1. Push this repository to a Git provider (GitHub, GitLab, etc.).
2. In Coolify, create a new service using **Docker Compose**.
3. Point to this repository and set the compose file to `docker-compose.yml`.
4. Deploy — Coolify will build and run the container automatically.
5. The SQLite database is stored in a persistent volume.

## API Endpoints

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| POST   | `/api/games`        | Create a new game                  |
| GET    | `/api/games`        | List all games (newest first)      |
| GET    | `/api/games/[id]`   | Get state of a specific game       |
| PUT    | `/api/games/[id]`   | Make a move `{ position: 0-8 }`    |

## Game Rules

- Player X always goes first.
- Players alternate turns.
- First to get 3 in a row (horizontal, vertical, diagonal) wins.
- If all 9 squares are filled with no winner, it's a draw.
- Invalid moves (occupied square, game over) are rejected by the server.
