import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ExpertsService } from './experts.service';

@Controller('experts')
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Post()
  create(@Body() createExpertDto: Record<string, any>) {
    return this.expertsService.create(createExpertDto);
  }

  @Get()
  findAll() {
    return this.expertsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expertsService.remove(+id);
  }
}
