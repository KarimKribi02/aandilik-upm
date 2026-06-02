import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DemandsService } from './demands.service';
import { Demand } from './entities/demand.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('demands')
export class DemandsController {
  constructor(private readonly demandsService: DemandsService) {}

  @Post()
  async create(
    @Body() demandData: Partial<Demand>,
    @Request() req: { user?: any },
  ) {
    // If user is logged in, attach to demand
    if (req.user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      demandData.user = req.user;
    }
    return this.demandsService.create(demandData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.demandsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.demandsService.findOne(+id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.demandsService.updateStatus(+id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.demandsService.delete(+id);
  }
}
