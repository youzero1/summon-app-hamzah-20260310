import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Game } from '@/entities/Game';

export async function POST(_req: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Game);

    const game = repo.create({
      board: JSON.stringify([null, null, null, null, null, null, null, null, null]),
      currentTurn: 'X',
      winner: null,
      status: 'in_progress',
    });

    await repo.save(game);

    return NextResponse.json(game, { status: 201 });
  } catch (err) {
    console.error('POST /api/games error:', err);
    return NextResponse.json({ error: 'Failed to create game.' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Game);

    const games = await repo.find({
      order: { createdAt: 'DESC' },
    });

    return NextResponse.json(games);
  } catch (err) {
    console.error('GET /api/games error:', err);
    return NextResponse.json({ error: 'Failed to fetch games.' }, { status: 500 });
  }
}
