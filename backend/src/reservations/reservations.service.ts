import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { MailService } from '../mail/mail.service';
import { Materiel } from '../materiel/entities/materiel.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  private readonly COMMISSION_RATE = 0.1; // 10% platform commission

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Materiel)
    private materielRepository: Repository<Materiel>,
    private mailService: MailService,
  ) {}

  async create(
    reservationData: CreateReservationDto,
    materielId: number,
    client: Record<string, any> | null,
  ): Promise<Reservation> {
    if (!reservationData) {
      throw new BadRequestException('Reservation data is required');
    }

    const materiel = await this.materielRepository.findOne({
      where: { id: materielId },
    });
    if (!materiel) {
      throw new NotFoundException(`Materiel with ID ${materielId} not found`);
    }

    // Validation: Date debut must be before date fin
    const start = new Date(reservationData.date_debut);
    const end = new Date(reservationData.date_fin);
    if (start >= end) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Calculate price and commission
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
    );
    const prix_total = days * materiel.prix_location;
    const commission = prix_total * this.COMMISSION_RATE;

    const reservation = this.reservationRepository.create({
      ...reservationData,
      materiel,
      tracking_code: reservationData.tracking_code,
      client: client ? (client as any) : undefined,
      prix_total,
      commission,
      statut: ReservationStatus.EN_ATTENTE,
    });

    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ['materiel', 'client'],
    });
  }

  async findByOwner(ownerId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { materiel: { proprietaire: { id: ownerId } } },
      relations: ['materiel', 'client'],
    });
  }

  async findByClient(clientId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { client: { id: clientId } },
      relations: ['materiel', 'materiel.proprietaire'],
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['materiel', 'materiel.proprietaire', 'client'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async updateStatus(
    id: number,
    statut: ReservationStatus,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ownerId: number,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    reservation.statut = statut;
    const saved = await this.reservationRepository.save(reservation);

    // Send Notification Email
    try {
      const email = reservation.client_email || reservation.client?.email;
      if (email) {
        await this.mailService.sendStatusUpdate(
          email,
          reservation.client_nom || reservation.client?.nom || 'Client',
          statut,
          reservation.materiel.nom_equipement,
          reservation.tracking_code,
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to send status update email:', msg);
    }

    return saved;
  }

  async getGlobalStats() {
    const totalReservations = await this.reservationRepository.count();
    const totalCommission = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('SUM(reservation.commission)', 'sum')
      .getRawOne<{ sum: string | null }>();

    return {
      totalReservations,
      totalCommission: parseFloat(totalCommission?.sum ?? '0'),
    };
  }
}
