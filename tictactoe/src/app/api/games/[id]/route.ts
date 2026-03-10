import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Game } from '@/entities/Game';
import { checkWinner, checkDraw, isValidMove, applyMove, getNextTurn } from '@/lib/gameLogic';
import type { CellValue } from '@/entities/Game';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Game);
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid game ID.' }, { status: 400 });
    }

    const game = await repo.findOneBy({ id });
    if (!game) {
      return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (err) {
    console.error('GET /api/games/[id] error:', err);
    return NextResponse.json({ error: 'Failed to fetch game.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Game);
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid game ID.' }, { status: 400 });
    }

    const game = await repo.findOneBy({ id });
    if (!game) {
      return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
    }

    const body = await req.json();
    const position: number = body.position;

    if (position === undefined || position === null) {
      return NextResponse.json({ error: 'Position is required.' }, { status: 400 });
    }

    const board: CellValue[] = JSON.parse(game.board);

    const validation = isValidMove(board, position, game.status);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const newBoard = applyMove(board, position, game.currentTurn);
    const winner = checkWinner(newBoard);
    const draw = !winner && checkDraw(newBoard);

    game.board = JSON.stringify(newBoard);

    if (winner) {
      game.winner = winner;
      game.status = 'won';
    } else if (draw) {
      game.winner = null;
      game.status = 'draw';
    } else {
      game.currentTurn = getNextTurn(game.currentTurn);
    }

    await repo.save(game);

    return NextResponse.json(game);
  } catch (err) {
    console.error('PUT /api/games/[id] error:', err);
    return NextResponse.json({ error: 'Failed to make move.' }, { status: 500 });
  }
}
