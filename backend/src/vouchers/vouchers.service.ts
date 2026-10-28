import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VouchersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.voucher.findMany({
      orderBy: {
        pointsCost: 'asc',
      },
    });
  }

  async create(data: {
    title: string;
    discount: string;
    pointsCost: number;
    merchant: string;
  }) {
    return this.prisma.voucher.create({
      data: {
        title: data.title,
        discount: data.discount,
        pointsCost: Number(data.pointsCost),
        merchant: data.merchant,
      },
    });
  }
}
