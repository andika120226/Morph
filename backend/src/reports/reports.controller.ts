import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { ReportStatus } from '@prisma/client';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(
    @Body()
    body: {
      userId?: string;
      category: string;
      weight: number;
      latitude: number;
      longitude: number;
      imageUrl?: string;
      vehicleRec?: string;
    },
  ) {
    return this.reportsService.create(body);
  }

  @Get()
  async findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReportStatus,
  ) {
    return this.reportsService.updateStatus(id, status);
  }
}
