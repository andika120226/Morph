"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Coins,
  Recycle,
  Gift,
  Calendar,
  LogOut,
  PlusCircle,
  CheckCircle2,
  Clock,
  Truck,
  Award,
  Trash2,
  Edit3,
  Check,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  points: number;
  joinedDate: string;
  tier: string;
  isVerified: boolean;
}

interface ReportRecord {
  id: string;
  category: string;
  weight: number;
  status: "PENDING" | "ACCEPTED" | "COMPLETED";
  vehicleRec: string;
  createdAt: string;
}

interface RewardRedemption {
  id: string;
  title: string;
  merchant: string;
  pointsUsed: number;
  redeemedAt: string;
  voucherCode: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reports" | "rewards">("reports");
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    id: "usr-morph-001",
    name: "Andika Pratama",
    email: "warga@morph.id",
    phone: "+62 812-8890-4521",
    address: "Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung",
    points: 1250,
    joinedDate: "Januari 2026",
    tier: "Eco Guardian Gold",
    isVerified: true,
  });

  const [reportsHistory, setReportsHistory] = useState<ReportRecord[]>([
    {
      id: "rep-8812",
      category: "ORGANIC:15kg + ANORGANIC:20kg",
      weight: 35,
      status: "COMPLETED",
      vehicleRec: "PICKUP",
      createdAt: "26 Okt 2026, 14:20",
    },
    {
      id: "rep-8790",
      category: "ANORGANIC:12kg + PAPER:10kg",
      weight: 22,
      status: "COMPLETED",
      vehicleRec: "MOTOR",
      createdAt: "21 Okt 2026, 09:15",
    },
    {
      id: "rep-8741",
      category: "ORGANIC:18kg",
      weight: 18,
      status: "COMPLETED",
      vehicleRec: "MOTOR",
      createdAt: "14 Okt 2026, 16:40",
    },
  ]);

  const [rewardsHistory] = useState<RewardRedemption[]>([
    {
      id: "red-01",
      title: "Token Listrik PLN Rp 50.000",
      merchant: "PLN Mobile",
      pointsUsed: 500,
      redeemedAt: "25 Okt 2026",
      voucherCode: "MORPH-PLN-9921",
    },
    {
      id: "red-02",
      title: "Voucher Belanja Sembako Rp 25.000",
      merchant: "Indomaret / Alfamart",
      pointsUsed: 250,
      redeemedAt: "18 Okt 2026",
      voucherCode: "MORPH-MART-4410",
    },
    {
      id: "red-03",
      title: "Saldo GoPay / OVO Rp 20.000",
      merchant: "Dompet Digital",
      pointsUsed: 200,
      redeemedAt: "10 Okt 2026",
      voucherCode: "MORPH-EWALLET-771",
    },
  ]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    // Load stored user from localStorage if logged in
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("morph_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setProfile((prev) => ({
            ...prev,
            id: parsed.id || prev.id,
            name: parsed.name || prev.name,
            email: parsed.email || prev.email,
            points: typeof parsed.points === "number" ? parsed.points : prev.points,
          }));
        }

        const localReports = localStorage.getItem("morph_reports_history");
        if (localReports) {
          const parsedReports = JSON.parse(localReports);
          if (Array.isArray(parsedReports) && parsedReports.length > 0) {
            setReportsHistory((prev) => [...parsedReports, ...prev]);
          }
        }
      } catch {
        // ignore localStorage errors
      }
    }

    // Fetch live reports from backend
    fetch(`${apiUrl}/reports`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReportsHistory(
            data.map((r: any) => ({
              id: r.id,
              category: r.category,
              weight: Number(r.weight),
              status: r.status || "PENDING",
              vehicleRec: r.vehicleRec || "MOTOR",
              createdAt: r.createdAt
                ? new Date(r.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Baru saja",
            }))
          );
        }
      })
      .catch(() => {
        // fallback already populated
      });
  }, [apiUrl]);

  const totalRecycledKg = reportsHistory.reduce(
    (sum, r) => sum + Number(r.weight || 0),
    0
  );

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("morph_user");
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Profile Banner Card */}
        <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#16a34a] text-[#ffffff] flex items-center justify-center text-3xl font-black shadow-md shadow-[#16a34a]/25">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                {profile.isVerified && (
                  <div
                    title="Akun Warga Terverifikasi"
                    className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#ffffff] p-0.5 shadow-md"
                  >
                    <div className="w-full h-full rounded-full bg-[#16a34a] text-white flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Name, Verification Badge & Metadata */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] text-xs font-extrabold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Akun Terverifikasi</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{profile.tier}</span>
                  </span>
                </div>

                <p className="text-sm text-slate-500 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#16a34a]" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#16a34a]" />
                    Bergabung sejak {profile.joinedDate}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f0fdf4] hover:bg-emerald-100 text-[#16a34a] border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
              >
                {isEditing ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Simpan Profil</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profil</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>

          {/* Key Eco Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 block">
                  Total Poin Reward Aktif
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#16a34a]">
                  {profile.points.toLocaleString("id-ID")} Poin
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#ffffff] border border-emerald-200 flex items-center justify-center text-amber-500 shadow-2xs">
                <Coins className="w-6 h-6 fill-amber-400" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 block">
                  Total Kontribusi Sampah
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {totalRecycledKg} kg
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#ffffff] border border-emerald-200 flex items-center justify-center text-[#16a34a] shadow-2xs">
                <Recycle className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 block">
                  Laporan Penjemputan
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {reportsHistory.length} Kali
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#ffffff] border border-emerald-200 flex items-center justify-center text-[#16a34a] shadow-2xs">
                <Trash2 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Lower Grid: Personal Details + Contribution & Reward History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Personal Info & Verification Status */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#16a34a]" />
                  <span>Informasi Pribadi Warga</span>
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  {profile.id}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Nama Lengkap
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  ) : (
                    <p className="font-bold text-slate-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Alamat Email
                  </label>
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#16a34a]" />
                    {profile.email}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#16a34a]" />
                      {profile.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Alamat Titik Jemput Utama
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  ) : (
                    <p className="font-medium text-slate-700 flex items-start gap-2 leading-relaxed">
                      <MapPin className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                      <span>{profile.address}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Verification Status Box */}
              <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-[#16a34a] font-extrabold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Status Verifikasi Warga</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Identitas dan koordinat rumah Anda telah terverifikasi oleh sistem MORPH. Anda berhak menikmati pencairan poin reward instan.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href="/cleanup-request"
                  className="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-green-700 text-[#ffffff] font-bold text-xs text-center flex items-center justify-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Buat Laporan Sampah Baru</span>
                </Link>
                <Link
                  href="/rewards"
                  className="w-full py-3 rounded-xl bg-[#f0fdf4] hover:bg-emerald-100 text-[#16a34a] border border-emerald-200 font-bold text-xs text-center flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Tukarkan Poin Reward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Tabs for Waste Reports History & Reward Redemptions */}
          <div className="lg:col-span-8">
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-6">
              {/* Tab Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="inline-flex p-1 rounded-xl bg-[#f0fdf4] border border-emerald-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("reports")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      activeTab === "reports"
                        ? "bg-[#16a34a] text-[#ffffff] shadow-xs"
                        : "text-slate-600 hover:text-[#16a34a]"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Riwayat Laporan Sampah ({reportsHistory.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("rewards")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      activeTab === "rewards"
                        ? "bg-[#16a34a] text-[#ffffff] shadow-xs"
                        : "text-slate-600 hover:text-[#16a34a]"
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Riwayat Penukaran Reward ({rewardsHistory.length})</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Riwayat Kontribusi Laporan Sampah */}
              {activeTab === "reports" && (
                <div className="space-y-4">
                  {reportsHistory.map((rep) => {
                    const earnedPts = Math.round(Number(rep.weight) * 10);
                    return (
                      <div
                        key={rep.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-[#ffffff] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] flex items-center justify-center shrink-0">
                            <Trash2 className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-400">
                                #{rep.id}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  rep.status === "COMPLETED"
                                    ? "bg-[#f0fdf4] text-[#16a34a] border border-emerald-200"
                                    : rep.status === "ACCEPTED"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {rep.status === "COMPLETED" ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                                {rep.status}
                              </span>
                            </div>

                            <h3 className="text-sm font-extrabold text-slate-900">
                              Kategori: {rep.category}
                            </h3>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-[#16a34a]" />
                                Armada: <strong>{rep.vehicleRec}</strong>
                              </span>
                              <span>•</span>
                              <span>{rep.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          <span className="text-sm font-black text-slate-900 font-mono">
                            Total: {rep.weight} kg
                          </span>
                          <span className="text-xs font-extrabold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-1 rounded-lg border border-emerald-200">
                            +{earnedPts} Poin MORPH
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Riwayat Penukaran Reward */}
              {activeTab === "rewards" && (
                <div className="space-y-4">
                  {rewardsHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-[#ffffff] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] flex items-center justify-center shrink-0">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#16a34a]">
                            {item.merchant}
                          </span>
                          <h3 className="text-sm font-extrabold text-slate-900">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Ditukarkan pada {item.redeemedAt} • Kode Voucher:{" "}
                            <code className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.voucherCode}
                            </code>
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                        <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          -{item.pointsUsed} Poin
                        </span>
                        <span className="text-[11px] font-bold text-[#16a34a] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Berhasil Diklaim
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

