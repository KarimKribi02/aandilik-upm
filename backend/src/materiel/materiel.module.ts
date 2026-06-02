import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterielService } from './materiel.service';
import { MaterielController } from './materiel.controller';
import { Materiel } from './entities/materiel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Materiel])],
  controllers: [MaterielController],
  providers: [MaterielService],
  exports: [MaterielService],
})
export class MaterielModule {}
