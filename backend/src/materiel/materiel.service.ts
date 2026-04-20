import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materiel } from './entities/materiel.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MaterielService {
  constructor(
    @InjectRepository(Materiel)
    private materielRepository: Repository<Materiel>,
  ) {}

  async create(materielData: Partial<Materiel>, owner: User): Promise<Materiel> {
    const materiel = this.materielRepository.create({
      ...materielData,
      proprietaire: owner,
    });
    return this.materielRepository.save(materiel);
  }

  async findAll(): Promise<Materiel[]> {
    return this.materielRepository.find({ relations: ['proprietaire'] });
  }

  async findOne(id: number): Promise<Materiel> {
    const materiel = await this.materielRepository.findOne({
      where: { id },
      relations: ['proprietaire', 'reservations'],
    });
    if (!materiel) {
      throw new NotFoundException(`Materiel with ID ${id} not found`);
    }
    return materiel;
  }

  async update(id: number, materielData: Partial<Materiel>, ownerId: number): Promise<Materiel> {
    const materiel = await this.findOne(id);
    if (materiel.proprietaire.id !== ownerId) {
      throw new UnauthorizedException('You do not own this equipment');
    }
    Object.assign(materiel, materielData);
    return this.materielRepository.save(materiel);
  }

  async remove(id: number, ownerId: number): Promise<void> {
    const materiel = await this.findOne(id);
    if (materiel.proprietaire.id !== ownerId) {
      throw new UnauthorizedException('You do not own this equipment');
    }
    await this.materielRepository.remove(materiel);
  }
}

import { UnauthorizedException } from '@nestjs/common';
