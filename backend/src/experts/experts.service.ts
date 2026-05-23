import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expert } from './entities/expert.entity';

@Injectable()
export class ExpertsService {
  constructor(
    @InjectRepository(Expert)
    private expertsRepository: Repository<Expert>,
  ) {}

  create(expertDto: any) {
    const expert = this.expertsRepository.create(expertDto);
    return this.expertsRepository.save(expert);
  }

  findAll() {
    return this.expertsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async remove(id: number) {
    const expert = await this.expertsRepository.findOneBy({ id });
    if (!expert) throw new NotFoundException('Expert not found');
    await this.expertsRepository.remove(expert);
    return { success: true };
  }
}
