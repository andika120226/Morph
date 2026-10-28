"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Recycle,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Semua kolom pendaftaran wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal terdiri dari 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Gagal mendaftarkan akun. Silakan coba lagi."
        );
      }

      if (typeof window !== "undefined" && data?.user) {
        localStorage.setItem("morph_user", JSON.stringify(data.user));
      }

      setSuccessMsg(
        "Pendaftaran berhasil! Anda mendapatkan +100 Poin Awal. Mengalihkan ke halaman Login..."
      );
      setTimeout(() => {
        router.push("/login");
      }, 1200);
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bonus +100 Poin Pengguna Baru</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Buat Akun MORPH
          </h1>
          <p className="text-sm text-slate-500">
            Bergabung sekarang untuk mulai menjadwalkan penjemputan sampah on-demand.
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

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Andika Pratama"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all"
              />
            </div>
          </div>

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
                placeholder="nama@email.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
            >
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#16a34a] hover:bg-green-700 disabled:opacity-60 text-[#ffffff] font-bold text-sm shadow-md shadow-[#16a34a]/25 hover:shadow-lg hover:shadow-[#16a34a]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              <>
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
          Sudah punya akun MORPH?{" "}
          <Link
            href="/login"
            className="font-bold text-[#16a34a] hover:underline"
          >
            Masuk di Sini
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

