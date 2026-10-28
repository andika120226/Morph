import { Body, Controller, Get, Post } from '@nestjs/common';
import { VouchersService } from './vouchers.service.js';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  async findAll() {
    return this.vouchersService.findAll();
  }

  @Post()
  async create(
    @Body()
    body: {
      title: string;
      discount: string;
      pointsCost: number;
      merchant: string;
    },
  ) {
    return this.vouchersService.create(body);
  }
}
