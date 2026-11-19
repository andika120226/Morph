import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service.js';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body()
    body: {
      id?: string;
      wargaId?: string;
      citizenName?: string;
      category: 'ORGANIK' | 'ANORGANIK';
      estimatedWeightKg: number;
      pickupLat?: number;
      pickupLng?: number;
      addressText: string;
      district?: string;
    },
  ) {
    return this.ordersService.createOrder(body);
  }

  @Get()
  async findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Patch(':id/accept')
  async acceptOrder(
    @Param('id') id: string,
    @Body()
    body?: {
      driverId?: string;
      driverName?: string;
      plateNumber?: string;
    },
  ) {
    return this.ordersService.acceptOrder(id, body);
  }

  @Patch(':id/complete')
  async completeOrder(
    @Param('id') id: string,
    @Body() body: { actualWeightKg: number },
  ) {
    return this.ordersService.completeOrder(id, body);
  }

  @Get(':id/chat')
  async getOrderChats(@Param('id') id: string) {
    return this.ordersService.getOrderChats(id);
  }

  @Post(':id/chat')
  async addOrderChat(
    @Param('id') id: string,
    @Body() body: { senderRole: 'WARGA' | 'DRIVER'; message: string },
  ) {
    return this.ordersService.addOrderChat(id, body);
  }
}
