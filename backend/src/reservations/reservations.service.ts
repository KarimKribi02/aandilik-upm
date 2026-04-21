import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
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
  ) {}

  async create(reservationData: CreateReservationDto, materielId: number): Promise<Reservation> {
    if (!reservationData) {
      throw new BadRequestException('Reservation data is required');
    }

    const materiel = await this.materielRepository.findOne({ where: { id: materielId } });
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
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    const prix_total = days * materiel.prix_location;
    const commission = prix_total * this.COMMISSION_RATE;

    const reservation = this.reservationRepository.create({
      ...reservationData,
      materiel,
      prix_total,
      commission,
      statut: ReservationStatus.EN_ATTENTE,
    });

    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({ relations: ['materiel'] });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['materiel', 'materiel.proprietaire'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async updateStatus(id: number, statut: ReservationStatus, ownerId: number): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    // Check if the current user is the owner of the equipment
    if (reservation.materiel.proprietaire.id !== ownerId) {
      throw new UnauthorizedException('You do not own the equipment for this reservation');
    }

    reservation.statut = statut;
    return this.reservationRepository.save(reservation);
  }

  async getGlobalStats() {
    const totalReservations = await this.reservationRepository.count();
    const totalCommission = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('SUM(reservation.commission)', 'sum')
      .getRawOne();
    
    return {
      totalReservations,
      totalCommission: parseFloat(totalCommission.sum || 0),
    };
  }
}
