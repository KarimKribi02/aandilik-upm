import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  SetMetadata,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationStatus } from './entities/reservation.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: number;
    email: string;
    role: UserRole;
  };
}

interface ReservationRequestBody {
  client_nom?: string;
  client_telephone?: string;
  client_email?: string;
  date_debut?: string;
  startDate?: string;
  date_fin?: string;
  endDate?: string;
  statut?: string;
  status?: string;
  materielId?: string | number;
  equipmentId?: string | number;
  tracking_code?: string;
  reservation?: {
    client_nom?: string;
    client_telephone?: string;
    client_email?: string;
    date_debut?: string;
    date_fin?: string;
    statut?: string;
    status?: string;
    materielId?: string | number;
    tracking_code?: string;
  };
}

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() body: ReservationRequestBody, @Request() req: { user?: any }) {
    const reservationData = {
      client_nom:
        body.client_nom ||
        (body.reservation && body.reservation.client_nom) ||
        '',
      client_telephone:
        body.client_telephone ||
        (body.reservation && body.reservation.client_telephone) ||
        '',
      client_email:
        body.client_email ||
        (body.reservation && body.reservation.client_email) ||
        '',
      date_debut:
        body.date_debut ||
        body.startDate ||
        (body.reservation && body.reservation.date_debut) ||
        new Date().toISOString(),
      date_fin:
        body.date_fin ||
        body.endDate ||
        (body.reservation && body.reservation.date_fin) ||
        new Date().toISOString(),
      statut: (body.statut ||
        body.status ||
        (body.reservation && body.reservation.statut) ||
        (body.reservation && body.reservation.status) ||
        ReservationStatus.EN_ATTENTE) as ReservationStatus,
      tracking_code:
        body.tracking_code ||
        (body.reservation && body.reservation.tracking_code),
    };
    const materielId =
      body.materielId ||
      body.equipmentId ||
      (body.reservation && body.reservation.materielId);

    if (!materielId) {
      throw new Error('Materiel ID is required');
    }

    return this.reservationsService.create(
      reservationData,
      +materielId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      req.user,
    );
  }

  // 1. PATCH /reservations/:id/status (Standard requested endpoint)
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  updateStatusEndpoint(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('statut') statut: string,
    @Request() req: RequestWithUser,
  ) {
    const finalStatus = status || statut;
    const userRole = String(req.user.role).toLowerCase();
    const isAdmin = userRole.includes('admin') || userRole.includes('administrateur');
    return this.reservationsService.updateStatus(+id, finalStatus, req.user.userId, isAdmin);
  }

  // 2. PATCH /reservations/:id (Kept for frontend backwards-compatibility, restricted to ADMIN only)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  updateStatus(
    @Param('id') id: string,
    @Body('statut') statut: string,
    @Body('status') status: string,
    @Request() req: RequestWithUser,
  ) {
    const finalStatus = status || statut;
    return this.reservationsService.updateStatus(+id, finalStatus, req.user.userId, true);
  }

  @Get('track/:code')
  async trackReservation(@Param('code') code: string) {
    const reservation = await this.reservationsService.findByTrackingCode(code);
    
    let statusMapped = 'PENDING';
    const dbStatus = reservation.statut;
    if (dbStatus === ReservationStatus.EN_ATTENTE) {
      statusMapped = 'PENDING';
    } else if (dbStatus === ReservationStatus.CONFIRMEE) {
      statusMapped = 'APPROVED';
    } else if (dbStatus === ReservationStatus.EN_COURS) {
      statusMapped = 'IN PROGRESS';
    } else if (dbStatus === ReservationStatus.TERMINEE) {
      statusMapped = 'COMPLETED';
    } else if (dbStatus === ReservationStatus.ANNULEE) {
      statusMapped = 'REJECTED';
    }

    return {
      ...reservation,
      status: statusMapped,
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  getStats() {
    return this.reservationsService.getGlobalStats();
  }

  @Get('owner')
  @UseGuards(JwtAuthGuard)
  findMyReservations(@Request() req: RequestWithUser) {
    return this.reservationsService.findByOwner(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  findAll() {
    return this.reservationsService.findAll();
  }
}
