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
    const ownerId = owner.userId ?? owner.id ?? 0;
    console.log(`Creating materiel for owner ID: ${ownerId}`);
    
    const materiel = this.materielRepository.create({
      ...materielData,
      images: processedImages,
      proprietaire: { id: ownerId },
    });
    return this.materielRepository.save(materiel);
  }

  async findAll(query?: {
    search?: string;
    localisation?: string;
    categorie?: string;
    category?: string;
    prixMax?: number | string;
    puissanceMax?: number | string;
    capaciteMax?: number | string;
  }): Promise<Materiel[]> {
    const qb = this.materielRepository.createQueryBuilder('materiel')
      .leftJoinAndSelect('materiel.proprietaire', 'proprietaire');

    if (query) {
      const search = query.search?.trim();
      if (search) {
        qb.andWhere('(LOWER(materiel.nom_equipement) LIKE :search OR LOWER(materiel.description) LIKE :search)', {
          search: `%${search.toLowerCase()}%`,
        });
      }

      const localisation = query.localisation?.trim();
      if (localisation) {
        qb.andWhere('LOWER(materiel.localisation) LIKE :localisation', {
          localisation: `%${localisation.toLowerCase()}%`,
        });
      }

      const category = query.categorie || query.category;
      if (category && category !== 'Tous') {
        qb.andWhere('LOWER(materiel.categorie) = :category', { category: category.toLowerCase() });
      }

      if (query.prixMax) {
        const pMax = Number(query.prixMax);
        if (!isNaN(pMax)) {
          qb.andWhere('materiel.prix_location <= :prixMax', { prixMax: pMax });
        }
      }

      if (query.puissanceMax) {
        const powMax = Number(query.puissanceMax);
        if (!isNaN(powMax)) {
          qb.andWhere('COALESCE(materiel.poids_operationnel, 15) <= :weightMax', { weightMax: powMax / 10 });
        }
      }

      if (query.capaciteMax) {
        const capMax = Number(query.capaciteMax);
        if (!isNaN(capMax)) {
          // A flexible cast/parse check
          qb.andWhere('CAST(COALESCE(nullif(materiel.capacite_godet, \'\'), \'1.2\') AS REAL) <= :capaciteMax', { capaciteMax: capMax });
        }
      }
    }

    return qb.getMany();
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
