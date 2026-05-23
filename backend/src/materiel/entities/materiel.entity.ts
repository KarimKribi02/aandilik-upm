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

  @Column('longtext', { nullable: true })
  images: string; // Stored as a URL (preferred) or base64 fallback

  @Column('float', { nullable: true })
  poids_operationnel: number;

  @Column({ nullable: true })
  capacite_godet: string;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'active', 'rejected'

  @ManyToOne(() => User, (user) => user.materiels)
  proprietaire: User;

  @OneToMany(() => Reservation, (reservation) => reservation.materiel)
  reservations: Reservation[];
}
