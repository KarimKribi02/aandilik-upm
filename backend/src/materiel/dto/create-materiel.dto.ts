import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMaterielDto {
  @IsString()
  nom_equipement: string;

  @IsString()
  description: string;

  @IsNumber()
  prix_location: number;

  @IsString()
  categorie: string;

  @IsString()
  localisation: string;

  @IsString()
  @IsOptional()
  images?: string;

  @IsNumber()
  @IsOptional()
  poids_operationnel?: number;

  @IsString()
  @IsOptional()
  capacite_godet?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
