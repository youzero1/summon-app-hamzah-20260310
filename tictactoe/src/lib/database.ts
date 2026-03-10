import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Game } from '@/entities/Game';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/tictactoe.db';
const resolvedDbPath = path.resolve(process.cwd(), dbPath);
const dbDir = path.dirname(resolvedDbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let AppDataSource: DataSource;

declare global {
  // eslint-disable-next-line no-var
  var _dataSource: DataSource | undefined;
}

if (process.env.NODE_ENV === 'production') {
  AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedDbPath,
    synchronize: true,
    logging: false,
    entities: [Game],
  });
} else {
  if (!global._dataSource) {
    global._dataSource = new DataSource({
      type: 'better-sqlite3',
      database: resolvedDbPath,
      synchronize: true,
      logging: false,
      entities: [Game],
    });
  }
  AppDataSource = global._dataSource;
}

export async function getDataSource(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

export { AppDataSource };
