import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  // Heuristic rule:
  // weight < 30 kg -> MOTOR
  // 30 - 200 kg -> PICKUP
  // > 200 kg -> TRUCK
  determineVehicleRecommendation(weight: number): string {
    if (weight < 30) return 'MOTOR';
    if (weight <= 200) return 'PICKUP';
    return 'TRUCK';
  }

  async create(data: {
    userId?: string;
    category: string;
    weight: number;
    latitude: number;
    longitude: number;
    imageUrl?: string;
    vehicleRec?: string;
  }) {
    // Ensure default demo user exists for foreign key constraint
    const targetUserId = data.userId || 'demo-user-1';
    let user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      user = await this.prisma.user.upsert({
        where: { email: 'warga@morph.id' },
        update: {},
        create: {
          id: targetUserId,
          name: 'Warga Peduli Lingkungan',
          email: 'warga@morph.id',
          points: 1250,
        },
      });
    }

    const calculatedVehicle =
      data.vehicleRec || this.determineVehicleRecommendation(Number(data.weight));

    return this.prisma.report.create({
      data: {
        userId: user.id,
        category: data.category || 'ORGANIC',
        weight: Number(data.weight),
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        imageUrl:
          data.imageUrl ||
          'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
        vehicleRec: calculatedVehicle,
        status: ReportStatus.PENDING,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            points: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!report) {
      throw new NotFoundException(`Laporan dengan ID ${id} tidak ditemukan`);
    }
    return report;
  }

  async updateStatus(id: string, status: ReportStatus) {
    const report = await this.findOne(id);

    const updated = await this.prisma.report.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    // If status is completed, award points to user
    if (status === ReportStatus.COMPLETED && report.status !== ReportStatus.COMPLETED) {
      const earnedPoints = Math.round(Number(report.weight) * 10);
      await this.prisma.user.update({
        where: { id: report.userId },
        data: {
          points: {
            increment: earnedPoints,
          },
        },
      });
    }

    return updated;
  }
}
