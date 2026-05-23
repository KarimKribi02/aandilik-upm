import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MaterielModule } from './materiel/materiel.module';
import { ReservationsModule } from './reservations/reservations.module';
import { BlogModule } from './blog/blog.module';
import { PartnersModule } from './partners/partners.module';
import { ExpertsModule } from './experts/experts.module';
import { User } from './users/entities/user.entity';
import { Materiel } from './materiel/entities/materiel.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { Article } from './blog/entities/article.entity';
import { Partner } from './partners/entities/partner.entity';
import { Expert } from './experts/entities/expert.entity';
import { DemandsModule } from './demands/demands.module';
import { Demand } from './demands/entities/demand.entity';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT!) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aandilik',
      entities: [User, Materiel, Reservation, Article, Partner, Expert, Demand],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    MaterielModule,
    ReservationsModule,
    BlogModule,
    PartnersModule,
    ExpertsModule,
    DemandsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
