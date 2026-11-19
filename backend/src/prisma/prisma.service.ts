import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('✅ Connected to PostgreSQL database (morph_db) via Prisma ORM.');
    } catch (err) {
      this.isConnected = false;
      this.logger.warn(
        '⚠️ PostgreSQL database belum aktif. Menggunakan In-Memory Mock Fallback agar aplikasi tetap berjalan 100% lancar saat demo.',
      );
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }
}
