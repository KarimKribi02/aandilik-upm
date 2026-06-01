import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materiel } from './entities/materiel.entity';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import * as fs from 'fs';
import { join } from 'path';

function processImageField(
  images: string | undefined,
  host: string,
): string | undefined {
  if (!images) return images;

  // Check if it is a base64 data URL
  const base64Regex = /^data:image\/([a-zA-Z+]+);base64,(.+)$/;
  const match = images.match(base64Regex);

  if (match) {
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const data = match[2];
    const buffer = Buffer.from(data, 'base64');

    const filename = `equip-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const uploadsDir = join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    return `${host}/uploads/${filename}`;
  }

  // Check if relative path (e.g. starts with "/uploads/" or "uploads/")
  if (images.startsWith('/uploads/') || images.startsWith('uploads/')) {
    const cleanPath = images.startsWith('/') ? images : '/' + images;
    return `${host}${cleanPath}`;
  }

  return images;
}

@Injectable()
export class MaterielService {
  constructor(
    @InjectRepository(Materiel)
    private materielRepository: Repository<Materiel>,
  ) {}

  async create(
    materielData: CreateMaterielDto,
    owner: { userId?: number; id?: number },
    host: string,
  ): Promise<Materiel> {
    const processedImages = processImageField(materielData.images, host);
    const materiel = this.materielRepository.create({
      ...materielData,
      images: processedImages,
      proprietaire: { id: owner.userId ?? owner.id ?? 0 },
    });
    return this.materielRepository.save(materiel);
  }

  async findAll(): Promise<Materiel[]> {
    return this.materielRepository.find({ relations: ['proprietaire'] });
  }

  async findByOwner(ownerId: number): Promise<Materiel[]> {
    return this.materielRepository.find({
      where: { proprietaire: { id: ownerId } },
      relations: ['reservations'],
    });
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

  async update(
    id: number,
    materielData: Partial<Materiel>,

    _ownerId: number,
    host: string,
  ): Promise<Materiel> {
    const materiel = await this.findOne(id);

    if (materielData && Object.keys(materielData).length > 0) {
      const updatePayload = { ...materielData };
      if (updatePayload.images) {
        updatePayload.images = processImageField(updatePayload.images, host);
      }
      await this.materielRepository.update(id, updatePayload);
      return this.findOne(id);
    }

    return materiel;
  }

  async remove(id: number): Promise<void> {
    const materiel = await this.findOne(id);
    await this.materielRepository.remove(materiel);
  }
}
