import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async findReadyDrivers() {
    return this.prisma.driver.findMany({
      where: {
        isReady: true,
      },
    });
  }

  async findAll() {
    return this.prisma.driver.findMany();
  }

  async create(data: {
    name: string;
    vehicleType: string;
    isReady?: boolean;
    currentLat: number;
    currentLng: number;
  }) {
    return this.prisma.driver.create({
      data: {
        name: data.name,
        vehicleType: data.vehicleType,
        isReady: data.isReady ?? true,
        currentLat: Number(data.currentLat),
        currentLng: Number(data.currentLng),
      },
    });
  }
}
