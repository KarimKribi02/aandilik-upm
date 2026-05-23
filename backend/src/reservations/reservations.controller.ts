import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() body: any, @Request() req) {
    const reservationData = {
      client_nom: body.client_nom || (body.reservation && body.reservation.client_nom),
      client_telephone: body.client_telephone || (body.reservation && body.reservation.client_telephone),
      client_email: body.client_email || (body.reservation && body.reservation.client_email),
      date_debut: body.date_debut || body.startDate || (body.reservation && body.reservation.date_debut),
      date_fin: body.date_fin || body.endDate || (body.reservation && body.reservation.date_fin),
      statut: body.statut || (body.reservation && body.reservation.statut),
    };
    const materielId = body.materielId || body.equipmentId || (body.reservation && body.reservation.materielId);
    return this.reservationsService.create(reservationData as any, +materielId, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  updateStatus(
    @Param('id') id: string,
    @Body('statut') statut: ReservationStatus,
    @Request() req,
  ) {
    return this.reservationsService.updateStatus(+id, statut, req.user.userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  getStats() {
    return this.reservationsService.getGlobalStats();
  }

  @Get('owner')
  @UseGuards(JwtAuthGuard)
  findMyReservations(@Request() req) {
    return this.reservationsService.findByOwner(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  findAll() {
    return this.reservationsService.findAll();
  }
}
