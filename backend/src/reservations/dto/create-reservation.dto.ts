import { IsString, IsEmail, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class CreateReservationDto {
  @IsString()
  client_nom: string;

  @IsString()
  client_telephone: string;

  @IsEmail()
  client_email: string;

  @IsDateString()
  date_debut: string;

  @IsDateString()
  date_fin: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  statut?: ReservationStatus;
}
