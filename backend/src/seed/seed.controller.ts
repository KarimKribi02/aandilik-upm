import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('commands')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('seed')
  async runSeed() {
    return this.seedService.seed();
  }
}
