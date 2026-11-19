export type OrderStatus =
  | "SEARCHING_DRIVER"
  | "ON_THE_WAY"
  | "COMPLETED"
  | "CANCELLED";

export interface MobileOrder {
  id: string;
  time: string;
  citizenName: string;
  citizenPhone: string;
  address: string;
  district: "Kedaton" | "Sukarame" | "Rajabasa" | "Enggal" | "Way Halim";
  category: "Organik" | "Anorganik" | "Campuran (Organik & Anorganik)";
  organicKg: number;
  anorganicKg: number;
  totalKg: number;
  driverId: string | null;
  driverName: string | null;
  vehiclePlate: string | null;
  status: OrderStatus;
  pointsAwarded: number;
  latitude: number;
  longitude: number;
}

export interface FleetDriver {
  id: string;
  name: string;
  phone: string;
  plateNumber: string;
  vehicleType: "Motor Gerobak" | "Motor Listrik" | "Pickup Box" | "Truk Mini";
  district: string;
  currentLoadKg: number;
  maxCapacityKg: number;
  rating: number;
  isOnline: boolean;
  completedToday: number;
  latitude: number;
  longitude: number;
}

export interface RewardRedemptionItem {
  id: string;
  citizenName: string;
  citizenPhone: string;
  district: string;
  pointsCost: number;
  rewardTitle: string;
  rewardCategory: "E-Wallet" | "Sembako" | "Token PLN" | "Tunai";
  equivalentRupiah: number;
  requestedAt: string;
  status: "MENUNGGU_PERSETUJUAN" | "DISETUJUI" | "DITOLAK";
}

export interface PartnerInboxItem {
  id: string;
  fullName: string;
  contact: string;
  category: string;
  district: string;
  message: string;
  status: "BARU" | "DITERIMA_MITRA";
  createdAt: string;
}

export interface WeeklyWasteStat {
  day: string;
  Organik: number;
  Anorganik: number;
}

export const INITIAL_WEEKLY_STATS: WeeklyWasteStat[] = [
  { day: "Senin", Organik: 105, Anorganik: 75 },
  { day: "Selasa", Organik: 118, Anorganik: 82 },
  { day: "Rabu", Organik: 112, Anorganik: 90 },
  { day: "Kamis", Organik: 125, Anorganik: 85 },
  { day: "Jumat", Organik: 130, Anorganik: 92 },
  { day: "Sabtu", Organik: 120, Anorganik: 96 },
  { day: "Minggu", Organik: 110, Anorganik: 80 },
];
// Total seed = 820 Kg Organik + 600 Kg Anorganik = 1,420 Kg!

export const INITIAL_DISTRICT_STATS: Record<
  "Kedaton" | "Sukarame" | "Rajabasa" | "Enggal" | "Way Halim",
  number
> = {
  Kedaton: 380,
  Sukarame: 310,
  Rajabasa: 275,
  "Way Halim": 255,
  Enggal: 200,
};

export const INITIAL_DRIVERS: FleetDriver[] = [
  {
    id: "DRV-01",
    name: "Budi Santoso",
    phone: "0812-7210-4411",
    plateNumber: "BE 4521 YX",
    vehicleType: "Motor Gerobak",
    district: "Kedaton",
    currentLoadKg: 35,
    maxCapacityKg: 100,
    rating: 4.9,
    isOnline: true,
    completedToday: 6,
    latitude: -5.3824,
    longitude: 105.2586,
  },
  {
    id: "DRV-02",
    name: "Rahmat Hidayat",
    phone: "0813-6901-8821",
    plateNumber: "BE 8812 AA",
    vehicleType: "Pickup Box",
    district: "Sukarame",
    currentLoadKg: 65,
    maxCapacityKg: 200,
    rating: 4.8,
    isOnline: true,
    completedToday: 5,
    latitude: -5.3895,
    longitude: 105.2921,
  },
  {
    id: "DRV-03",
    name: "Agus Saputra",
    phone: "0852-6612-9011",
    plateNumber: "BE 3190 YD",
    vehicleType: "Motor Listrik",
    district: "Rajabasa",
    currentLoadKg: 18,
    maxCapacityKg: 60,
    rating: 5.0,
    isOnline: true,
    completedToday: 4,
    latitude: -5.3672,
    longitude: 105.2448,
  },
  {
    id: "DRV-04",
    name: "Dedi Kurniawan",
    phone: "0821-8011-3344",
    plateNumber: "BE 7742 YK",
    vehicleType: "Motor Gerobak",
    district: "Way Halim",
    currentLoadKg: 42,
    maxCapacityKg: 100,
    rating: 4.9,
    isOnline: true,
    completedToday: 5,
    latitude: -5.3791,
    longitude: 105.2742,
  },
  {
    id: "DRV-05",
    name: "Hendra Pratama",
    phone: "0812-7990-1122",
    plateNumber: "BE 5109 YZ",
    vehicleType: "Pickup Box",
    district: "Enggal",
    currentLoadKg: 80,
    maxCapacityKg: 200,
    rating: 4.7,
    isOnline: true,
    completedToday: 4,
    latitude: -5.4215,
    longitude: 105.2582,
  },
  {
    id: "DRV-06",
    name: "Syahrul Gunawan",
    phone: "0853-7711-6543",
    plateNumber: "BE 6214 YM",
    vehicleType: "Motor Listrik",
    district: "Kedaton",
    currentLoadKg: 20,
    maxCapacityKg: 60,
    rating: 4.8,
    isOnline: true,
    completedToday: 3,
    latitude: -5.3855,
    longitude: 105.2631,
  },
];

export const INITIAL_MOBILE_ORDERS: MobileOrder[] = [
  {
    id: "MRP-8821",
    time: "10:42 WIB",
    citizenName: "Ibu Rina Marlina",
    citizenPhone: "0812-7741-9021",
    address: "Jl. ZA. Pagar Alam Gg. PU No. 14, Kedaton",
    district: "Kedaton",
    category: "Campuran (Organik & Anorganik)",
    organicKg: 10,
    anorganicKg: 8,
    totalKg: 18,
    driverId: null,
    driverName: null,
    vehiclePlate: null,
    status: "SEARCHING_DRIVER",
    pointsAwarded: 180,
    latitude: -5.3805,
    longitude: 105.2562,
  },
  {
    id: "MRP-8820",
    time: "10:35 WIB",
    citizenName: "Bpk. Taufik Hidayat",
    citizenPhone: "0813-6612-8810",
    address: "Jl. Pulau Sebesi No. 22, Sukarame",
    district: "Sukarame",
    category: "Anorganik",
    organicKg: 0,
    anorganicKg: 15,
    totalKg: 15,
    driverId: null,
    driverName: null,
    vehiclePlate: null,
    status: "SEARCHING_DRIVER",
    pointsAwarded: 150,
    latitude: -5.3871,
    longitude: 105.2954,
  },
  {
    id: "MRP-8819",
    time: "10:18 WIB",
    citizenName: "Keluarga Dr. Hendri",
    citizenPhone: "0811-7209-441",
    address: "Jl. Griya Utama Blok C4, Way Halim Permai",
    district: "Way Halim",
    category: "Organik",
    organicKg: 12,
    anorganicKg: 0,
    totalKg: 12,
    driverId: "DRV-04",
    driverName: "Dedi Kurniawan",
    vehiclePlate: "BE 7742 YK",
    status: "ON_THE_WAY",
    pointsAwarded: 120,
    latitude: -5.3774,
    longitude: 105.2768,
  },
  {
    id: "MRP-8818",
    time: "09:55 WIB",
    citizenName: "Kost Putri Melati Unila",
    citizenPhone: "0852-7981-2231",
    address: "Jl. Prof. Sumantri Brojonegoro, Rajabasa",
    district: "Rajabasa",
    category: "Campuran (Organik & Anorganik)",
    organicKg: 14,
    anorganicKg: 11,
    totalKg: 25,
    driverId: "DRV-03",
    driverName: "Agus Saputra",
    vehiclePlate: "BE 3190 YD",
    status: "ON_THE_WAY",
    pointsAwarded: 250,
    latitude: -5.3651,
    longitude: 105.2425,
  },
  {
    id: "MRP-8817",
    time: "09:20 WIB",
    citizenName: "RM Pindang Meranjat Enggal",
    citizenPhone: "0821-7712-3390",
    address: "Jl. Raden Intan No. 88, Enggal",
    district: "Enggal",
    category: "Organik",
    organicKg: 22,
    anorganicKg: 0,
    totalKg: 22,
    driverId: "DRV-05",
    driverName: "Hendra Pratama",
    vehiclePlate: "BE 5109 YZ",
    status: "COMPLETED",
    pointsAwarded: 220,
    latitude: -5.4198,
    longitude: 105.2594,
  },
  {
    id: "MRP-8816",
    time: "08:45 WIB",
    citizenName: "Ibu Hj. Siti Aminah",
    citizenPhone: "0812-7900-5511",
    address: "Jl. Teuku Umar No. 31, Kedaton",
    district: "Kedaton",
    category: "Anorganik",
    organicKg: 0,
    anorganicKg: 16,
    totalKg: 16,
    driverId: "DRV-01",
    driverName: "Budi Santoso",
    vehiclePlate: "BE 4521 YX",
    status: "COMPLETED",
    pointsAwarded: 160,
    latitude: -5.3849,
    longitude: 105.2602,
  },
];

export const INITIAL_REWARD_REDEMPTIONS: RewardRedemptionItem[] = [
  {
    id: "RWD-901",
    citizenName: "Ibu Rina Marlina",
    citizenPhone: "0812-7741-9021",
    district: "Kedaton",
    pointsCost: 5000,
    rewardTitle: "Saldo GoPay / DANA Rp 50.000",
    rewardCategory: "E-Wallet",
    equivalentRupiah: 50000,
    requestedAt: "Hari ini, 10:15 WIB",
    status: "MENUNGGU_PERSETUJUAN",
  },
  {
    id: "RWD-902",
    citizenName: "Bpk. Suryadi (RT 02 Sukarame)",
    citizenPhone: "0813-7782-1190",
    district: "Sukarame",
    pointsCost: 6500,
    rewardTitle: "Beras Premium Lampung 5 Kg",
    rewardCategory: "Sembako",
    equivalentRupiah: 65000,
    requestedAt: "Hari ini, 09:40 WIB",
    status: "MENUNGGU_PERSETUJUAN",
  },
  {
    id: "RWD-903",
    citizenName: "Ibu Desi Ratnasari",
    citizenPhone: "0852-6671-4402",
    district: "Way Halim",
    pointsCost: 5000,
    rewardTitle: "Token Listrik PLN Rp 50.000",
    rewardCategory: "Token PLN",
    equivalentRupiah: 50000,
    requestedAt: "Hari ini, 09:05 WIB",
    status: "MENUNGGU_PERSETUJUAN",
  },
  {
    id: "RWD-904",
    citizenName: "Ibu Hj. Siti Aminah",
    citizenPhone: "0812-7900-5511",
    district: "Kedaton",
    pointsCost: 3500,
    rewardTitle: "Paket Sembako Minyak Goreng 2 Liter",
    rewardCategory: "Sembako",
    equivalentRupiah: 35000,
    requestedAt: "Kemarin, 16:20 WIB",
    status: "DISETUJUI",
  },
];

export const INITIAL_PARTNER_INBOX: PartnerInboxItem[] = [
  {
    id: "INB-BDL-101",
    fullName: "Hendra Wijaya (Ketua RT 04)",
    contact: "0812-7788-9900",
    category: "Kerjasama RT-RW",
    district: "Way Halim",
    message:
      "Pengajuan integrasi penjemputan sampah terjadwal untuk 85 KK di lingkungan RT 04 Kelurahan Way Halim Permai.",
    status: "BARU",
    createdAt: "2026-10-28T08:30:00.000Z",
  },
  {
    id: "INB-BDL-102",
    fullName: "Ahmad Fauzi",
    contact: "0853-6611-2233",
    category: "Daftar Driver",
    district: "Kedaton",
    message:
      "Ingin bergabung sebagai Mitra Driver armada Motor Gerobak / Pickup area Kedaton dan Rajabasa. Memiliki SIM C & A aktif.",
    status: "BARU",
    createdAt: "2026-10-28T09:15:00.000Z",
  },
  {
    id: "INB-BDL-103",
    fullName: "Paguyuban Warga Korpri Sukarame",
    contact: "korpri.sukarame@gmail.com",
    category: "Kerjasama RT-RW",
    district: "Sukarame",
    message:
      "Permohonan sosialisasi bank sampah digital MORPH dan jadwal penjemputan rutin setiap Rabu & Sabtu.",
    status: "DITERIMA_MITRA",
    createdAt: "2026-10-27T14:20:00.000Z",
  },
];

// Global In-Memory Singleton for API Route Handlers
class MorphMemoryStore {
  orders: MobileOrder[] = [...INITIAL_MOBILE_ORDERS];
  drivers: FleetDriver[] = [...INITIAL_DRIVERS];
  redemptions: RewardRedemptionItem[] = [...INITIAL_REWARD_REDEMPTIONS];
  inbox: PartnerInboxItem[] = [...INITIAL_PARTNER_INBOX];
}

const globalForMorph = globalThis as unknown as {
  morphStore?: MorphMemoryStore;
};

export const morphServerStore =
  globalForMorph.morphStore ?? new MorphMemoryStore();

if (process.env.NODE_ENV !== "production") {
  globalForMorph.morphStore = morphServerStore;
}
