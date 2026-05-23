import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Demand } from './entities/demand.entity';

@Injectable()
export class DemandsService {
  constructor(
    @InjectRepository(Demand)
    private demandsRepository: Repository<Demand>,
  ) {}

  async create(demandData: Partial<Demand>): Promise<Demand> {
    const demand = this.demandsRepository.create(demandData);
    return this.demandsRepository.save(demand);
  }

  async findAll(): Promise<Demand[]> {
    return this.demandsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Demand | null> {
    return this.demandsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async updateStatus(id: number, status: string): Promise<Demand | null> {
    await this.demandsRepository.update(id, { status });
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.demandsRepository.delete(id);
  }
}
