import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Materiel } from '../../materiel/entities/materiel.entity';
import { User } from '../../users/entities/user.entity';

export enum ReservationStatus {
  EN_ATTENTE = 'en attente',
  CONFIRMEE = 'confirmée',
  EN_COURS = 'en cours',
  TERMINEE = 'terminée',
  ANNULEE = 'annulée',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  client_nom: string;

  @Column({ nullable: true })
  client_telephone: string;

  @Column({ nullable: true })
  client_email: string;

  @Column()
  date_debut: Date;

  @Column()
  date_fin: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.EN_ATTENTE,
  })
  statut: ReservationStatus;

  @Column('float', { default: 0 })
  commission: number;

  @Column('float', { default: 0 })
  prix_total: number;

  @ManyToOne(() => Materiel, (materiel) => materiel.reservations)
  materiel: Materiel;

  @ManyToOne(() => User, { nullable: true })
  client: User;
}
