"use client";

import { useEffect, useState } from "react";
import { 
  Gift, 
  Coins, 
  Sparkles, 
  ShoppingBag, 
  Zap, 
  Wallet, 
  TreePine, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowUpRight,
  ShieldCheck,
  Award
} from "lucide-react";

interface Voucher {
  id: string;
  title: string;
  discount: string;
  pointsCost: number;
  merchant: string;
  category?: "SHOPPING" | "WALLET" | "ELECTRICITY" | "ECO";
  iconName?: string;
  description?: string;
}

export default function RewardsPage() {
  const [userPoints, setUserPoints] = useState<number>(1250);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeModalVoucher, setActiveModalVoucher] = useState<Voucher | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Official default reward catalog
  const fallbackVouchers: Voucher[] = [
    {
      id: "v-01",
      title: "Voucher Belanja Indomaret",
      discount: "Rp 25.000",
      pointsCost: 250,
      merchant: "Indomaret",
      category: "SHOPPING",
      description: "Berlaku di seluruh gerai Indomaret untuk kebutuhan sehari-hari.",
    },
    {
      id: "v-02",
      title: "Voucher Belanja Alfamart",
      discount: "Rp 50.000",
      pointsCost: 500,
      merchant: "Alfamart",
      category: "SHOPPING",
      description: "Dapat digunakan untuk semua produk retail kecuali rokok dan susu bayi.",
    },
    {
      id: "v-03",
      title: "Saldo GoPay Digital",
      discount: "Rp 25.000",
      pointsCost: 300,
      merchant: "GoPay",
      category: "WALLET",
      description: "Langsung masuk ke akun GoPay nomor ponsel terdaftar Anda.",
    },
    {
      id: "v-04",
      title: "Token Listrik Prabayar PLN",
      discount: "Rp 50.000",
      pointsCost: 500,
      merchant: "PLN Mobile",
      category: "ELECTRICITY",
      description: "Nomor token 20 digit dikirim via SMS & tersimpan di riwayat akun.",
    },
    {
      id: "v-05",
      title: "Adopsi 1 Pohon Mangrove",
      discount: "Sertifikat Digital",
      pointsCost: 400,
      merchant: "LindungiHutan x MORPH",
      category: "ECO",
      description: "Ditanam atas nama Anda di pesisir pantai Muara Gembong dengan geo-tagging.",
    },
    {
      id: "v-06",
      title: "Voucher Diskon Tokopedia",
      discount: "Diskon 15% (s/d Rp 75.000)",
      pointsCost: 650,
      merchant: "Tokopedia",
      category: "SHOPPING",
      description: "Berlaku di Official Store dengan minimal belanja Rp 100.000.",
    },
  ];

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch(`${apiUrl}/vouchers`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setVouchers(data);
            return;
          }
        }
        setVouchers(fallbackVouchers);
      } catch (err) {
        setVouchers(fallbackVouchers);
      }
    };

    fetchVouchers();
  }, [apiUrl]);

  const handleRedeem = (voucher: Voucher) => {
    if (userPoints < voucher.pointsCost) {
      alert("Maaf, poin Anda belum mencukupi untuk voucher ini. Kumpulkan poin dengan lapor sampah!");
      return;
    }

    // Deduct points
    setUserPoints((prev) => prev - voucher.pointsCost);
    // Generate unique code
    const randomCode =
      "MORPH-" +
      voucher.merchant.substring(0, 3).toUpperCase() +
      "-" +
      Math.floor(1000 + Math.random() * 9000);
    setRedeemedCode(randomCode);
  };

  const handleCopyCode = () => {
    if (redeemedCode) {
      navigator.clipboard.writeText(redeemedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (selectedCategory === "ALL") return true;
    return v.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner: User Points Balance & Tier Status */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Tingkat: Eco Guardian Level 3</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Katalog Penukaran Hadiah MORPH
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              Tukarkan poin yang Anda kumpulkan dari setiap penjemputan sampah terpilah dengan berbagai voucher kebutuhan harian dan donasi aksi hijau.
            </p>
          </div>

          {/* Points Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center sm:text-right min-w-[220px]">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200 block mb-1">
              Saldo Poin Anda
            </span>
            <div className="flex items-center justify-center sm:justify-end gap-2 text-3xl sm:text-4xl font-black text-amber-300 font-mono">
              <Coins className="w-8 h-8 fill-amber-300 text-amber-400" />
              <span>{userPoints.toLocaleString("id-ID")}</span>
            </div>
            <p className="text-[11px] text-emerald-200 mt-2">
              ≈ setara Rp {(userPoints * 100).toLocaleString("id-ID")} nilai belanja
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ALL", label: "Semua Hadiah", icon: Gift },
            { id: "SHOPPING", label: "Minimarket & Belanja", icon: ShoppingBag },
            { id: "WALLET", label: "E-Wallet Digital", icon: Wallet },
            { id: "ELECTRICITY", label: "Listrik PLN", icon: Zap },
            { id: "ECO", label: "Aksi Hijau", icon: TreePine },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Menampilkan {filteredVouchers.length} Voucher
        </span>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVouchers.map((voucher) => {
          const canAfford = userPoints >= voucher.pointsCost;

          return (
            <div
              key={voucher.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                    {voucher.merchant}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{voucher.pointsCost} Pts</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{voucher.title}</h3>
                <div className="text-2xl font-black text-emerald-700 font-sans mb-3">
                  {voucher.discount}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {voucher.description || "Gunakan voucher ini saat pembayaran di kasir atau aplikasi mitra."}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {canAfford ? "Poin Anda Cukup" : `Kurang ${voucher.pointsCost - userPoints} Pts`}
                </span>
                <button
                  onClick={() => {
                    setActiveModalVoucher(voucher);
                    setRedeemedCode(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    canAfford
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  Tukar Voucher
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redemption Confirmation Modal */}
      {activeModalVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 animate-in zoom-in-95 duration-200">
            {!redeemedCode ? (
              // Step 1: Confirmation
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Gift className="w-6 h-6" />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-xl font-black text-slate-900">
                    Konfirmasi Penukaran Voucher
                  </h3>
                  <p className="text-xs text-slate-500">
                    Poin Anda akan dipotong untuk mendapatkan kode voucher ini.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hadiah:</span>
                    <span className="font-bold text-slate-900">{activeModalVoucher.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nominal / Nilai:</span>
                    <span className="font-bold text-emerald-700">{activeModalVoucher.discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Biaya Poin:</span>
                    <span className="font-bold text-amber-600">
                      -{activeModalVoucher.pointsCost} Poin
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
                    <span className="text-slate-700">Sisa Poin Anda:</span>
                    <span className="text-slate-900">
                      {(userPoints - activeModalVoucher.pointsCost).toLocaleString("id-ID")} Pts
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleRedeem(activeModalVoucher)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    Ya, Tukar Sekarang
                  </button>
                  <button
                    onClick={() => setActiveModalVoucher(null)}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Voucher Code Generated
              <div className="space-y-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900">
                    Voucher Berhasil Diklaim!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gunakan kode voucher di bawah ini untuk transaksi di {activeModalVoucher.merchant}.
                  </p>
                </div>

                {/* Code display with copy button */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <span className="font-mono text-base font-black text-emerald-950 tracking-wider">
                    {redeemedCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    title="Salin Kode"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {copied && (
                  <p className="text-xs font-bold text-emerald-700 animate-in fade-in">
                    ✓ Kode voucher berhasil disalin ke clipboard!
                  </p>
                )}

                <button
                  onClick={() => {
                    setActiveModalVoucher(null);
                    setRedeemedCode(null);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Selesai & Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
