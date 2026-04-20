import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() body: { reservation: Partial<Reservation>; materielId: number }) {
    return this.reservationsService.create(body.reservation, body.materielId);
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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  findAll() {
    return this.reservationsService.findAll();
  }
}
