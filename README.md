# 🌱 MORPH — Ekosistem Pengelolaan Sampah Cerdas Bandar Lampung

**MORPH** adalah platform manajemen pengelolaan sampah berbasis *on-demand* untuk Kota Bandar Lampung yang dikembangkan oleh **Tim Pengembang TeknoHijau**. Platform ini menghubungkan Rumah Tangga Urban, Pengurus RT/RW, Mitra Kebersihan Lapangan (Driver), dan Pusat Komando Operasional Admin melalui tiga aplikasi terintegrasi dalam satu repositori monorepo.

🌐 **Live Production Website (Vercel):** [https://frontend-three-smoky-67.vercel.app](https://frontend-three-smoky-67.vercel.app)

---

## 📁 Struktur Folder Monorepo

```text
Morph/
├── frontend/          # Next.js (App Router) - Website Korporat Publik (GoCorp Style) & Secret Admin Dashboard
├── backend/           # NestJS + Prisma ORM + PostgreSQL - REST API Server & Logika Pencocokan Armada
├── mobile/            # Flutter Android (GetX CLI Architecture) - Aplikasi Mobile Warga & Mitra Driver
├── .gitignore         # Konfigurasi eksklusi global untuk Node.js, Next.js, NestJS, dan Flutter
└── README.md          # Dokumentasi utama monorepo MORPH
```

---

## 🚀 Cara Menjalankan Masing-Masing Komponen

### 1. Frontend Web Publik & Portal Admin (`/frontend`)
Dibangun menggunakan **Next.js (App Router)**, **Tailwind CSS**, **Lucide Icons**, dan **Leaflet OpenStreetMap**.
- **Halaman Publik Korporat (`/`)**: Menampilkan profil perusahaan bergaya GoCorp, *Diagnostic Comparison Matrix*, *Trilogi Technopreneurship*, *Showcase Aplikasi Mobile Flutter*, dan formulir pendaftaran Mitra Driver / RT-RW.
- **Pemicu Rahasia Admin**: Klik **3 kali berturut-turut** pada teks `© 2026 MORPH Eco Waste - Tim Pengembang TeknoHijau` di bagian paling bawah Footer (atau klik ikon gembok kecil di pojok kanan bawah) untuk membuka `/admin-login` (`admin@morph.id` / `morph2026`).
- **Portal Admin Dashboard (`/admin`)**: Dilengkapi 4 KPI Cards utama, Grafik Analitik Bar & Donut Chart, Tabel *Live Order & Dispatch*, Peta Monitoring Armada Bandar Lampung, Pencairan Poin Reward, serta Inbox Kemitraan.

```bash
cd frontend
npm install
npm run dev
```
Akses di browser: `http://localhost:3000`

---

### 2. Backend REST API & Database (`/backend`)
Dibangun menggunakan **NestJS**, **TypeScript**, dan **Prisma ORM (PostgreSQL)**, serta dilengkapi **In-Memory Mock Fallback** otomatis agar tetap berjalan 100% lancar saat presentasi meskipun tanpa database lokal.

1. Buat file `.env` di dalam folder `backend/`:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://postgres:12345678@localhost:5432/morph_db?schema=public"
   ```
2. Jalankan server NestJS:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run start:dev
   ```
Server API berjalan di: `http://localhost:4000` (`GET/POST /api/orders`, `PATCH /api/orders/:id/accept`, `PATCH /api/orders/:id/complete`, `GET/POST /api/orders/:id/chat`).

---

### 3. Aplikasi Mobile Android Warga & Driver (`/mobile`)
Dibangun menggunakan **Flutter** dengan standar arsitektur **GetX CLI (`get_cli`)** dan penyimpanan reaktif `GetStorage`. Memiliki fitur **Role Switcher Instan** (1 APK untuk mendemokan **Mode Warga** dan **Mode Mitra Driver**).

- **6 Modul Utama (`mobile/lib/app/modules/`)**:
  1. `onboarding`: Sambutan & pemilihan peran instan (*Warga* / *Mitra Driver*).
  2. `warga_home`: Beranda bergaya Gojek, Dompet MORPH Points, 2 tombol raksasa (*Jemput Sampah Organik* & *Jemput Sampah Anorganik*), serta tab *Pesanan Saya (CRUD)*.
  3. `warga_order`: Pemesanan jemputan dengan slider berat khusus satuan **Kilogram (Kg)**, titik peta OpenStreetMap Kedaton, radar pencarian driver, dan pelacakan armada.
  4. `chat`: Obrolan *in-app* antara Warga dan Driver dengan *Quick Replies* sekali sentuh.
  5. `rewards`: Katalog penukaran poin menjadi Sembako, Saldo GoPay/DANA, dan Pulsa/Token PLN.
  6. `driver_dashboard`: Antarmuka Mitra Kebersihan bergaya GoPartner (Saklar Online/Offline, indikator kapasitas muatan gerobak, terima order, input timbangan aktual Kg, dan kirim poin otomatis).

```bash
cd mobile
flutter pub get
flutter run --dart-define=MORPH_API_URL=https://frontend-three-smoky-67.vercel.app
```

---

**© 2026 MORPH Eco Waste — Tim Pengembang TeknoHijau • Kota Bandar Lampung**
