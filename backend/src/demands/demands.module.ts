import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandsService } from './demands.service';
import { DemandsController } from './demands.controller';
import { Demand } from './entities/demand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Demand])],
  controllers: [DemandsController],
  providers: [DemandsService],
  exports: [DemandsService],
})
export class DemandsModule {}
