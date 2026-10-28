import { PrismaClient, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial MORPH database records...');

  // 1. Seed Demo User
  const user = await prisma.user.upsert({
    where: { email: 'warga@morph.id' },
    update: {},
    create: {
      id: 'demo-user-1',
      name: 'Warga Peduli Lingkungan',
      email: 'warga@morph.id',
      points: 1250,
    },
  });
  console.log(`👤 User ready: ${user.name} (${user.email})`);

  // 2. Seed Drivers
  const drivers = [
    {
      name: 'Budi Santoso',
      vehicleType: 'MOTOR',
      isReady: true,
      currentLat: -6.2050,
      currentLng: 106.8400,
    },
    {
      name: 'Armada Pickup 03',
      vehicleType: 'PICKUP',
      isReady: true,
      currentLat: -6.2150,
      currentLng: 106.8350,
    },
    {
      name: 'Truk Heavy Duty 01',
      vehicleType: 'TRUCK',
      isReady: true,
      currentLat: -6.1980,
      currentLng: 106.8490,
    },
  ];

  for (const driver of drivers) {
    const existing = await prisma.driver.findFirst({
      where: { name: driver.name },
    });
    if (!existing) {
      await prisma.driver.create({ data: driver });
    }
  }
  console.log(`🚗 Seeded ${drivers.length} drivers.`);

  // 3. Seed Vouchers
  const vouchers = [
    {
      title: 'Voucher Belanja Indomaret',
      discount: 'Rp 25.000',
      pointsCost: 250,
      merchant: 'Indomaret',
    },
    {
      title: 'Voucher Belanja Alfamart',
      discount: 'Rp 50.000',
      pointsCost: 500,
      merchant: 'Alfamart',
    },
    {
      title: 'Saldo GoPay Digital',
      discount: 'Rp 25.000',
      pointsCost: 300,
      merchant: 'GoPay',
    },
    {
      title: 'Token Listrik Prabayar PLN',
      discount: 'Rp 50.000',
      pointsCost: 500,
      merchant: 'PLN Mobile',
    },
    {
      title: 'Adopsi 1 Pohon Mangrove',
      discount: 'Sertifikat Digital',
      pointsCost: 400,
      merchant: 'LindungiHutan',
    },
    {
      title: 'Voucher Diskon Tokopedia',
      discount: 'Diskon 15% (s/d Rp 75.000)',
      pointsCost: 650,
      merchant: 'Tokopedia',
    },
  ];

  for (const voucher of vouchers) {
    const existing = await prisma.voucher.findFirst({
      where: { title: voucher.title },
    });
    if (!existing) {
      await prisma.voucher.create({ data: voucher });
    }
  }
  console.log(`🎁 Seeded ${vouchers.length} vouchers.`);

  // 4. Seed Initial Reports
  const initialReports = [
    {
      userId: user.id,
      category: 'ORGANIC',
      weight: 18.5,
      latitude: -6.2088,
      longitude: 106.8456,
      status: ReportStatus.PENDING,
      vehicleRec: 'MOTOR',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    },
    {
      userId: user.id,
      category: 'ANORGANIC',
      weight: 85.0,
      latitude: -6.2188,
      longitude: 106.8326,
      status: ReportStatus.ACCEPTED,
      vehicleRec: 'PICKUP',
      imageUrl: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=600&q=80',
    },
    {
      userId: user.id,
      category: 'MIXED',
      weight: 240.0,
      latitude: -6.1954,
      longitude: 106.8521,
      status: ReportStatus.PENDING,
      vehicleRec: 'TRUCK',
      imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const reportCount = await prisma.report.count();
  if (reportCount === 0) {
    for (const report of initialReports) {
      await prisma.report.create({ data: report });
    }
    console.log(`📋 Seeded ${initialReports.length} reports.`);
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
