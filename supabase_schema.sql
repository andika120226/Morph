-- ============================================================================
-- MORPH BANDAR LAMPUNG — SUPABASE POSTGRESQL SCHEMA & SEED DATA
-- Tim Pengembang TeknoHijau (Academic Technopreneurship Prototype)
-- Copy-Paste seluruh script ini ke SQL Editor di Dashboard Supabase Anda
-- ============================================================================

-- 1. TABEL PESANAN SAMPAH MOBILE (morph_orders)
CREATE TABLE IF NOT EXISTS public.morph_orders (
  id TEXT PRIMARY KEY,
  time TEXT NOT NULL DEFAULT 'Baru saja',
  citizen_name TEXT NOT NULL,
  citizen_phone TEXT NOT NULL DEFAULT '0812-7741-9021',
  address TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'Kedaton',
  category TEXT NOT NULL DEFAULT 'Organik',
  organic_kg NUMERIC(10, 2) NOT NULL DEFAULT 5.0,
  anorganic_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
  total_kg NUMERIC(10, 2) NOT NULL DEFAULT 5.0,
  driver_id TEXT,
  driver_name TEXT,
  vehicle_plate TEXT,
  status TEXT NOT NULL DEFAULT 'SEARCHING_DRIVER',
  points_awarded INTEGER NOT NULL DEFAULT 50,
  latitude DOUBLE PRECISION NOT NULL DEFAULT -5.3824,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 105.2586,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABEL ARMADA MITRA DRIVER (morph_drivers)
CREATE TABLE IF NOT EXISTS public.morph_drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  plate_number TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'Motor Gerobak',
  district TEXT NOT NULL DEFAULT 'Kedaton',
  current_load_kg NUMERIC(10, 2) NOT NULL DEFAULT 35.0,
  max_capacity_kg NUMERIC(10, 2) NOT NULL DEFAULT 100.0,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 4.9,
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  completed_today INTEGER NOT NULL DEFAULT 5,
  latitude DOUBLE PRECISION NOT NULL DEFAULT -5.3824,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 105.2586,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL INBOX KEMITRAAN & RT/RW (morph_inbox)
CREATE TABLE IF NOT EXISTS public.morph_inbox (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Kerjasama RT-RW',
  district TEXT NOT NULL DEFAULT 'Kedaton',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'BARU',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABEL CHAT IN-APP WARGA <-> DRIVER (morph_chats)
CREATE TABLE IF NOT EXISTS public.morph_chats (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- KONFIGURASI ROW LEVEL SECURITY (RLS) TERBUKA UNTUK DEMO PROTOTIPE
-- ============================================================================
ALTER TABLE public.morph_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morph_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morph_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morph_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Prototype Access morph_orders" ON public.morph_orders;
CREATE POLICY "Public Prototype Access morph_orders"
  ON public.morph_orders FOR ALL
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Prototype Access morph_drivers" ON public.morph_drivers;
CREATE POLICY "Public Prototype Access morph_drivers"
  ON public.morph_drivers FOR ALL
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Prototype Access morph_inbox" ON public.morph_inbox;
CREATE POLICY "Public Prototype Access morph_inbox"
  ON public.morph_inbox FOR ALL
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Prototype Access morph_chats" ON public.morph_chats;
CREATE POLICY "Public Prototype Access morph_chats"
  ON public.morph_chats FOR ALL
  USING (true) WITH CHECK (true);

-- ============================================================================
-- SEED DATA AWAL WILAYAH KOTA BANDAR LAMPUNG
-- ============================================================================
INSERT INTO public.morph_drivers (id, name, phone, plate_number, vehicle_type, district, current_load_kg, max_capacity_kg, rating, is_online, completed_today, latitude, longitude)
VALUES
  ('DRV-01', 'Pak Hendra Wijaya', '0812-7210-4411', 'BE 4521 YX', 'Motor Gerobak', 'Kedaton', 35, 100, 4.9, true, 6, -5.3824, 105.2586),
  ('DRV-02', 'Rahmat Hidayat', '0813-6901-8821', 'BE 8812 AA', 'Pickup Box', 'Sukarame', 65, 200, 4.8, true, 5, -5.3895, 105.2921),
  ('DRV-03', 'Agus Saputra', '0852-6612-9011', 'BE 3190 YD', 'Motor Listrik', 'Rajabasa', 18, 60, 5.0, true, 4, -5.3672, 105.2448),
  ('DRV-04', 'Dedi Kurniawan', '0821-8011-3344', 'BE 7742 YK', 'Motor Gerobak', 'Way Halim', 42, 100, 4.9, true, 5, -5.3791, 105.2742),
  ('DRV-05', 'Hendra Pratama', '0812-7990-1122', 'BE 5109 YZ', 'Pickup Box', 'Enggal', 80, 200, 4.7, true, 4, -5.4215, 105.2582)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.morph_orders (id, time, citizen_name, citizen_phone, address, district, category, organic_kg, anorganic_kg, total_kg, driver_id, driver_name, vehicle_plate, status, points_awarded, latitude, longitude)
VALUES
  ('MRP-8821', '10:42 WIB', 'Ibu Rina Marlina', '0812-7741-9021', 'Jl. ZA. Pagar Alam Gg. PU No. 14, Kedaton', 'Kedaton', 'Campuran (Organik & Anorganik)', 10, 8, 18, NULL, NULL, NULL, 'SEARCHING_DRIVER', 180, -5.3805, 105.2562),
  ('MRP-8820', '10:35 WIB', 'Bpk. Taufik Hidayat', '0813-6612-8810', 'Jl. Pulau Sebesi No. 22, Sukarame', 'Sukarame', 'Anorganik', 0, 15, 15, NULL, NULL, NULL, 'SEARCHING_DRIVER', 225, -5.3871, 105.2954),
  ('MRP-8819', '10:18 WIB', 'Keluarga Dr. Hendri', '0811-7209-441', 'Jl. Griya Utama Blok C4, Way Halim Permai', 'Way Halim', 'Organik', 12, 0, 12, 'DRV-04', 'Dedi Kurniawan', 'BE 7742 YK', 'ON_THE_WAY', 120, -5.3774, 105.2768),
  ('MRP-8817', '09:20 WIB', 'RM Pindang Meranjat Enggal', '0821-7712-3390', 'Jl. Raden Intan No. 88, Enggal', 'Enggal', 'Organik', 22, 0, 22, 'DRV-05', 'Hendra Pratama', 'BE 5109 YZ', 'COMPLETED', 220, -5.4198, 105.2594)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.morph_inbox (id, full_name, contact, category, district, message, status)
VALUES
  ('INB-BDL-101', 'Hendra Wijaya (Ketua RT 04)', '0812-7788-9900', 'Kerjasama RT-RW', 'Way Halim', 'Pengajuan integrasi penjemputan sampah terjadwal untuk 85 KK di lingkungan RT 04 Kelurahan Way Halim Permai.', 'BARU'),
  ('INB-BDL-102', 'Ahmad Fauzi', '0853-6611-2233', 'Daftar Driver', 'Kedaton', 'Ingin bergabung sebagai Mitra Driver armada Motor Gerobak area Kedaton dan Rajabasa.', 'BARU')
ON CONFLICT (id) DO NOTHING;
