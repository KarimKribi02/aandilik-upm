import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('materiels')
export class Materiel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom_equipement: string;

  @Column('text')
  description: string;

  @Column('float')
  prix_location: number;

  @Column()
  categorie: string;

  @Column()
  localisation: string;

  @Column('text', { nullable: true })
  images: string; // Stored as a string (could be JSON or comma-separated)

  @ManyToOne(() => User, (user) => user.materiels)
  proprietaire: User;

  @OneToMany(() => Reservation, (reservation) => reservation.materiel)
  reservations: Reservation[];
}
