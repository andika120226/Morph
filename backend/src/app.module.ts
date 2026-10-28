import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { DriversModule } from './drivers/drivers.module.js';
import { VouchersModule } from './vouchers/vouchers.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ReportsModule,
    DriversModule,
    VouchersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
