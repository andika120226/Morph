"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Recycle,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function SecretAdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin@morph.id");
  const [password, setPassword] = useState("morph2026");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAutoFillDemo = () => {
    setUsername("admin@morph.id");
    setPassword("morph2026");
    setErrorMsg(null);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "morph_admin_session",
        JSON.stringify({
          username: "admin@morph.id",
          role: "CHIEF_OPERATIONS_ADMIN",
          region: "Bandar Lampung",
          loggedInAt: new Date().toISOString(),
        })
      );
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      router.push("/admin");
    }, 350);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username dan Password wajib diisi.");
      return;
    }

    if (
      username.trim().toLowerCase() !== "admin@morph.id" &&
      password.trim() !== "morph2026"
    ) {
      setErrorMsg(
        "Kredensial tidak cocok. Gunakan admin@morph.id / morph2026 atau klik tombol Demo Otomatis."
      );
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "morph_admin_session",
        JSON.stringify({
          username: username.trim(),
          role: "CHIEF_OPERATIONS_ADMIN",
          region: "Bandar Lampung",
          loggedInAt: new Date().toISOString(),
        })
      );
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      router.push("/admin");
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center items-center px-4 py-12">
      {/* Main Minimalist Corporate Login Card */}
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-[#00880D] text-white flex items-center justify-center shadow-lg shadow-[#00880D]/25">
            <Recycle className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00880D]/10 text-[#00880D] text-[11px] font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MORPH Control Center • TeknoHijau</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Portal Login Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Pusat komando operasional Mobile App (Warga &amp; Driver) wilayah Kota Bandar Lampung.
          </p>
        </div>

        {/* 1-Click Presentation Demo Helper Button */}
        <div className="p-3.5 rounded-2xl bg-[#00880D]/5 border border-[#00880D]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-700">
            <span className="font-extrabold text-[#00880D] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Mode Presentasi / Penguji
            </span>
            <span className="text-[11px] text-slate-500">
              admin@morph.id • morph2026
            </span>
          </div>
          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer shrink-0"
          >
            Isi Kredensial Demo Otomatis
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Username / Email Admin
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@morph.id"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#00880D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="morph2026"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#00880D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3.5 rounded-full bg-[#00880D] hover:bg-[#059669] text-white font-extrabold text-sm shadow-lg shadow-[#00880D]/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
          >
            {isLoggingIn ? (
              <>
                <CheckCircle2 className="w-4 h-4 animate-pulse" />
                <span>Membuka Admin Dashboard...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-[#00880D] transition-colors"
          >
            &larr; Kembali ke Website Publik MORPH
          </Link>
        </div>
      </div>
    </div>
  );
}
