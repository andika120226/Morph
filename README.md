# 🌱 MORPH Bandar Lampung — Smart Waste Management Ecosystem

> **Academic Technopreneurship Prototype — MORPH Smart Waste Ecosystem Bandar Lampung**  
> Dikembangkan oleh **Tim Pengembang TeknoHijau**

**MORPH Bandar Lampung** adalah platform pengelolaan sampah terpilah berbasis *on-demand* yang mengintegrasikan Rumah Tangga Urban, Pengurus RT/RW, Mitra Kebersihan Lapangan (Driver), dan Pusat Komando Operasional Admin dalam satu repositori monorepo.

---

## 🔗 URL Akses Produksi & Deployment

| Komponen | Platform | URL / Lokasi Akses |
| :--- | :--- | :--- |
| **Website Publik Korporat** | Vercel (Next.js) | [https://frontend-three-smoky-67.vercel.app](https://frontend-three-smoky-67.vercel.app) |
| **Portal Demo Admin (1-Klik)** | Vercel (Next.js) | [https://frontend-three-smoky-67.vercel.app/admin-login](https://frontend-three-smoky-67.vercel.app/admin-login) |
| **Admin Dashboard Console** | Vercel (Next.js) | [https://frontend-three-smoky-67.vercel.app/admin](https://frontend-three-smoky-67.vercel.app/admin) |
| **Mobile Sync REST API** | Vercel Serverless Bridge | [https://frontend-three-smoky-67.vercel.app/api/mobile/orders](https://frontend-three-smoky-67.vercel.app/api/mobile/orders) |
| **Mobile Web App (HP)** | Firebase Hosting | `https://morph-bandarlampung-app.web.app` |
| **File Installer Android (`.APK`)** | GitHub Actions Artifact | Tab **Actions** $\rightarrow$ Workflow **Build MORPH Bandar Lampung Android APK** $\rightarrow$ Artifact **`MORPH-BandarLampung-Android.apk`** |

---

## 📁 Arsitektur Monorepo

```text
Morph/
├── .github/workflows/
│   └── build-mobile-apk.yml  # CI/CD Otomatis Build Android APK (Java 17 + Flutter Stable)
├── frontend/                 # Next.js (App Router) - Web Publik, Admin Dashboard & API Bridge
│   ├── next.config.mjs       # Konfigurasi produksi & open CORS (/api/:path*)
│   └── vercel.json           # Konfigurasi deployment Vercel & CORS /api/mobile/*
├── backend/                  # NestJS + Prisma ORM + PostgreSQL (dengan In-Memory Fallback)
├── mobile/                   # Flutter Android & Web (GetX CLI Architecture)
│   ├── firebase.json         # Konfigurasi Firebase Hosting SPA (build/web)
│   ├── .firebaserc           # Project ID: morph-bandarlampung-app
│   └── lib/app/              # 6 Modul GetX CLI (Warga & Mitra Driver) + ApiConfig
├── .gitignore                # Filter global (node_modules, .next, dist, build, .dart_tool, .env)
└── README.md                 # Dokumentasi utama monorepo
```

---

## 🚀 Panduan Menjalankan & Deploy Masing-Masing Komponen

### 1. Web Publik & Admin Dashboard (`/frontend` — Next.js ke Vercel)
- **Akses Rahasia Admin dari Halaman Publik (`/`)**: Gulir ke bagian paling bawah Footer, lalu klik **3 kali berturut-turut** pada teks `© 2026 MORPH Eco Waste - Tim Pengembang TeknoHijau` (atau klik ikon gembok kecil di pojok kanan bawah) untuk menuju `/admin-login`, kemudian tekan tombol **"Masuk Dashboard Demo (1-Klik)"**.

```bash
cd frontend
npm install
npm run dev
```

**Deploy ke Vercel via Terminal:**
```bash
npx vercel --prod --yes --cwd frontend --scope andika-1180945f
```

---

### 2. Aplikasi Mobile Warga & Mitra Driver (`/mobile` — Flutter ke Firebase & APK)
Menggunakan arsitektur **GetX CLI** dengan **Role Switcher Instan** (1 aplikasi untuk mendemokan **Mode Warga** dan **Mode Mitra Driver**), terhubung ke [`api_config.dart`](file:///d:/web%20projet%20andika/Technopreneurship/mobile/lib/app/data/services/api_config.dart) dengan *auto-fallback* ke `GetStorage` lokal.

**Menjalankan di Lokal / Emulator:**
```bash
cd mobile
flutter pub get
flutter run --dart-define=API_URL=https://frontend-three-smoky-67.vercel.app/api/mobile
```

**Deploy Mobile Web ke Firebase Hosting:**
```bash
cd mobile
flutter build web --release --dart-define=API_URL=https://frontend-three-smoky-67.vercel.app/api/mobile
firebase deploy --only hosting
```

**Unduh File `.APK` Android dari GitHub Actions:**
Setiap kali ada `git push origin main` yang mengubah folder `mobile/**`, GitHub Actions (`.github/workflows/build-mobile-apk.yml`) otomatis menjalankan `flutter build apk --release` dan menyediakan file **`MORPH-BandarLampung-Android.apk`** di tab **Actions** repositori GitHub Anda.

---

### 3. Backend REST API (`/backend` — NestJS & Prisma)
Dilengkapi algoritma pencocokan kapasitas armada terdekat (`currentLoadKg + estimatedWeightKg <= maxCapacityKg`) serta *In-Memory Mock Fallback* otomatis jika PostgreSQL tidak aktif.

```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

---

**© 2026 MORPH Bandar Lampung — Tim Pengembang TeknoHijau**
