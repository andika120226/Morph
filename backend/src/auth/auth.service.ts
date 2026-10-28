import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: { name: string; email: string; password?: string }) {
    if (!data.name || !data.email) {
      throw new BadRequestException('Nama dan email wajib diisi.');
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar. Silakan gunakan halaman Login.');
    }

    const newUser = await this.prisma.user.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        points: 100, // Bonus poin pendaftaran pengguna baru
      },
    });

    return {
      message: 'Registrasi berhasil!',
      user: newUser,
    };
  }

  async login(data: { email: string; password?: string }) {
    if (!data.email) {
      throw new BadRequestException('Email wajib diisi.');
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Akun dengan email tersebut belum terdaftar.');
    }

    return {
      message: 'Login berhasil!',
      user,
    };
  }
}

