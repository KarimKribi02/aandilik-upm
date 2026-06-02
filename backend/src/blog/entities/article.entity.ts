import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('longtext')
  content: string;

  @Column()
  category: string;

  @Column('longtext', { nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}
