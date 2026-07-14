import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Runs automatically when the module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // Runs automatically when the server shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
