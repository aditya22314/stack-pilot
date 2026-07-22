import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockPrismaService = {
    $queryRaw: jest.fn().mockResolvedValue([{ '1': 1 }]),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('health check', () => {
    it('should return health status stats', async () => {
      const result = {
        status: 'UP',
        database: 'CONNECTED',
        uptime: 123.45,
        timestamp: '2026-07-16T17:00:00.000Z',
        env: 'test',
      };
      jest.spyOn(appService, 'checkHealth').mockResolvedValue(result);

      expect(await appController.checkHealth()).toEqual(result);
    });
  });
});
