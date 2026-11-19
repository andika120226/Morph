import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface MockUserRecord {
  id: string;
  name: string;
  role: 'WARGA' | 'DRIVER' | 'ADMIN';
  pointsBalance: number;
  phone: string;
  address: string;
}

export interface MockDriverFleetRecord {
  id: string;
  userId: string;
  driverName: string;
  plateNumber: string;
  maxCapacityKg: number;
  currentLoadKg: number;
  isOnline: boolean;
  lat: number;
  lng: number;
}

export interface MockChatMessageRecord {
  id: string;
  orderId: string;
  senderRole: 'WARGA' | 'DRIVER';
  message: string;
  createdAt: string;
}

export interface MockWasteOrderRecord {
  id: string;
  wargaId: string;
  citizenName: string;
  driverId: string | null;
  driverName: string | null;
  driverPlate: string | null;
  category: 'ORGANIK' | 'ANORGANIK';
  estimatedWeightKg: number;
  actualWeightKg: number | null;
  pickupLat: number;
  pickupLng: number;
  addressText: string;
  district: string;
  status: 'SEARCHING' | 'ACCEPTED' | 'ON_THE_WAY' | 'COMPLETED' | 'CANCELLED';
  pointsEarned: number;
  createdAt: string;
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // IN-MEMORY MOCK FALLBACK STORE (AKTIF OTOMATIS JIKA DB BELUM TERHUBUNG)
  // ===========================================================================
  private users: MockUserRecord[] = [
    {
      id: 'warga-budi-01',
      name: 'Keluarga Budi Santoso',
      role: 'WARGA',
      pointsBalance: 1250,
      phone: '0812-7741-9021',
      address: 'Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung',
    },
    {
      id: 'driver-hendra-01',
      name: 'Pak Hendra Wijaya',
      role: 'DRIVER',
      pointsBalance: 0,
      phone: '0813-6901-8821',
      address: 'Posko MORPH Kedaton, Bandar Lampung',
    },
  ];

  private fleets: MockDriverFleetRecord[] = [
    {
      id: 'fleet-01',
      userId: 'driver-hendra-01',
      driverName: 'Pak Hendra Wijaya',
      plateNumber: 'BE 4521 YX',
      maxCapacityKg: 100,
      currentLoadKg: 35,
      isOnline: true,
      lat: -5.3812,
      lng: 105.2571,
    },
    {
      id: 'fleet-02',
      userId: 'driver-rahmat-02',
      driverName: 'Rahmat Hidayat',
      plateNumber: 'BE 8812 AA',
      maxCapacityKg: 150,
      currentLoadKg: 60,
      isOnline: true,
      lat: -5.3895,
      lng: 105.2921,
    },
    {
      id: 'fleet-03',
      userId: 'driver-agus-03',
      driverName: 'Agus Saputra',
      plateNumber: 'BE 3190 YD',
      maxCapacityKg: 100,
      currentLoadKg: 20,
      isOnline: true,
      lat: -5.3672,
      lng: 105.2448,
    },
  ];

  private orders: MockWasteOrderRecord[] = [
    {
      id: 'MRP-8821',
      wargaId: 'warga-budi-01',
      citizenName: 'Ibu Rina Marlina',
      driverId: 'driver-hendra-01',
      driverName: 'Pak Hendra Wijaya',
      driverPlate: 'BE 4521 YX',
      category: 'ORGANIK',
      estimatedWeightKg: 12,
      actualWeightKg: null,
      pickupLat: -5.3824,
      pickupLng: 105.2586,
      addressText: 'Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung',
      district: 'Kedaton',
      status: 'ON_THE_WAY',
      pointsEarned: 120,
      createdAt: '2026-10-28T10:15:00.000Z',
    },
    {
      id: 'MRP-8820',
      wargaId: 'warga-budi-01',
      citizenName: 'Bpk. Taufik Hidayat',
      driverId: null,
      driverName: null,
      driverPlate: null,
      category: 'ANORGANIK',
      estimatedWeightKg: 15,
      actualWeightKg: null,
      pickupLat: -5.3895,
      pickupLng: 105.2921,
      addressText: 'Jl. Pulau Sebesi No. 22, Sukarame, Bandar Lampung',
      district: 'Sukarame',
      status: 'SEARCHING',
      pointsEarned: 225,
      createdAt: '2026-10-28T10:05:00.000Z',
    },
    {
      id: 'MRP-8819',
      wargaId: 'warga-budi-01',
      citizenName: 'Keluarga Budi Santoso',
      driverId: 'driver-hendra-01',
      driverName: 'Pak Hendra Wijaya',
      driverPlate: 'BE 4521 YX',
      category: 'ANORGANIK',
      estimatedWeightKg: 6,
      actualWeightKg: 6,
      pickupLat: -5.3824,
      pickupLng: 105.2586,
      addressText: 'Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung',
      district: 'Kedaton',
      status: 'COMPLETED',
      pointsEarned: 90,
      createdAt: '2026-10-28T09:10:00.000Z',
    },
  ];

  private chats: MockChatMessageRecord[] = [
    {
      id: 'chat-01',
      orderId: 'MRP-8821',
      senderRole: 'DRIVER',
      message:
        'Halo Pak/Bu, saya Pak Hendra (Motor Gerobak BE 4521 YX). Saya sedang menuju titik rumah Anda di Kedaton ya.',
      createdAt: '2026-10-28T10:16:00.000Z',
    },
  ];

  // Hitung jarak koordinat terdekat (Euclidean distance approximation)
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const dLat = lat1 - lat2;
    const dLng = lng1 - lng2;
    return Math.sqrt(dLat * dLat + dLng * dLng);
  }

  // Mencari armada driver terdekat yang online & kapasitas muatan mencukupi:
  // currentLoadKg + estimatedWeightKg <= maxCapacityKg
  private findNearestEligibleFleet(
    pickupLat: number,
    pickupLng: number,
    estimatedWeightKg: number,
  ): MockDriverFleetRecord | null {
    const eligible = this.fleets.filter(
      (f) => f.isOnline && f.currentLoadKg + estimatedWeightKg <= f.maxCapacityKg,
    );

    if (eligible.length === 0) return null;

    eligible.sort(
      (a, b) =>
        this.calculateDistance(pickupLat, pickupLng, a.lat, a.lng) -
        this.calculateDistance(pickupLat, pickupLng, b.lat, b.lng),
    );

    return eligible[0];
  }

  // 1. POST /api/orders
  async createOrder(dto: {
    id?: string;
    wargaId?: string;
    citizenName?: string;
    category: 'ORGANIK' | 'ANORGANIK';
    estimatedWeightKg: number;
    pickupLat?: number;
    pickupLng?: number;
    addressText: string;
    district?: string;
  }) {
    const weight = Number(dto.estimatedWeightKg || 5);
    const lat = Number(dto.pickupLat ?? -5.3824);
    const lng = Number(dto.pickupLng ?? 105.2586);
    const cat = dto.category === 'ANORGANIK' ? 'ANORGANIK' : 'ORGANIK';
    const rate = cat === 'ANORGANIK' ? 15 : 10;
    const estPoints = Math.round(weight * rate);

    // Cari driver terdekat yang kapasitas gerobaknya mencukupi
    const nearestFleet = this.findNearestEligibleFleet(lat, lng, weight);

    const newOrder: MockWasteOrderRecord = {
      id: dto.id || `MRP-${Math.floor(8825 + Math.random() * 900)}`,
      wargaId: dto.wargaId || 'warga-budi-01',
      citizenName: dto.citizenName || 'Keluarga Budi Santoso',
      driverId: nearestFleet ? nearestFleet.userId : null,
      driverName: nearestFleet ? nearestFleet.driverName : null,
      driverPlate: nearestFleet ? nearestFleet.plateNumber : null,
      category: cat,
      estimatedWeightKg: weight,
      actualWeightKg: null,
      pickupLat: lat,
      pickupLng: lng,
      addressText:
        dto.addressText || 'Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung',
      district: dto.district || 'Kedaton',
      status: 'SEARCHING',
      pointsEarned: estPoints,
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);

    return {
      status: 'success',
      message: nearestFleet
        ? `Order terdaftar & cocok dengan armada terdekat: ${nearestFleet.driverName} (${nearestFleet.plateNumber})`
        : 'Order terdaftar dan sedang mencari armada yang tersedia.',
      recommendedFleet: nearestFleet,
      data: newOrder,
    };
  }

  // 2. GET /api/orders
  async findAllOrders() {
    const wargaUser = this.users.find((u) => u.role === 'WARGA');
    return {
      status: 'success',
      wargaPointsBalance: wargaUser?.pointsBalance ?? 1250,
      fleets: this.fleets,
      count: this.orders.length,
      data: this.orders,
    };
  }

  // 3. PATCH /api/orders/:id/accept
  async acceptOrder(
    orderId: string,
    dto?: { driverId?: string; driverName?: string; plateNumber?: string },
  ) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} tidak ditemukan.`);
    }

    const fleet =
      this.fleets.find((f) => f.userId === dto?.driverId) || this.fleets[0];

    order.status = 'ON_THE_WAY';
    order.driverId = dto?.driverId || fleet.userId;
    order.driverName = dto?.driverName || fleet.driverName;
    order.driverPlate = dto?.plateNumber || fleet.plateNumber;

    return {
      status: 'success',
      message: `Driver ${order.driverName} menerima pesanan ${order.id} dan sedang menuju lokasi (ON_THE_WAY).`,
      data: order,
    };
  }

  // 4. PATCH /api/orders/:id/complete
  async completeOrder(orderId: string, dto: { actualWeightKg: number }) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} tidak ditemukan.`);
    }

    const actualKg = Number(dto.actualWeightKg || order.estimatedWeightKg);
    const rate = order.category === 'ANORGANIK' ? 15 : 10;
    const earnedPoints = Math.round(actualKg * rate);

    order.actualWeightKg = actualKg;
    order.pointsEarned = earnedPoints;
    order.status = 'COMPLETED';

    // 1. Tambahkan saldo pointsBalance ke akun Warga
    const warga =
      this.users.find((u) => u.id === order.wargaId) || this.users[0];
    if (warga) {
      warga.pointsBalance += earnedPoints;
    }

    // 2. Perbarui currentLoadKg pada armada Driver
    const fleet =
      this.fleets.find((f) => f.userId === order.driverId) || this.fleets[0];
    if (fleet) {
      fleet.currentLoadKg = Math.min(
        fleet.maxCapacityKg,
        Number((fleet.currentLoadKg + actualKg).toFixed(1)),
      );
    }

    return {
      status: 'success',
      message: `Penjemputan selesai! Berat aktual ${actualKg} Kg menghasilkan +${earnedPoints} Poin untuk Warga.`,
      updatedWargaPoints: warga?.pointsBalance ?? 1250,
      updatedFleetLoadKg: fleet?.currentLoadKg ?? 35,
      data: order,
    };
  }

  // 5. GET /api/orders/:id/chat
  async getOrderChats(orderId: string) {
    const list = this.chats.filter((c) => c.orderId === orderId);
    return {
      status: 'success',
      orderId,
      data: list,
    };
  }

  // 6. POST /api/orders/:id/chat
  async addOrderChat(
    orderId: string,
    dto: { senderRole: 'WARGA' | 'DRIVER'; message: string },
  ) {
    const newMsg: MockChatMessageRecord = {
      id: `chat-${Date.now()}`,
      orderId,
      senderRole: dto.senderRole === 'DRIVER' ? 'DRIVER' : 'WARGA',
      message: dto.message,
      createdAt: new Date().toISOString(),
    };

    this.chats.push(newMsg);

    return {
      status: 'success',
      data: newMsg,
    };
  }
}
