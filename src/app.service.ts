import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth() {
    try {
      // Run a simple query to verify the database is active and reachable
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'UP',
        database: 'CONNECTED',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 'DOWN',
        database: 'DISCONNECTED',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
