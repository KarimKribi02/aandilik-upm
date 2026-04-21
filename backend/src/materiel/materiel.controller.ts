import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { MaterielService } from './materiel.service';
import { Materiel } from './entities/materiel.entity';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('materiel')
export class MaterielController {
  constructor(private readonly materielService: MaterielService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  create(@Body() body: any, @Request() req) {
    const materielData = body.materiel || body;
    return this.materielService.create(materielData, req.user);
  }

  @Get()
  findAll() {
    return this.materielService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materielService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  update(@Param('id') id: string, @Body() body: any, @Request() req) {
    const materielData = body.materiel || body;
    return this.materielService.update(+id, materielData, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  remove(@Param('id') id: string, @Request() req) {
    return this.materielService.remove(+id, req.user.userId);
  }
}
