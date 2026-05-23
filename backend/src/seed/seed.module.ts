import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User } from '../users/entities/user.entity';
import { Materiel } from '../materiel/entities/materiel.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Demand } from '../demands/entities/demand.entity';
import { Article } from '../blog/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Materiel, Reservation, Demand, Article]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
