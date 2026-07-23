import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import * as path from 'path';

@Injectable()
export class RepositoriesService {
  private readonly logger = new Logger(RepositoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async processUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('ZIP file is required');
    }

    this.logger.log(`Processing upload for file: ${file.originalname} (${file.size} bytes)`);

    // 1. Create initial DB record in UPLOADED state
    const repo = await this.prisma.repository.create({
      data: {
        name: file.originalname,
        status: 'UPLOADED',
        sizeBytes: file.size,
      },
    });

    const destinationDir = path.join(process.cwd(), 'storage', 'repositories', repo.id);

    try {
      // 2. Extract the archive
      const extractedPath = await this.storageService.extractZip(file.path, destinationDir);

      // 3. Update DB record to EXTRACTED state
      const updatedRepo = await this.prisma.repository.update({
        where: { id: repo.id },
        data: {
          status: 'EXTRACTED',
          storagePath: extractedPath,
        },
      });

      this.logger.log(`Repository ${repo.id} extracted successfully to ${extractedPath}`);
      return updatedRepo;
    } catch (error) {
      // If extraction failed, record failure status in DB
      await this.prisma.repository.update({
        where: { id: repo.id },
        data: { status: 'FAILED' },
      });
      throw error;
    } finally {
      // 4. Always clean up the temporary uploaded ZIP file
      await this.storageService.deleteFile(file.path);
    }
  }

  async getRepositoryById(id: string) {
    return this.prisma.repository.findUnique({
      where: { id },
    });
  }
}
