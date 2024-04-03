import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
  @ApiProperty()
  @PrimaryColumn({ unique: true })
  ISBN: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  Author: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  genre: string;

  @ApiProperty()
  @Column({ type: 'float' })
  price: number;

  @ApiProperty()
  @Column()
  quantity: number;
}
