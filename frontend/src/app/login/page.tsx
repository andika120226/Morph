"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Recycle,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Leaf,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Silakan masukkan alamat email dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Gagal masuk. Periksa kembali email atau daftar akun baru."
        );
      }

      if (typeof window !== "undefined" && data?.user) {
        localStorage.setItem("morph_user", JSON.stringify(data.user));
      }

      setSuccessMsg("Login berhasil! Mengalihkan ke Dashboard MORPH...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi gangguan koneksi ke server NestJS.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f0fdf4] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-8 group">
        <div className="w-12 h-12 rounded-2xl bg-[#16a34a] flex items-center justify-center shadow-md shadow-[#16a34a]/25 group-hover:scale-105 transition-transform">
          <Recycle className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
            MORPH
          </span>
          <span className="text-xs font-semibold text-[#16a34a] tracking-wide">
            Eco Waste Management
          </span>
        </div>
      </Link>

      {/* Main Card (#ffffff & rounded-2xl) */}
      <div className="w-full max-w-md bg-[#ffffff] rounded-2xl shadow-xl shadow-emerald-950/5 border border-emerald-100 p-8 sm:p-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdf4] text-[#16a34a] text-xs font-bold border border-emerald-200">
            <Leaf className="w-3.5 h-3.5" />
            <span>Selamat Datang Kembali</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Masuk ke Akun Anda
          </h1>
          <p className="text-sm text-slate-500">
            Kelola laporan penjemputan sampah dan tukarkan poin reward Anda.
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-[#f0fdf4] border border-emerald-300 flex items-start gap-3 text-[#16a34a] text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#16a34a]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
            >
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="warga@morph.id"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Kata Sandi
              </label>
              <span className="text-xs font-semibold text-[#16a34a] hover:underline cursor-pointer">
                Lupa sandi?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#16a34a] hover:bg-green-700 disabled:opacity-60 text-[#ffffff] font-bold text-sm shadow-md shadow-[#16a34a]/25 hover:shadow-lg hover:shadow-[#16a34a]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
          Belum memiliki akun MORPH?{" "}
          <Link
            href="/register"
            className="font-bold text-[#16a34a] hover:underline"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </div>

      {/* Back to Splash Screen */}
      <div className="mt-6 text-xs text-slate-500">
        <Link href="/" className="hover:text-[#16a34a] transition-colors">
          &larr; Kembali ke Layar Utama (Splash Screen)
        </Link>
      </div>
    </div>
  );
}

