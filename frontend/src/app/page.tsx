"use client";

import { useRouter } from "next/navigation";
import { Recycle, Sparkles, ArrowRight } from "lucide-react";

export default function SplashScreenPage() {
  const router = useRouter();

  const handleScreenClick = () => {
    router.push("/login");
  };

  return (
    <div
      onClick={handleScreenClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleScreenClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Ketuk layar di mana saja untuk masuk ke halaman Login MORPH"
      className="relative w-full h-screen min-h-[100dvh] overflow-hidden cursor-pointer select-none flex flex-col items-center justify-between px-6 py-14 sm:py-20 bg-slate-950"
    >
      {/* Fullscreen Background Image from /public/splashscren2.jpg */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000 hover:scale-100"
        style={{ backgroundImage: "url('/splashscren2.jpg')" }}
      />

      {/* Elegant Thin Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />

      {/* Top Brand Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-lg">
        <div className="w-8 h-8 rounded-full bg-[#16a34a] flex items-center justify-center shadow-sm">
          <Recycle className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-extrabold tracking-widest uppercase">
          MORPH Eco-System
        </span>
      </div>

      {/* Center / Top-Center Aesthetic Quote */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16a34a]/30 backdrop-blur-md border border-emerald-400/40 text-emerald-100 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>On-Demand Waste Management Indonesia</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          &ldquo;The beauty of life remains in nature &mdash; Clean our earth with Morph&rdquo;
        </h1>

        <p className="text-lg sm:text-2xl font-semibold text-emerald-300 tracking-wide drop-shadow">
          — Morph Waste Management
        </p>

        <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto font-normal leading-relaxed">
          Solusi penjemputan sampah cerdas berwawasan lingkungan. Wujudkan bumi yang lebih bersih mulai dari langkah kecil di rumah Anda.
        </p>
      </div>

      {/* Bottom Tap-to-Proceed Indicator */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-sm font-semibold transition-all duration-300 shadow-xl animate-pulse">
          <span>Ketuk layar di mana saja untuk masuk</span>
          <ArrowRight className="w-4 h-4 text-emerald-300" />
        </div>
      </div>
    </div>
  );
}
