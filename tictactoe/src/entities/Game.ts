import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CellValue = 'X' | 'O' | null;
export type GameStatus = 'in_progress' | 'won' | 'draw';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  board!: string; // JSON string of CellValue[9]

  @Column({ type: 'varchar', length: 1 })
  currentTurn!: 'X' | 'O';

  @Column({ type: 'varchar', length: 1, nullable: true })
  winner!: 'X' | 'O' | null;

  @Column({ type: 'varchar', length: 20 })
  status!: GameStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
