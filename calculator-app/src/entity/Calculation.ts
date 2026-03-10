import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Calculation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('float')
  operand1!: number;

  @Column('float')
  operand2!: number;

  @Column()
  operator!: string;

  @Column('float')
  result!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
