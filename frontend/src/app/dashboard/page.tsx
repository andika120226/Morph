"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  PlusCircle, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  Bike, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  Coins, 
  Leaf, 
  Scale 
} from "lucide-react";

export default function DashboardPage() {
  const [demoWeight, setDemoWeight] = useState<number>(45);

  // Heuristic AI rule calculation
  const getRecommendation = (w: number) => {
    if (w < 30) {
      return {
        type: "MOTOR",
        title: "Armada Motor Listrik MORPH",
        desc: "Cepat dan lincah masuk ke gang padat penduduk. Emisi nol persen.",
        icon: Bike,
        color: "text-emerald-600 bg-emerald-100 border-emerald-200",
        badge: "Skala Rumah Tangga (< 30 kg)",
      };
    } else if (w <= 200) {
      return {
        type: "PICKUP",
        title: "Armada Mobil Pickup Eco-Van",
        desc: "Kapasitas muat ideal untuk lingkungan perumahan, ruko, & kantor.",
        icon: Car,
        color: "text-teal-600 bg-teal-100 border-teal-200",
        badge: "Skala Menengah (30 - 200 kg)",
      };
    } else {
      return {
        type: "TRUCK",
        title: "Armada Truk Khusus MORPH",
        desc: "Kapasitas angkut hidrolik masif untuk pasar, industri, & kawasan publik.",
        icon: Truck,
        color: "text-amber-600 bg-amber-100 border-amber-200",
        badge: "Skala Besar (> 200 kg)",
      };
    }
  };

  const currentRec = getRecommendation(demoWeight);
  const RecIcon = currentRec.icon;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-emerald-100/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-tr from-emerald-200/40 via-teal-200/30 to-lime-200/30 blur-3xl -z-10 rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Platform Sampah On-Demand Pertama di Indonesia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Ubah Sampah Jadi <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600">
                  Poin Reward Berkah
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Tumpukan sampah di rumah atau kantor? Cukup foto, tentukan titik jemput di peta, dan algoritma cerdas MORPH akan mengirimkan armada jemput terdekat langsung ke lokasi Anda.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/cleanup-request"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Lapor Sampah Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/driver-map"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs hover:border-emerald-300 transition-all duration-200"
                >
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Pantau Peta Driver</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Penjemputan Tepat Waktu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Dapat Poin Tiap Penjemputan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  <span>Daur Ulang Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive AI Armada Simulator Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/5 border border-emerald-100 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                      <Scale className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Simulasi AI Armada</h3>
                      <p className="text-xs text-slate-500">Geser untuk melihat armada otomatis</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Heuristic
                  </span>
                </div>

                {/* Weight Slider */}
                <div className="my-6 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Estimasi Berat Sampah:
                    </label>
                    <span className="text-2xl font-black text-emerald-700 font-mono">
                      {demoWeight} <span className="text-sm font-semibold text-slate-500">kg</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={demoWeight}
                    onChange={(e) => setDemoWeight(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono font-medium">
                    <span>5 kg (Motor)</span>
                    <span>100 kg (Pickup)</span>
                    <span>500 kg (Truk)</span>
                  </div>
                </div>

                {/* Recommendation Box */}
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${currentRec.color}`}>
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-white shadow-xs">
                      <RecIcon className="w-7 h-7 text-slate-800" />
                    </div>
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/70">
                        {currentRec.badge}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">{currentRec.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{currentRec.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Estimasi Poin Reward:</span>
                  <span className="font-extrabold text-amber-600 text-sm">
                    +{Math.round(demoWeight * 10)} Poin MORPH
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Bar */}
      <section className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-emerald-600 mb-1">12.4 Ton</div>
              <p className="text-xs font-semibold text-slate-500">Sampah Terkelola</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-teal-600 mb-1">48.200+</div>
              <p className="text-xs font-semibold text-slate-500">Poin Ditukarkan</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-lime-600 mb-1">99.4%</div>
              <p className="text-xs font-semibold text-slate-500">Tingkat Daur Ulang</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-emerald-800 mb-1">18 Armada</div>
              <p className="text-xs font-semibold text-slate-500">Siap On-Demand</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              Alur Mudah & Cepat
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Cara Kerja Penjemputan Sampah MORPH
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Hanya butuh 3 langkah praktis dari ponsel Anda untuk menjaga lingkungan tetap asri dan mengumpulkan reward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative group hover:border-emerald-300 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Foto & Tandai Lokasi</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Pilih jenis sampah (Organik / Anorganik / Campuran), masukkan perkiraan berat, dan klik peta untuk titik jemput akurat.
              </p>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Form Lapor Sampah Cepat</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative group hover:border-teal-300 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 font-black text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Armada Menjemput</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Sistem otomatis memilihkan armada (Motor, Pickup, atau Truk) sesuai muatan. Petugas driver langsung meluncur ke lokasi.
              </p>
              <div className="text-xs font-bold text-teal-700 flex items-center gap-1">
                <span>Pelacakan Peta Real-time</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative group hover:border-lime-300 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-800 font-black text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Timbang & Klaim Poin</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Setelah sampah terangkut, poin otomatis masuk ke akun Anda untuk ditukar voucher belanja, pulsa, maupun token listrik.
              </p>
              <div className="text-xs font-bold text-lime-700 flex items-center gap-1">
                <span>Reward Langsung Cair</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

