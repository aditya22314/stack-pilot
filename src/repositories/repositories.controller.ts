import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { RepositoriesService } from './repositories.service';
import { RepositoryResponseDto } from './dto/repository-response.dto';

// Ensure temporary upload directory exists
const tempUploadDir = path.join(process.cwd(), '.tmp', 'uploads');
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

@ApiTags('Repositories')
@Controller('repositories') // This line says every route starts with /repositories
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a repository ZIP file for extraction' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Repository ZIP archive (max 50MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Repository uploaded and extracted successfully', type: RepositoryResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file payload or format (Must be a .zip)' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: tempUploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB Limit
      },
      fileFilter: (req, file, cb) => {
        const isZip =
          file.mimetype === 'application/zip' ||
          file.mimetype === 'application/x-zip-compressed' ||
          file.originalname.toLowerCase().endsWith('.zip');

        if (!isZip) {
          return cb(new BadRequestException('Only .zip files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadRepository(@UploadedFile() file: Express.Multer.File) {
    return this.repositoriesService.processUpload(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get repository details by ID' })
  @ApiResponse({ status: 200, type: RepositoryResponseDto })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  async getRepository(@Param('id') id: string) {
    const repo = await this.repositoriesService.getRepositoryById(id);
    if (!repo) {
      throw new NotFoundException(`Repository with ID ${id} not found`);
    }
    return repo;
  }
}
