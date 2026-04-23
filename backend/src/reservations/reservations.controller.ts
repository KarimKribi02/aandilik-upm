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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  create(@Body() body: any, @Request() req) {
    const reservationData = body.reservation || {
      date_debut: body.date_debut || body.startDate,
      date_fin: body.date_fin || body.endDate,
      statut: body.statut,
    };
    const materielId = body.materielId || body.equipmentId;
    return this.reservationsService.create(reservationData, materielId, req.user);
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
