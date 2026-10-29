"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Recycle, Heart, ShieldCheck, Leaf, Globe2, Sparkles } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Sembunyikan Footer pada halaman Splash Screen (/), Login, dan Register
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-emerald-950 mt-auto">
      {/* Top green accent border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">MORPH</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform pengelolaan sampah on-demand terdepan di Indonesia. Mengintegrasikan warga, armada penjemput, dan fasilitas daur ulang secara cerdas.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Leaf className="w-4 h-4" />
              <span>Bersih Lingkungannya, Nyata Manfaatnya.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Layanan MORPH
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cleanup-request" className="hover:text-emerald-400 transition-colors">
                  Lapor Sampah On-Demand
                </Link>
              </li>
              <li>
                <Link href="/driver-map" className="hover:text-emerald-400 transition-colors">
                  Peta Armada & Driver
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-emerald-400 transition-colors">
                  Katalog Hadiah & Poin
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Kontak Kami & Operasi Sungai (Alat Berat)
                </Link>
              </li>
            </ul>
          </div>

          {/* Klasifikasi Armada */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Rekomendasi AI Armada
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>&lt; 30 kg: <strong>Motor Listrik</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>30 - 200 kg: <strong>Mobil Pickup</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-400" />
                <span>&gt; 200 kg: <strong>Truk Ekstra</strong></span>
              </li>
            </ul>
          </div>

          {/* Eco Impact Stats */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Dampak Kolektif MORPH</span>
            </div>
            <div className="text-2xl font-black text-white">12,450+ kg</div>
            <p className="text-xs text-slate-400 mb-3">Sampah berhasil dialihkan dari TPA bulan ini</p>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[78%]" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Target: 15 Ton</span>
              <span className="text-emerald-400 font-semibold">78%</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MORPH Eco-System. Didesain untuk masa depan Indonesia bersih.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Backend NestJS & PostgreSQL via Prisma ORM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
