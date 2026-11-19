"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Recycle,
  Smartphone,
  Truck,
  MapPin,
  Coins,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Cpu,
  BarChart3,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Clock,
  Flame,
  Trash2,
  Sparkles,
  Send,
  Lock,
  Menu,
  X,
  Users,
  Building2,
  Phone,
  Mail,
  Globe,
  Download,
  Scale,
  Navigation,
  ChevronRight,
} from "lucide-react";

const BANDAR_LAMPUNG_DISTRICTS = [
  "Kedaton",
  "Sukarame",
  "Tanjung Karang Pusat",
  "Tanjung Karang Timur",
  "Tanjung Karang Barat",
  "Rajabasa",
  "Way Halim",
  "Teluk Betung Utara",
  "Teluk Betung Selatan",
  "Teluk Betung Timur",
  "Teluk Betung Barat",
  "Kemiling",
  "Labuhan Ratu",
  "Langkapura",
  "Enggal",
  "Panjang",
  "Bumi Waras",
  "Kedamaian",
  "Tanjung Senang",
  "Sukabumi",
];

export default function PublicCorporateLandingPage() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeAppTab, setActiveAppTab] = useState<"warga" | "driver">("warga");

  // Form Pendaftaran Mitra & Kontak Instansi (Section F)
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("Daftar Driver");
  const [district, setDistrict] = useState("Kedaton");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    id: string;
    fullName: string;
    category: string;
    district: string;
  } | null>(null);

  // Hidden Admin Trigger State (3 consecutive clicks on copyright text)
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretCopyrightClick = () => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      router.push("/admin-login");
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);
  };

  const handlePartnerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim() || !contact.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const newSubmission = {
      id: `INB-BDL-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      contact: contact.trim(),
      category,
      district,
      message: message.trim(),
      status: "BARU",
      createdAt: new Date().toISOString(),
    };

    // 1. Simpan ke dalam localStorage (key: 'morph_inbox')
    if (typeof window !== "undefined") {
      try {
        const existingRaw = localStorage.getItem("morph_inbox");
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = Array.isArray(existingList)
          ? [newSubmission, ...existingList]
          : [newSubmission];
        localStorage.setItem("morph_inbox", JSON.stringify(updatedList));
      } catch {
        // Ignore storage error
      }
    }

    // 2. Kirim ke API '/api/mock/inbox'
    try {
      await fetch("/api/mock/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubmission),
      });
    } catch {
      // Tetap sukses karena data telah tersimpan di localStorage 'morph_inbox'
    }

    setIsSubmitting(false);
    setSubmitSuccess({
      id: newSubmission.id,
      fullName: newSubmission.fullName,
      category: newSubmission.category,
      district: newSubmission.district,
    });

    setFullName("");
    setContact("");
    setMessage("");
  };

  const navItems = [
    { label: "Tentang Kami", href: "#tentang-kami" },
    { label: "Masalah & Solusi", href: "#masalah-solusi" },
    { label: "Layanan Aplikasi", href: "#layanan-aplikasi" },
    { label: "Trilogi Inovasi", href: "#trilogi-inovasi" },
    { label: "Gabung Mitra", href: "#gabung-mitra" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-[#00880D] selection:text-white">
      {/* =====================================================================
          A. STICKY NAVBAR (GAYA GOCORP) - TANPA TOMBOL LOGIN ADMIN
      ====================================================================== */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Corporate Brand Logo */}
            <a href="#tentang-kami" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-[#00880D] flex items-center justify-center shadow-md shadow-[#00880D]/20 group-hover:scale-105 transition-transform">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-[#0F172A] leading-none">
                    MORPH
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#00880D]/10 text-[#00880D]">
                    Corp
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 tracking-wide mt-0.5">
                  by TeknoHijau
                </span>
              </div>
            </a>

            {/* Center: Smooth Scroll Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-bold text-slate-700 hover:text-[#00880D] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right: Solid Green CTA Button (No Admin Login Button) */}
            <div className="hidden sm:flex items-center">
              <a
                href="#layanan-aplikasi"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00880D] hover:bg-[#059669] text-white text-sm font-extrabold shadow-md shadow-[#00880D]/20 hover:shadow-lg hover:shadow-[#00880D]/30 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Aplikasi MORPH</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-[#FFFFFF] border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#F8FAFC] hover:text-[#00880D]"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#layanan-aplikasi"
                onClick={() => setMobileNavOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#00880D] text-white text-sm font-extrabold shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Aplikasi MORPH</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          B. HERO SECTION (GAYA GOCORP - 2 KOLOM)
      ====================================================================== */}
      <section
        id="tentang-kami"
        className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#FFFFFF] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100"
      >
        {/* Subtle Corporate Decorative Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#00880D]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-[#059669]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Headline, Sub-headline & CTAs */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00880D]/10 border border-[#00880D]/20 text-[#00880D] text-xs sm:text-sm font-extrabold tracking-wide">
                <span>🌱 Solusi Revolusi Limbah Urban Bandar Lampung</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-[#0F172A] tracking-tight leading-[1.14]">
                Perkenalkan <span className="text-[#00880D]">MORPH</span>, Platform Manajemen Pengelolaan Sampah Berbasis On-Demand.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
                Kami menghubungkan Rumah Tangga Urban, Pengurus RT/RW, dan Mitra Kebersihan Lapangan melalui penjadwalan instan, pelacakan GPS real-time, dan insentif poin ekonomi sirkular.
              </p>

              {/* 2 CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href="#layanan-aplikasi"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#00880D] hover:bg-[#059669] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#00880D]/25 hover:-translate-y-0.5 transition-all"
                >
                  <span>Pelajari Cara Kerja</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href="#gabung-mitra"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#0F172A] font-extrabold text-sm sm:text-base border-2 border-slate-300 hover:border-[#00880D] transition-all"
                >
                  <Truck className="w-5 h-5 text-[#00880D]" />
                  <span>Daftar Jadi Mitra Driver</span>
                </a>
              </div>

              {/* Corporate Trust Metrics */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-xl">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#00880D]">
                    20 Kecamatan
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Cakupan Kota Bandar Lampung
                  </p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                    100% Digital
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Aplikasi Mobile Flutter &amp; GPS
                  </p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#059669]">
                    Sirkular
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Insentif Poin Tukar Tunai/Sembako
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Smartphone Mockup & Fleet Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Background Card Glow */}
                <div className="absolute -inset-3 rounded-[40px] bg-gradient-to-tr from-[#00880D]/20 via-[#059669]/15 to-emerald-200/30 blur-xl -z-10" />

                {/* Smartphone Frame Mockup */}
                <div className="bg-[#0F172A] rounded-[36px] p-3.5 shadow-2xl border-4 border-slate-800">
                  <div className="bg-[#FFFFFF] rounded-[28px] overflow-hidden border border-slate-100">
                    {/* Top Phone Status Bar */}
                    <div className="bg-[#00880D] text-white px-5 pt-4 pb-6">
                      <div className="flex items-center justify-between text-xs font-bold opacity-90 mb-4">
                        <span>MORPH Mobile • Flutter</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                          GPS Live • Bandar Lampung
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-emerald-100">Saldo Eco-Points Warga</p>
                          <p className="text-2xl font-black tracking-tight flex items-center gap-1.5 mt-0.5">
                            <Coins className="w-5 h-5 text-amber-300 fill-amber-300" />
                            <span>24.500 Poin</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 rounded-xl bg-white text-[#00880D] font-extrabold text-xs shadow-sm">
                            Tukar Saldo
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mockup Body: Active On-Demand Pickup Card */}
                    <div className="p-5 space-y-4 bg-[#F8FAFC]">
                      {/* Live Tracking Visual Pill */}
                      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00880D]/10 text-[#00880D] text-[11px] font-extrabold">
                            <span className="w-2 h-2 rounded-full bg-[#00880D] animate-ping" />
                            Armada Sedang Menuju Lokasi
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            ETA 6 Menit
                          </span>
                        </div>

                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-[#00880D] text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Truck className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-sm text-[#0F172A] truncate">
                              Mitra Armada Pickup • BE 8821 YX
                            </h4>
                            <p className="text-xs text-slate-500 truncate">
                              Titik Jemput: Jl. ZA. Pagar Alam, Kedaton
                            </p>
                          </div>
                        </div>

                        {/* Simulated Route Progress Bar */}
                        <div className="pt-1">
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="w-3/4 h-full bg-gradient-to-r from-[#00880D] to-[#059669] rounded-full" />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                            <span>Posko Kedaton</span>
                            <span className="text-[#00880D]">Rumah Warga (18 Kg Terpilah)</span>
                          </div>
                        </div>
                      </div>

                      {/* Waste Categories Summary inside Phone */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-slate-200/70">
                          <span className="text-[10px] font-extrabold uppercase text-[#00880D] block">
                            Sampah Organik
                          </span>
                          <span className="text-base font-black text-[#0F172A]">
                            8.5 Kg
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Kompos &amp; Sisa Dapur
                          </span>
                        </div>
                        <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-slate-200/70">
                          <span className="text-[10px] font-extrabold uppercase text-[#059669] block">
                            Sampah Anorganik
                          </span>
                          <span className="text-base font-black text-[#0F172A]">
                            9.5 Kg
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Plastik, Kardus &amp; Botol
                          </span>
                        </div>
                      </div>

                      {/* Bottom Bar inside Mockup */}
                      <div className="bg-[#0F172A] text-white p-3.5 rounded-2xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#059669]" />
                          <span className="font-bold">Terverifikasi Pengurus RT/RW</span>
                        </div>
                        <span className="font-extrabold text-amber-400">+180 Poin</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Fleet Badge */}
                <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-6 bg-[#FFFFFF] px-4 py-3 rounded-2xl shadow-xl border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-[#00880D]/10 text-[#00880D] flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      Teknologi Peta
                    </span>
                    <span className="text-xs font-black text-[#0F172A]">
                      OpenStreetMap Real-Time GPS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          C. SECTION: MENGAPA SISTEM LAMA HARUS BERUBAH? (DIAGNOSTIC COMPARISON MATRIX)
      ====================================================================== */}
      <section id="masalah-solusi" className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00880D]/10 text-[#00880D] text-xs font-extrabold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              Diagnostic Comparison Matrix
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Mengapa Sistem Pengelolaan Sampah Lama Harus Berubah?
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Perbandingan objektif antara metode pembuangan sampah konvensional di kawasan perkotaan dengan transformasi ekosistem digital <strong>MORPH</strong>.
            </p>
          </div>

          {/* 4 Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Tukang Sampah Keliling Konvensional */}
            <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                    Cara Lama #1
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#0F172A]">
                  Tukang Sampah Keliling Konvensional
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Waktu tidak menentu</strong> (bukan on-demand), warga tidak tahu kapan armada lewat.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Jangkauan terbatas</strong> dan tidak memiliki pelacakan rute lokasi.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Rentan cuaca buruk</strong> yang menyebabkan sampah menumpuk berhari-hari.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Tanpa poin reward</strong> meskipun warga sudah memilah sampah.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Efisiensi Rendah • Tanpa Kepastian
              </div>
            </div>

            {/* 2. Bakar Sampah Mandiri */}
            <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Flame className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold">
                    Cara Lama #2
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#0F172A]">
                  Bakar Sampah Mandiri di Pekarangan
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Merusak kualitas udara</strong> lingkungan tempat tinggal dan tetangga sekitar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Polusi toksik dioksin</strong> akibat pembakaran plastik rumah tangga.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Membahayakan pernapasan</strong> anak-anak dan lansia (risiko ISPA).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Melanggar aturan lingkungan</strong> dan berisiko memicu kebakaran.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-red-500 uppercase tracking-wider">
                Berbahaya • Merusak Kesehatan
              </div>
            </div>

            {/* 3. Buang Manual ke TPS */}
            <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
                    Cara Lama #3
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#0F172A]">
                  Buang Manual Sendiri ke TPS
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Membutuhkan waktu khusus</strong> dan tenaga untuk membawa sampah ke TPS.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Memicu penumpukan liar</strong> di pinggir jalan dan fasilitas publik.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Tidak praktis</strong> bagi keluarga pekerja urban yang sibuk.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Nol insentif ekonomi</strong> karena sampah langsung tercampur di TPS.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                Merepotkan • Memicu TPS Liar
              </div>
            </div>

            {/* 4. Solusi Digital MORPH (Highlight Hijau) */}
            <div className="bg-gradient-to-b from-[#00880D] to-[#059669] rounded-3xl p-6 text-white shadow-xl shadow-[#00880D]/20 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#00880D] flex items-center justify-center shadow-md">
                    <Recycle className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-extrabold uppercase tracking-wider">
                    Solusi Terbaik
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Solusi Digital On-Demand MORPH
                </h3>
                <ul className="space-y-3 text-xs text-emerald-50">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Penjemputan on-demand pasti</strong> dengan jadwal instan &amp; pelacakan GPS real-time.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>100% Ramah lingkungan</strong> melalui alur daur ulang &amp; kompos terverifikasi.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Sangat praktis dari rumah</strong> cukup lewat Aplikasi Mobile Android (Flutter).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Menghasilkan Poin Reward</strong> bernilai uang tunai, saldo digital, &amp; sembako.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/20 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider relative z-10">
                Terukur • Praktis • Menguntungkan
              </div>
            </div>
          </div>

          {/* Executive Summary Table Matrix */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-4 px-5 font-extrabold">Indikator Evaluasi</th>
                    <th className="py-4 px-5 font-semibold text-slate-300">Keliling Konvensional</th>
                    <th className="py-4 px-5 font-semibold text-slate-300">Bakar Mandiri</th>
                    <th className="py-4 px-5 font-semibold text-slate-300">Buang ke TPS</th>
                    <th className="py-4 px-5 font-extrabold bg-[#00880D] text-white">
                      Ekosistem Digital MORPH
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-[#0F172A]">Kepastian Waktu Jemput</td>
                    <td className="py-3.5 px-5 text-slate-500">Tidak Menentu</td>
                    <td className="py-3.5 px-5 text-slate-500">-</td>
                    <td className="py-3.5 px-5 text-slate-500">Repot Antar Sendiri</td>
                    <td className="py-3.5 px-5 font-extrabold text-[#00880D] bg-[#00880D]/5">
                      Instan &amp; Terlacak GPS Live
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-[#0F172A]">Dampak Ekologis &amp; Udara</td>
                    <td className="py-3.5 px-5 text-slate-500">Tercampur di TPA</td>
                    <td className="py-3.5 px-5 text-red-600 font-semibold">Polusi Udara Toksik</td>
                    <td className="py-3.5 px-5 text-amber-600 font-semibold">Rawan Tumpukan Liar</td>
                    <td className="py-3.5 px-5 font-extrabold text-[#00880D] bg-[#00880D]/5">
                      Terpilah &amp; Daur Ulang Sirkular
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-[#0F172A]">Insentif Ekonomi Warga</td>
                    <td className="py-3.5 px-5 text-slate-500">Rp 0 (Hanya Iuran)</td>
                    <td className="py-3.5 px-5 text-slate-500">Rp 0</td>
                    <td className="py-3.5 px-5 text-slate-500">Rp 0</td>
                    <td className="py-3.5 px-5 font-extrabold text-[#00880D] bg-[#00880D]/5">
                      Poin Reward Tukar Uang/Sembako
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          D. SECTION: SINTESIS TRILOGI TECHNOPRENEURSHIP MORPH
      ====================================================================== */}
      <section id="trilogi-inovasi" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00880D]/10 text-[#00880D] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Trilogi Inovasi Korporat
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Sintesis Trilogi Technopreneurship MORPH
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Fondasi bisnis berkelanjutan yang memadukan keunggulan rekayasa teknologi, ketepatan manajemen operasional, dan pemberdayaan ekonomi masyarakat Bandar Lampung.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pillar 1: The Technician */}
            <div className="bg-[#F8FAFC] hover:bg-[#FFFFFF] rounded-3xl p-8 border border-slate-200 hover:border-[#00880D] transition-all duration-300 shadow-xs hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-[#00880D] text-white flex items-center justify-center mb-6 shadow-md shadow-[#00880D]/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#00880D]/10 text-[#00880D] text-xs font-extrabold mb-3">
                01 • THE TECHNICIAN
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-3">
                Inovasi Teknis &amp; Navigasi Presisi
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Platform digital on-demand dan pelacakan armada real-time berbasis <strong>OpenStreetMap</strong> untuk kepastian waktu jemput dari titik rumah warga hingga ke fasilitas pengolahan.
              </p>
            </div>

            {/* Pillar 2: The Manager */}
            <div className="bg-[#F8FAFC] hover:bg-[#FFFFFF] rounded-3xl p-8 border border-slate-200 hover:border-[#00880D] transition-all duration-300 shadow-xs hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-[#059669] text-white flex items-center justify-center mb-6 shadow-md shadow-[#059669]/20 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#059669]/10 text-[#059669] text-xs font-extrabold mb-3">
                02 • THE MANAGER
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-3">
                Efisiensi Operasional &amp; Logistik
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kategorisasi pemilahan instan (<strong>Organik &amp; Anorganik</strong>) langsung dari sumber rumah tangga serta manajemen kapasitas muatan armada secara terstruktur menuju TPS.
              </p>
            </div>

            {/* Pillar 3: The Entrepreneur */}
            <div className="bg-[#F8FAFC] hover:bg-[#FFFFFF] rounded-3xl p-8 border border-slate-200 hover:border-[#00880D] transition-all duration-300 shadow-xs hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center mb-6 shadow-md group-hover:bg-[#00880D] transition-colors">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 text-xs font-extrabold mb-3">
                03 • THE ENTREPRENEUR
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-3">
                Nilai Ekonomi Sirkular &amp; Sosial
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Mengubah sampah terpilah menjadi <strong>poin digital</strong> yang bisa ditukar uang tunai atau sembako, sekaligus menciptakan lapangan kerja hijau baru bagi mitra driver di Bandar Lampung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          E. SECTION: SHOWCASE APLIKASI MOBILE MORPH (GAYA GOJEK - FLUTTER)
      ====================================================================== */}
      <section id="layanan-aplikasi" className="py-20 lg:py-28 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00880D]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00880D]/30 border border-[#059669]/50 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                <Smartphone className="w-4 h-4" />
                <span>Hadir di Android (Flutter Mobile App)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Seluruh Kemudahan Pemesanan Kini Ada di Aplikasi Mobile MORPH
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Untuk menjaga pengalaman yang cepat dan akurat dengan sensor GPS smartphone, pemesanan penjemputan sampah dilakukan sepenuhnya melalui <strong>Aplikasi Mobile Android (Flutter)</strong> untuk Warga dan Mitra Driver.
              </p>
            </div>

            {/* Interactive Role View Switcher */}
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 self-start">
              <button
                type="button"
                onClick={() => setActiveAppTab("warga")}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeAppTab === "warga"
                    ? "bg-[#00880D] text-white shadow-md"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                📱 Aplikasi Warga
              </button>
              <button
                type="button"
                onClick={() => setActiveAppTab("driver")}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeAppTab === "driver"
                    ? "bg-[#00880D] text-white shadow-md"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                🚛 Aplikasi Mitra Driver
              </button>
            </div>
          </div>

          {/* 3 Easy Steps Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-7 border border-slate-700/80 hover:border-[#059669] transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-[#00880D] text-white font-black text-lg flex items-center justify-center shadow-md">
                  01
                </span>
                <Scale className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Pilih Kategori &amp; Estimasi Berat
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Buka aplikasi mobile MORPH, pilih kategori sampah (<strong>Organik / Anorganik</strong>) dan geser estimasi berat dalam satuan <strong>Kg</strong> secara praktis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-7 border border-slate-700/80 hover:border-[#059669] transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-[#059669] text-white font-black text-lg flex items-center justify-center shadow-md">
                  02
                </span>
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Panggil Armada &amp; Chat Driver
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Sistem mencocokkan armada terdekat. Pantau pergerakan driver di <strong>peta live</strong> dan berkomunikasi langsung lewat fitur <strong>Chat Driver</strong> di dalam aplikasi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-7 border border-slate-700/80 hover:border-[#059669] transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                  03
                </span>
                <Coins className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Terima Poin Reward Otomatis
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Setelah sampah ditimbang dan diverifikasi oleh mitra driver di lokasi, <strong>Poin Reward</strong> langsung masuk ke dompet akun Anda untuk ditukar uang tunai atau sembako.
              </p>
            </div>
          </div>

          {/* Dynamic App Highlight Banner based on selected tab */}
          <div className="bg-gradient-to-r from-[#00880D] to-[#059669] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase">
                {activeAppTab === "warga"
                  ? "Fitur Unggulan Aplikasi Warga"
                  : "Fitur Unggulan Aplikasi Mitra Driver"}
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                {activeAppTab === "warga"
                  ? "Pesan Penjemputan dalam 10 Detik, Tanpa Tumpukan Sampah di Rumah"
                  : "Terima Order Jemputan Terdekat, Optimasi Rute & Penghasilan Harian Transparan"}
              </h4>
              <p className="text-emerald-50 text-xs sm:text-sm max-w-2xl">
                {activeAppTab === "warga"
                  ? "Dilengkapi notifikasi kedatangan armada, riwayat kontribusi daur ulang keluarga, dan katalog penukaran voucher sembako/saldo digital."
                  : "Dilengkapi navigasi titik jemput OpenStreetMap Bandar Lampung, kalkulator timbangan digital, dan pencairan insentif mitra harian."}
              </p>
            </div>

            <a
              href="#gabung-mitra"
              className="px-7 py-4 rounded-full bg-[#FFFFFF] text-[#0F172A] hover:bg-slate-100 font-extrabold text-sm shrink-0 shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>
                {activeAppTab === "warga"
                  ? "Ajukan Layanan di RT/RW Anda"
                  : "Daftar Jadi Mitra Driver"}
              </span>
              <ChevronRight className="w-4 h-4 text-[#00880D]" />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================================
          F. SECTION: FORM PENDAFTARAN MITRA & KONTAK INSTANSI (RT/RW)
      ====================================================================== */}
      <section id="gabung-mitra" className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00880D]/10 text-[#00880D] text-xs font-extrabold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                Kemitraan &amp; Kolaborasi Kota
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                Bergabung Bersama Ekosistem Kebersihan MORPH Bandar Lampung
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Kami membuka pendaftaran bagi pemilik armada/pekerja lapangan yang ingin menjadi <strong>Mitra Driver</strong>, serta <strong>Pengurus RT/RW, Kelurahan, dan Komunitas</strong> yang ingin mengintegrasikan wilayahnya ke dalam jaringan penjemputan terjadwal MORPH.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-slate-200 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#00880D]/10 text-[#00880D] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0F172A]">
                      Kemitraan Driver Armada (Motor / Pickup / Truk)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dapatkan penghasilan rutin dari setiap titik penjemputan warga di kecamatan tempat tinggal Anda.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-slate-200 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0F172A]">
                      Kerjasama Kolektif Pengurus RT/RW &amp; Instansi
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Modernisasi pengelolaan sampah lingkungan perumahan tanpa tumpukan liar dengan laporan transparan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] mb-1">
                  Formulir Pendaftaran Mitra &amp; Kontak Instansi
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Data pengajuan Anda akan langsung diteruskan ke tim operasional MORPH Bandar Lampung.
                </p>

                {/* Elegant Success Notification */}
                {submitSuccess && (
                  <div className="mb-6 p-5 rounded-2xl bg-[#00880D]/10 border border-[#00880D]/30 text-[#0F172A] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#00880D] font-extrabold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Pengajuan Berhasil Terkirim!</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{submitSuccess.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Terima kasih <strong>{submitSuccess.fullName}</strong>. Pengajuan kategori{" "}
                      <strong>{submitSuccess.category}</strong> untuk wilayah Kecamatan{" "}
                      <strong>{submitSuccess.district}</strong> telah tercatat di Inbox Admin MORPH dan akan segera kami tindak lanjuti.
                    </p>
                  </div>
                )}

                <form onSubmit={handlePartnerSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Budi Santoso / Ketua RT 05"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#00880D] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                        Nomor WhatsApp / Email
                      </label>
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="0812-xxxx-xxxx atau email@domain.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#00880D] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                        Kategori Pengajuan
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#00880D]"
                      >
                        <option value="Daftar Driver">Daftar Driver</option>
                        <option value="Kerjasama RT-RW">Kerjasama RT-RW</option>
                        <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                        Wilayah Kecamatan di Bandar Lampung
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#00880D]"
                      >
                        {BANDAR_LAMPUNG_DISTRICTS.map((kec) => (
                          <option key={kec} value={kec}>
                            Kecamatan {kec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                      Pesan / Detail Pengajuan
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan jenis kendaraan jika mendaftar driver, atau jumlah KK & lokasi lingkungan jika mengajukan kerjasama RT/RW..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#00880D]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-full bg-[#00880D] hover:bg-[#059669] text-white font-extrabold text-sm shadow-lg shadow-[#00880D]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting ? "Mengirim Pengajuan..." : "Kirim Pengajuan"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          G. FOOTER & HIDDEN ADMIN PORTAL TRIGGER
      ====================================================================== */}
      <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00880D] via-[#059669] to-emerald-400" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00880D] flex items-center justify-center text-white">
                  <Recycle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-white block leading-none">
                    MORPH
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    by TeknoHijau • Bandar Lampung
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                Ekosistem Pengelolaan Sampah Cerdas Berbasis On-Demand yang menghubungkan warga, pengurus RT/RW, dan mitra driver untuk mewujudkan Kota Bandar Lampung yang bersih dan sirkular.
              </p>
              <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#059669]" />
                  <span>
                    Jl. ZA. Pagar Alam No. 45, Kedaton, Kota Bandar Lampung, Lampung 35141
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#059669]" />
                  <span>(0721) 889-4000 • WhatsApp Center: +62 812-8890-4521</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#059669]" />
                  <span>korporat@morph-bandarlampung.id</span>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Navigasi Ekosistem
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#tentang-kami" className="hover:text-emerald-400 transition-colors">
                    Tentang MORPH &amp; Visi Kota
                  </a>
                </li>
                <li>
                  <a href="#masalah-solusi" className="hover:text-emerald-400 transition-colors">
                    Diagnostic Comparison Matrix
                  </a>
                </li>
                <li>
                  <a href="#trilogi-inovasi" className="hover:text-emerald-400 transition-colors">
                    Trilogi Technopreneurship
                  </a>
                </li>
                <li>
                  <a href="#layanan-aplikasi" className="hover:text-emerald-400 transition-colors">
                    Showcase Aplikasi Mobile (Flutter)
                  </a>
                </li>
                <li>
                  <a href="#gabung-mitra" className="hover:text-emerald-400 transition-colors">
                    Pendaftaran Mitra Driver &amp; RT/RW
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media & Coverage */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Saluran Resmi
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#059669]" />
                  <span>Instagram: @morph.bandarlampung</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#059669]" />
                  <span>Platform: Android Flutter Mobile</span>
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 text-xs space-y-1">
                <span className="text-emerald-400 font-extrabold block">
                  Mitra Resmi Lingkungan
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Melayani 20 Kecamatan di Kota Bandar Lampung secara terjadwal &amp; on-demand.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Hidden Admin Portal Trigger (3x click on copyright OR 20% opacity lock icon) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span
              onClick={handleSecretCopyrightClick}
              className="select-none cursor-default"
              title="Hak Cipta MORPH Eco Waste"
            >
              © 2026 MORPH Eco Waste - Tim Pengembang TeknoHijau
            </span>

            <div className="flex items-center gap-4">
              <span>Kota Bandar Lampung, Indonesia</span>
              <button
                type="button"
                onClick={() => router.push("/admin-login")}
                aria-label="Internal Portal"
                className="opacity-20 hover:opacity-50 transition-opacity p-1 text-slate-400 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
