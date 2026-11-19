"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Recycle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  UserCheck,
  BookOpen,
} from "lucide-react";

export default function SecretAdminLoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "CHIEF_ADMIN" | "DISPATCH_OPERATOR"
  >("CHIEF_ADMIN");
  const [isEntering, setIsEntering] = useState(false);

  const handleOneClickDemoAccess = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "morph_admin_session",
        JSON.stringify({
          username: "admin@morph.id",
          role: selectedRole,
          region: "Bandar Lampung",
          prototypeMode: "ACADEMIC_TECHNOPRENEURSHIP_PROTOTYPE",
          loggedInAt: new Date().toISOString(),
        })
      );
    }

    setIsEntering(true);
    setTimeout(() => {
      router.push("/admin");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center items-center px-4 py-12">
      {/* Academic Prototype Declaration Banner (Anti-Phishing Safe) */}
      <div className="w-full max-w-md mb-4 px-4 py-2.5 rounded-2xl bg-[#00880D]/10 border border-[#00880D]/25 text-[#00880D] text-xs font-bold flex items-center justify-center gap-2 text-center">
        <BookOpen className="w-4 h-4 shrink-0" />
        <span>
          Academic Technopreneurship Prototype — MORPH Smart Waste Ecosystem Bandar Lampung
        </span>
      </div>

      {/* Main Minimalist Corporate Portal Access Card */}
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
            Portal Demo Admin MORPH
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Akses simulasi pusat komando operasional Mobile App (Warga &amp; Mitra Driver) wilayah Kota Bandar Lampung.
          </p>
        </div>

        {/* Pre-Configured Demo Profile Selector (No Empty Password Form) */}
        <div className="space-y-3">
          <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Pilih Profil Sesi Presentasi Akademik:
          </span>

          <div
            onClick={() => setSelectedRole("CHIEF_ADMIN")}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              selectedRole === "CHIEF_ADMIN"
                ? "border-[#00880D] bg-[#00880D]/5"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00880D] text-white flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-[#0F172A]">
                  Administrator Utama (Demo)
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  ID: admin@morph.id • Akses Penuh CRUD
                </div>
              </div>
            </div>
            <CheckCircle2
              className={`w-5 h-5 ${
                selectedRole === "CHIEF_ADMIN"
                  ? "text-[#00880D]"
                  : "text-slate-300"
              }`}
            />
          </div>

          <div
            onClick={() => setSelectedRole("DISPATCH_OPERATOR")}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              selectedRole === "DISPATCH_OPERATOR"
                ? "border-[#00880D] bg-[#00880D]/5"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-[#0F172A]">
                  Penguji / Dosen Evaluator
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Mode Evaluasi Live Dispatch &amp; Grafik
                </div>
              </div>
            </div>
            <CheckCircle2
              className={`w-5 h-5 ${
                selectedRole === "DISPATCH_OPERATOR"
                  ? "text-[#00880D]"
                  : "text-slate-300"
              }`}
            />
          </div>
        </div>

        {/* 1-Click Demo Button */}
        <button
          type="button"
          onClick={handleOneClickDemoAccess}
          disabled={isEntering}
          className="w-full py-4 rounded-full bg-[#00880D] hover:bg-[#059669] text-white font-extrabold text-sm shadow-lg shadow-[#00880D]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
        >
          {isEntering ? (
            <>
              <CheckCircle2 className="w-5 h-5 animate-pulse" />
              <span>Membuka Dashboard Demo...</span>
            </>
          ) : (
            <>
              <span>Masuk Dashboard Demo (1-Klik)</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="pt-4 border-t border-slate-100 text-center space-y-1">
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-[#00880D] transition-colors block"
          >
            &larr; Kembali ke Website Publik MORPH Bandar Lampung
          </Link>
        </div>
      </div>
    </div>
  );
}
