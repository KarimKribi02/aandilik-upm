import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('longtext', { nullable: true })
  logo: string; // URL or base64

  @CreateDateColumn()
  createdAt: Date;
}
