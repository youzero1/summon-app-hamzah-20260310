# Calculator App

A fullstack calculator application built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- Basic arithmetic operations: addition, subtraction, multiplication, division
- Persistent calculation history stored in SQLite
- Server-side calculation via REST API
- Responsive, modern UI
- Docker-ready for deployment

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite via `better-sqlite3`
- **ORM**: TypeORM
- **Styling**: Plain CSS (globals.css)

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
cd calculator-app
npm i
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env` file in the project root:

```
DATABASE_PATH=./database.sqlite
```

## Docker Deployment

### Using Docker Compose

```bash
docker-compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Using Docker directly

```bash
docker build -t calculator-app .
docker run -p 3000:3000 calculator-app
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/calculations` | Get all calculation history |
| `POST` | `/api/calculations` | Perform a calculation and save it |
| `DELETE` | `/api/calculations` | Clear all calculation history |

### POST `/api/calculations`

Request body:
```json
{
  "operand1": 10,
  "operand2": 5,
  "operator": "+"
}
```

Response:
```json
{
  "id": 1,
  "operand1": 10,
  "operand2": 5,
  "operator": "+",
  "result": 15,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
calculator-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   └── api/
│   │       └── calculations/
│   │           └── route.ts     # API route handlers
│   ├── components/
│   │   ├── Calculator.tsx       # Main calculator component
│   │   ├── Display.tsx          # Display screen component
│   │   └── Button.tsx           # Calculator button component
│   ├── entity/
│   │   └── Calculation.ts       # TypeORM entity
│   └── lib/
│       └── dataSource.ts        # TypeORM data source
├── .env                         # Environment variables
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies
```
