import { Controller, Get, Post, Delete, Body, Param, UseGuards, SetMetadata, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  async createUser(@Body() body: { nom: string; email: string; password: string; role?: string }) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.usersService.create({
      nom: body.nom,
      email: body.email,
      password: hashedPassword,
      role: (body.role as UserRole) || UserRole.PROPRIETAIRE,
    });
    const { password, ...result } = user;
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMINISTRATEUR])
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
