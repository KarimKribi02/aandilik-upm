import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  SetMetadata,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { MaterielService } from './materiel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CreateMaterielDto } from './dto/create-materiel.dto';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: number;
    email: string;
    role: UserRole;
  };
}

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

const fileFilter = (
  req: ExpressRequest,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,
      fileFilter: fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded or file is not an image');
    }
    const host = `${req.protocol}://${req.get('host') ?? ''}`;
    const fileUrl = `${host}/uploads/${file.filename}`;
    return { url: fileUrl };
  }

  // 2. Standard CRUD endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  create(@Body() body: Record<string, any>, @Request() req: RequestWithUser) {
    const rawBody = body;
    const materielData = (rawBody.materiel || rawBody) as CreateMaterielDto;
    const host = `${req.protocol}://${req.get('host') ?? ''}`;
    return this.materielService.create(materielData, req.user, host);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.materielService.findAll(query);
  }

  @Get('owner')
  @UseGuards(JwtAuthGuard)
  findMyEquipment(@Request() req: RequestWithUser) {
    return this.materielService.findByOwner(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materielService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  update(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Request() req: RequestWithUser,
  ) {
    const rawBody = body;
    const materielData = (rawBody.materiel ||
      rawBody) as Partial<CreateMaterielDto>;
    const host = `${req.protocol}://${req.get('host') ?? ''}`;
    return this.materielService.update(
      +id,
      materielData,
      req.user.userId,
      host,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.PROPRIETAIRE, UserRole.ADMINISTRATEUR])
  remove(@Param('id') id: string) {
    return this.materielService.remove(+id);
  }
}
