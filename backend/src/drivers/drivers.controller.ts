import { Body, Controller, Get, Post } from '@nestjs/common';
import { DriversService } from './drivers.service.js';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  async getReadyDrivers() {
    return this.driversService.findReadyDrivers();
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      vehicleType: string;
      isReady?: boolean;
      currentLat: number;
      currentLng: number;
    },
  ) {
    return this.driversService.create(body);
  }
}
