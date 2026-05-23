import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Request, SetMetadata, 
  UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { MaterielService } from './materiel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

// Config Multer Storage for file uploads
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'equip-' + uniqueSuffix + extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new BadRequestException('Only image files are allowed!'), false);
  }
  cb(null, true);
};

@Controller('materiel')
export class MaterielController {
  constructor(private readonly materielService: MaterielService) {}

  // 1. Dedicated file upload endpoint
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded or file is not an image');
    }
    const host = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${host}/uploads/${file.filename}`;
    return { url: fileUrl };
  }

  // 2. Standard CRUD endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  create(@Body() body: any, @Request() req) {
    const materielData = body.materiel || body;
    const host = `${req.protocol}://${req.get('host')}`;
    return this.materielService.create(materielData, req.user, host);
  }

  @Get()
  findAll() {
    return this.materielService.findAll();
  }

  @Get('owner')
  @UseGuards(JwtAuthGuard)
  findMyEquipment(@Request() req) {
    return this.materielService.findByOwner(req.user.userId);
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
    const host = `${req.protocol}://${req.get('host')}`;
    return this.materielService.update(+id, materielData, req.user.userId, host);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  remove(@Param('id') id: string, @Request() req) {
    return this.materielService.remove(+id, req.user.userId);
  }
}
