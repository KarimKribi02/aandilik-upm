import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  findAll() {
    return this.partnerRepository.find({ order: { createdAt: 'ASC' } });
  }

  create(data: Partial<Partner>) {
    const partner = this.partnerRepository.create(data);
    return this.partnerRepository.save(partner);
  }

  delete(id: number) {
    return this.partnerRepository.delete(id);
  }
}
