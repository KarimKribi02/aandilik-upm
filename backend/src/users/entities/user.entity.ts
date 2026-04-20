import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Materiel } from '../../materiel/entities/materiel.entity';

export enum UserRole {
  CLIENT = 'client',
  PROPRIETAIRE = 'propriétaire',
  ADMINISTRATEUR = 'administrateur',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @OneToMany(() => Materiel, (materiel) => materiel.proprietaire)
  materiels: Materiel[];
}
