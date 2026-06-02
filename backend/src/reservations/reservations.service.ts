import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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

  // Helper to normalize status strings between English request values and French DB enums
  private normalizeStatus(status: string): ReservationStatus {
    if (!status) return ReservationStatus.EN_ATTENTE;
    const s = status.toUpperCase().trim();
    if (s === 'PENDING' || s === 'EN ATTENTE' || s === 'EN_ATTENTE') return ReservationStatus.EN_ATTENTE;
    if (s === 'APPROVED' || s === 'CONFIRMED' || s === 'CONFIRMÉE' || s === 'CONFIRMEE') return ReservationStatus.CONFIRMEE;
    if (s === 'REJECTED' || s === 'CANCELLED' || s === 'ANNULÉE' || s === 'ANNULEE') return ReservationStatus.ANNULEE;
    if (s === 'COMPLETED' || s === 'TERMINÉE' || s === 'TERMINEE') return ReservationStatus.TERMINEE;
    if (s === 'IN_PROGRESS' || s === 'IN PROGRESS' || s === 'EN_COURS' || s === 'EN COURS') return ReservationStatus.EN_COURS;
    return ReservationStatus.EN_ATTENTE;
  }

  // Generates a readable, unique tracking code matching requested format
  private generateUniqueCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ADK-2026-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async create(
    reservationData: CreateReservationDto,
    materielId: number,
    client: any | null,
  ): Promise<Reservation> {
    if (!reservationData) {
      throw new BadRequestException('Reservation data is required');
    }

    // Fetch materiel with its owner (proprietaire) to send alerts
    const materiel = await this.materielRepository.findOne({
      where: { id: materielId },
      relations: ['proprietaire'],
    });
    if (!materiel) {
      throw new NotFoundException(`Materiel with ID ${materielId} not found`);
    }

    // Validation: Date debut must be before date fin
    const start = new Date(reservationData.date_debut);
    const end = new Date(reservationData.date_fin);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid start or end date');
    }
    if (start >= end) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Calculate duration in days, total price and commission
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
    );
    const prix_total = days * materiel.prix_location;
    const commission = prix_total * this.COMMISSION_RATE;

    // Automatically generate tracking code if not provided
    const trackingCode = reservationData.tracking_code || this.generateUniqueCode();

    const reservation = this.reservationRepository.create({
      client_nom: reservationData.client_nom,
      client_telephone: reservationData.client_telephone,
      client_email: reservationData.client_email,
      date_debut: start,
      date_fin: end,
      tracking_code: trackingCode,
      client: client ? (client as any) : undefined,
      materiel,
      prix_total,
      commission,
      statut: ReservationStatus.EN_ATTENTE,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // Trigger emails asynchronously (in parallel, without blocking HTTP thread)
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    // Email 1: To Client confirming request and tracking code
    void this.mailService.sendReservationConfirmationToClient(
      savedReservation.client_email,
      savedReservation.client_nom,
      savedReservation.tracking_code,
      materiel.nom_equipement,
      startDateStr,
      endDateStr,
      savedReservation.prix_total,
    );

    // Email 2: To Owner alerting about the new request
    if (materiel.proprietaire && materiel.proprietaire.email) {
      void this.mailService.sendNewRequestToOwner(
        materiel.proprietaire.email,
        materiel.proprietaire.nom || 'Partenaire',
        savedReservation.client_nom,
        materiel.nom_equipement,
        startDateStr,
        endDateStr,
        savedReservation.prix_total,
      );
    }

    return savedReservation;
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ['materiel', 'client', 'materiel.proprietaire'],
    });
  }

  async findByOwner(ownerId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { materiel: { proprietaire: { id: ownerId } } },
      relations: ['materiel', 'client', 'materiel.proprietaire'],
    });
  }

  async findByClient(clientId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { client: { id: clientId } },
      relations: ['materiel', 'materiel.proprietaire'],
    });
  }

  async findByTrackingCode(code: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { tracking_code: code.trim().toUpperCase() },
      relations: ['materiel', 'materiel.proprietaire', 'client'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with tracking code ${code} not found`);
    }
    return reservation;
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

  // Update status (normalizes string to database enum and triggers email notification to client)
  async updateStatus(
    id: number,
    statut: string,
    userId: number,
    isAdmin: boolean,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // Enforce ownership check for owners (non-admins)
    if (!isAdmin && reservation.materiel.proprietaire?.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update reservations for this equipment',
      );
    }

    const normalized = this.normalizeStatus(statut);
    reservation.statut = normalized;
    const saved = await this.reservationRepository.save(reservation);

    // Email 3: To Client alerting about the status update
    const targetEmail = reservation.client_email || (reservation.client && reservation.client.email);
    if (targetEmail) {
      if (normalized === ReservationStatus.TERMINEE) {
        void this.mailService.sendReservationCompletionToClient(
          targetEmail,
          reservation.client_nom || (reservation.client && reservation.client.nom) || 'Client',
          reservation.materiel.nom_equipement,
          reservation.tracking_code,
        );
      } else {
        void this.mailService.sendStatusUpdateToClient(
          targetEmail,
          reservation.client_nom || (reservation.client && reservation.client.nom) || 'Client',
          normalized,
          reservation.materiel.nom_equipement,
          reservation.tracking_code,
        );
      }
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
