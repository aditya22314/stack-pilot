import { Test, TestingModule } from '@nestjs/testing';
import { RepositoriesService } from './repositories.service';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { BadRequestException } from '@nestjs/common';

describe('RepositoriesService', () => {
  let service: RepositoriesService;

  const mockPrismaService = {
    repository: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockStorageService = {
    extractZip: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<RepositoriesService>(RepositoriesService);
    jest.clearAllMocks();
  });

  it('should throw BadRequestException if no file is provided', async () => {
    await expect(service.processUpload(null as any)).rejects.toThrow(BadRequestException);
  });

  it('should process upload, extract zip, update DB, and clean up temp file', async () => {
    const mockFile = {
      originalname: 'test-repo.zip',
      size: 1024,
      path: '/tmp/uploads/test-repo.zip',
    } as Express.Multer.File;

    const mockCreatedRepo = {
      id: 'test-uuid-123',
      name: 'test-repo.zip',
      status: 'UPLOADED',
      sizeBytes: 1024,
    };

    const mockUpdatedRepo = {
      ...mockCreatedRepo,
      status: 'EXTRACTED',
      storagePath: '/storage/repositories/test-uuid-123',
    };

    mockPrismaService.repository.create.mockResolvedValue(mockCreatedRepo);
    mockStorageService.extractZip.mockResolvedValue('/storage/repositories/test-uuid-123');
    mockPrismaService.repository.update.mockResolvedValue(mockUpdatedRepo);

    const result = await service.processUpload(mockFile);

    expect(mockPrismaService.repository.create).toHaveBeenCalledWith({
      data: {
        name: 'test-repo.zip',
        status: 'UPLOADED',
        sizeBytes: 1024,
      },
    });

    expect(mockStorageService.extractZip).toHaveBeenCalled();
    expect(mockPrismaService.repository.update).toHaveBeenCalledWith({
      where: { id: 'test-uuid-123' },
      data: {
        status: 'EXTRACTED',
        storagePath: '/storage/repositories/test-uuid-123',
      },
    });
    expect(mockStorageService.deleteFile).toHaveBeenCalledWith('/tmp/uploads/test-repo.zip');
    expect(result).toEqual(mockUpdatedRepo);
  });
});
