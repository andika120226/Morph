"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Upload,
  MapPin,
  Scale,
  Bike,
  Car,
  Truck,
  CheckCircle2,
  Coins,
  LocateFixed,
  CheckSquare,
  Square,
  Trash2,
  Leaf,
  Package,
  Cpu,
  Image as ImageIcon,
} from "lucide-react";
import LeafletMap from "@/components/LeafletMap";

export type WeightUnit = "g" | "ons" | "kg" | "kwintal" | "ton";

interface UnitConfig {
  id: WeightUnit;
  label: string;
  shortLabel: string;
  group: "Di Bawah Kg" | "Standar" | "Di Atas Kg";
  toKgFactor: number; // 1 unit = X kg
  min: number;
  max: number;
  step: number;
  defaultVal: number;
}

const WEIGHT_UNITS: Record<WeightUnit, UnitConfig> = {
  g: {
    id: "g",
    label: "Gram (g)",
    shortLabel: "g",
    group: "Di Bawah Kg",
    toKgFactor: 0.001, // 1.000 g = 1 kg
    min: 50,
    max: 5000,
    step: 50,
    defaultVal: 500,
  },
  ons: {
    id: "ons",
    label: "Ons (100g)",
    shortLabel: "ons",
    group: "Di Bawah Kg",
    toKgFactor: 0.1, // 10 ons = 1 kg
    min: 1,
    max: 100,
    step: 1,
    defaultVal: 5,
  },
  kg: {
    id: "kg",
    label: "Kilogram (kg)",
    shortLabel: "kg",
    group: "Standar",
    toKgFactor: 1, // 1 kg = 1 kg
    min: 1,
    max: 200,
    step: 1,
    defaultVal: 15,
  },
  kwintal: {
    id: "kwintal",
    label: "Kwintal (100kg)",
    shortLabel: "kwintal",
    group: "Di Atas Kg",
    toKgFactor: 100, // 1 kwintal = 100 kg
    min: 0.5,
    max: 20,
    step: 0.5,
    defaultVal: 1,
  },
  ton: {
    id: "ton",
    label: "Ton (1.000kg)",
    shortLabel: "ton",
    group: "Di Atas Kg",
    toKgFactor: 1000, // 1 ton = 1.000 kg
    min: 0.5,
    max: 10,
    step: 0.5,
    defaultVal: 1,
  },
};

interface CategoryOption {
  id: string;
  label: string;
  desc: string;
  defaultAmount: number;
  defaultUnit: WeightUnit;
}

const WASTE_CATEGORIES: CategoryOption[] = [
  {
    id: "ORGANIC",
    label: "Sampah Organik",
    desc: "Sisa makanan, sayuran, daun kering, kompos rumah tangga",
    defaultAmount: 15,
    defaultUnit: "kg",
  },
  {
    id: "ANORGANIC",
    label: "Plastik & Anorganik",
    desc: "Botol plastik, kemasan, kaleng minuman, kaca",
    defaultAmount: 20,
    defaultUnit: "kg",
  },
  {
    id: "PAPER",
    label: "Kardus & Kertas",
    desc: "Kardus paket, koran, kertas arsip kantor, karton",
    defaultAmount: 15,
    defaultUnit: "kg",
  },
  {
    id: "EWASTE",
    label: "Elektronik & B3 Rumah Tangga",
    desc: "Baterai bekas, kabel, peralatan elektronik rusak",
    defaultAmount: 500,
    defaultUnit: "g",
  },
];

interface CategoryWeightEntry {
  amount: number;
  unit: WeightUnit;
}

export default function CleanupRequestPage() {
  // Multi-select state: map of categoryId -> { amount, unit }
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, CategoryWeightEntry>
  >({
    ORGANIC: { amount: 15, unit: "kg" },
    ANORGANIC: { amount: 20, unit: "kg" },
  });

  const [imageUrl, setImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: -5.3824,
    lng: 105.2586,
  });
  const [addressNote, setAddressNote] = useState<string>(
    "Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung"
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successReport, setSuccessReport] = useState<any | null>(null);

  // Convert any entry { amount, unit } to kilograms (kg)
  const convertToKg = (entry: CategoryWeightEntry): number => {
    const unitCfg = WEIGHT_UNITS[entry.unit] || WEIGHT_UNITS.kg;
    const rawKg = Number(entry.amount || 0) * unitCfg.toKgFactor;
    return Number(rawKg.toFixed(3));
  };

  // Format kg nicely (e.g. 0.5 kg -> "0.5 kg (500 g)", 1200 kg -> "1.200 kg (1.2 ton)")
  const formatTotalWeightDisplay = (kg: number): string => {
    if (kg < 1) {
      return `${kg} kg (${Math.round(kg * 1000)} g)`;
    }
    if (kg >= 1000) {
      return `${kg.toLocaleString("id-ID")} kg (${(kg / 1000).toFixed(2)} Ton)`;
    }
    if (kg >= 100) {
      return `${kg.toLocaleString("id-ID")} kg (${(kg / 100).toFixed(1)} Kwintal)`;
    }
    return `${kg} kg`;
  };

  // Toggle category selection (at least 1 category remains active)
  const toggleCategory = (cat: CategoryOption) => {
    setSelectedCategories((prev) => {
      const next = { ...prev };
      if (next[cat.id] !== undefined) {
        if (Object.keys(next).length <= 1) {
          return prev; // Keep at least 1 selected category
        }
        delete next[cat.id];
      } else {
        next[cat.id] = {
          amount: cat.defaultAmount,
          unit: cat.defaultUnit,
        };
      }
      return next;
    });
  };

  // Update individual category amount
  const updateCategoryAmount = (catId: string, newAmount: number) => {
    setSelectedCategories((prev) => {
      const current = prev[catId] || { amount: 1, unit: "kg" };
      const unitCfg = WEIGHT_UNITS[current.unit];
      const clamped = Math.max(
        0.1,
        Math.min(unitCfg.max * 2, Number(newAmount) || 0)
      );
      return {
        ...prev,
        [catId]: {
          ...current,
          amount: clamped,
        },
      };
    });
  };

  // Update individual category unit (g, ons, kg, kwintal, ton)
  const updateCategoryUnit = (catId: string, newUnit: WeightUnit) => {
    setSelectedCategories((prev) => {
      const unitCfg = WEIGHT_UNITS[newUnit];
      return {
        ...prev,
        [catId]: {
          amount: unitCfg.defaultVal,
          unit: newUnit,
        },
      };
    });
  };

  // Total combined weight in kg across all selected categories
  const totalWeight = Number(
    Object.values(selectedCategories)
      .reduce((acc, entry) => acc + convertToKg(entry), 0)
      .toFixed(2)
  );

  // Formatted multi-category label for backend & display
  const formattedCategoriesSummary = Object.entries(selectedCategories)
    .map(([id, entry]) => {
      const found = WASTE_CATEGORIES.find((c) => c.id === id);
      const unitCfg = WEIGHT_UNITS[entry.unit];
      const eqKg = convertToKg(entry);
      const eqInfo =
        entry.unit === "kg" ? `${entry.amount} kg` : `${entry.amount} ${unitCfg.shortLabel} (${eqKg} kg)`;
      return `${found ? found.label : id}: ${eqInfo}`;
    })
    .join(", ");

  const formattedCategoryCode = Object.entries(selectedCategories)
    .map(([id, entry]) => `${id}:${entry.amount}${entry.unit}`)
    .join(" + ");

  // Compute vehicle recommendation according to heuristic rule (in kg):
  // totalWeight < 30 kg -> MOTOR
  // 30 - 200 kg -> PICKUP
  // > 200 kg -> TRUCK
  const computeVehicleRec = (wKg: number) => {
    if (wKg < 30) return "MOTOR";
    if (wKg <= 200) return "PICKUP";
    return "TRUCK";
  };

  const vehicleRec = computeVehicleRec(totalWeight);
  const estimatedPoints = Math.max(1, Math.round(totalWeight * 10));

  // File upload handler (reads image as Data URL for preview & submission)
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const photoPresets = [
    {
      name: "Sampah Organik",
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Botol & Plastik",
      url: "https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Kardus & Kertas",
      url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleUseGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
          setAddressNote("Koordinat GPS terkini dari perangkat Anda");
        },
        () => {
          alert(
            "Tidak dapat mengakses GPS. Silakan klik atau geser pin pada peta."
          );
        }
      );
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    let currentUserId = "demo-user-1";
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("morph_user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed?.id) currentUserId = parsed.id;
        }
      } catch {
        // ignore parse error
      }
    }

    const payload = {
      userId: currentUserId,
      category: formattedCategoryCode,
      categoryBreakdown: selectedCategories,
      weight: Number(totalWeight),
      latitude: location.lat,
      longitude: location.lng,
      imageUrl,
      vehicleRec,
      addressNote,
    };

    try {
      const res = await fetch(`${apiUrl}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      const savedReport = {
        ...data,
        categoryBreakdown: selectedCategories,
        categoriesSummary: formattedCategoriesSummary,
      };
      setSuccessReport(savedReport);

      if (typeof window !== "undefined") {
        const prevHistory = JSON.parse(
          localStorage.getItem("morph_reports_history") || "[]"
        );
        localStorage.setItem(
          "morph_reports_history",
          JSON.stringify([savedReport, ...prevHistory])
        );
      }
    } catch {
      const simulatedReport = {
        id: "rep-" + Math.random().toString(36).substring(2, 9),
        ...payload,
        categoriesSummary: formattedCategoriesSummary,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        simulated: true,
      };
      setSuccessReport(simulatedReport);

      if (typeof window !== "undefined") {
        const prevHistory = JSON.parse(
          localStorage.getItem("morph_reports_history") || "[]"
        );
        localStorage.setItem(
          "morph_reports_history",
          JSON.stringify([simulatedReport, ...prevHistory])
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffffff] border border-emerald-200 text-[#16a34a] text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Form Lapor Penjemputan Multi-Kategori &amp; Multi-Satuan Berat</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lapor Sampah &amp; Panggil Armada MORPH
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Pilih kategori sampah dan atur berat menggunakan satuan di bawah Kg (<strong>Gram, Ons</strong>), standar (<strong>Kg</strong>), maupun di atas Kg (<strong>Kwintal, Ton</strong>).
          </p>
        </div>

        {/* Success Dialog Modal */}
        {successReport && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-200">
              <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] text-[#16a34a] border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  Laporan Berhasil Terkirim!
                </h3>
                <p className="text-sm text-slate-600">
                  Data laporan multi-kategori Anda telah tercatat di sistem MORPH. Armada terdekat segera meluncur ke titik jemput Anda.
                </p>
              </div>

              <div className="my-6 bg-[#f0fdf4] rounded-2xl p-4 border border-emerald-200 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID Laporan:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {successReport.id}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Rincian Kategori:</span>
                  <span className="font-bold text-[#16a34a] text-right">
                    {successReport.categoriesSummary || successReport.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Berat Konversi:</span>
                  <span className="font-extrabold text-slate-900">
                    {formatTotalWeightDisplay(Number(successReport.weight))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rekomendasi Armada AI:</span>
                  <span className="font-extrabold text-[#16a34a] uppercase">
                    {successReport.vehicleRec}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Poin Reward:</span>
                  <span className="font-extrabold text-amber-600">
                    +{Math.max(1, Math.round(Number(successReport.weight) * 10))} Poin MORPH
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/driver-map"
                  className="flex-1 py-3 rounded-xl bg-[#16a34a] hover:bg-green-700 text-[#ffffff] font-bold text-sm text-center shadow-md shadow-[#16a34a]/25"
                >
                  Pantau di Peta Driver
                </Link>
                <button
                  type="button"
                  onClick={() => setSuccessReport(null)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Multi-Category Selection + Multi-Unit Weight Controls + Photo */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Multi-Select Waste Categories & Multi-Unit Weight Sliders */}
              <div className="bg-[#ffffff] rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <label className="text-base font-extrabold text-slate-900 block">
                      1. Pilih Kategori &amp; Satuan Berat Sampah
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mendukung satuan di bawah Kg (<strong>Gram, Ons</strong>), <strong>Kilogram</strong>, hingga di atas Kg (<strong>Kwintal, Ton</strong>)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] text-xs font-extrabold">
                    {Object.keys(selectedCategories).length} Kategori Dipilih
                  </span>
                </div>

                {/* Info Bar Konversi Satuan */}
                <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-[#f0fdf4] border border-emerald-200 text-[11px] text-center font-semibold text-slate-700">
                  <div className="bg-white rounded-lg py-1 px-1.5 border border-emerald-100">
                    <span className="block text-[9px] uppercase text-slate-400 font-bold">Di Bawah Kg</span>
                    <span className="text-[#16a34a] font-bold">Gram (g)</span>
                  </div>
                  <div className="bg-white rounded-lg py-1 px-1.5 border border-emerald-100">
                    <span className="block text-[9px] uppercase text-slate-400 font-bold">Di Bawah Kg</span>
                    <span className="text-[#16a34a] font-bold">Ons (100g)</span>
                  </div>
                  <div className="bg-[#16a34a] text-white rounded-lg py-1 px-1.5">
                    <span className="block text-[9px] uppercase text-emerald-100 font-bold">Standar</span>
                    <span className="font-extrabold">Kilogram (kg)</span>
                  </div>
                  <div className="bg-white rounded-lg py-1 px-1.5 border border-emerald-100">
                    <span className="block text-[9px] uppercase text-slate-400 font-bold">Di Atas Kg</span>
                    <span className="text-[#16a34a] font-bold">Kwintal (100kg)</span>
                  </div>
                  <div className="bg-white rounded-lg py-1 px-1.5 border border-emerald-100">
                    <span className="block text-[9px] uppercase text-slate-400 font-bold">Di Atas Kg</span>
                    <span className="text-[#16a34a] font-bold">Ton (1000kg)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {WASTE_CATEGORIES.map((item) => {
                    const entry = selectedCategories[item.id];
                    const isChecked = entry !== undefined;
                    const currentAmount = entry?.amount ?? item.defaultAmount;
                    const currentUnit: WeightUnit = entry?.unit ?? item.defaultUnit;
                    const unitCfg = WEIGHT_UNITS[currentUnit];
                    const convertedKg = isChecked ? convertToKg(entry) : 0;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isChecked
                            ? "border-[#16a34a] bg-[#f0fdf4]/70 shadow-2xs"
                            : "border-slate-200 bg-white hover:border-emerald-200"
                        }`}
                      >
                        <div
                          onClick={() => toggleCategory(item)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-[#16a34a]">
                              {isChecked ? (
                                <CheckSquare className="w-5 h-5 fill-[#16a34a] text-white" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">
                                  {item.label}
                                </span>
                                {item.id === "ORGANIC" && (
                                  <Leaf className="w-3.5 h-3.5 text-[#16a34a]" />
                                )}
                                {item.id === "ANORGANIC" && (
                                  <Trash2 className="w-3.5 h-3.5 text-teal-600" />
                                )}
                                {item.id === "PAPER" && (
                                  <Package className="w-3.5 h-3.5 text-amber-600" />
                                )}
                                {item.id === "EWASTE" && (
                                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          {/* Number Input + Unit Dropdown Selector */}
                          {isChecked && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 bg-[#ffffff] px-2.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs shrink-0 self-end sm:self-auto"
                            >
                              <input
                                type="number"
                                min={0.1}
                                step={unitCfg.step}
                                value={currentAmount}
                                onChange={(e) =>
                                  updateCategoryAmount(
                                    item.id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 text-right font-mono font-extrabold text-sm text-[#16a34a] focus:outline-none"
                              />
                              <select
                                value={currentUnit}
                                onChange={(e) =>
                                  updateCategoryUnit(
                                    item.id,
                                    e.target.value as WeightUnit
                                  )
                                }
                                aria-label={`Pilih satuan berat untuk ${item.label}`}
                                className="text-xs font-extrabold text-slate-800 bg-[#f0fdf4] border border-emerald-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#16a34a] cursor-pointer"
                              >
                                <optgroup label="Di Bawah Kg">
                                  <option value="g">g (Gram)</option>
                                  <option value="ons">ons (Ons)</option>
                                </optgroup>
                                <optgroup label="Satuan Standar">
                                  <option value="kg">kg (Kilogram)</option>
                                </optgroup>
                                <optgroup label="Di Atas Kg">
                                  <option value="kwintal">kwintal (100 kg)</option>
                                  <option value="ton">ton (1.000 kg)</option>
                                </optgroup>
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Individual Category Unit Buttons & Weight Slider when checked */}
                        {isChecked && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 pt-3 border-t border-emerald-200/60 space-y-2.5"
                          >
                            {/* Quick Unit Switcher Pills (Di Bawah Kg / Kg / Di Atas Kg) */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-slate-600">
                                Pilih Satuan ({unitCfg.group}):
                              </span>
                              <div className="flex flex-wrap items-center gap-1">
                                {(Object.keys(WEIGHT_UNITS) as WeightUnit[]).map(
                                  (uKey) => {
                                    const u = WEIGHT_UNITS[uKey];
                                    const active = currentUnit === uKey;
                                    return (
                                      <button
                                        key={uKey}
                                        type="button"
                                        onClick={() =>
                                          updateCategoryUnit(item.id, uKey)
                                        }
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                          active
                                            ? "bg-[#16a34a] text-white shadow-2xs"
                                            : "bg-white text-slate-600 border border-emerald-200 hover:bg-emerald-50"
                                        }`}
                                      >
                                        {u.shortLabel}
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                            </div>

                            {/* Weight Slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                                <span>
                                  Atur Jumlah ({unitCfg.label}):{" "}
                                  <strong className="text-slate-900">
                                    {currentAmount} {unitCfg.shortLabel}
                                  </strong>
                                </span>
                                <span className="text-[#16a34a] font-bold">
                                  Setara {convertedKg} kg (+
                                  {Math.max(1, Math.round(convertedKg * 10))}{" "}
                                  Poin)
                                </span>
                              </div>
                              <input
                                type="range"
                                min={unitCfg.min}
                                max={unitCfg.max}
                                step={unitCfg.step}
                                value={Math.min(unitCfg.max, currentAmount)}
                                onChange={(e) =>
                                  updateCategoryAmount(
                                    item.id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-[#16a34a]"
                              />
                              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                                <span>
                                  {unitCfg.min} {unitCfg.shortLabel}
                                </span>
                                <span>
                                  {unitCfg.max / 2} {unitCfg.shortLabel}
                                </span>
                                <span>
                                  {unitCfg.max} {unitCfg.shortLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Total Combined Weight & Automatic AI Fleet Recommendation */}
                <div className="mt-4 p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#16a34a] text-[#ffffff] flex items-center justify-center shadow-sm shrink-0">
                      {vehicleRec === "MOTOR" && <Bike className="w-6 h-6" />}
                      {vehicleRec === "PICKUP" && <Car className="w-6 h-6" />}
                      {vehicleRec === "TRUCK" && <Truck className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#16a34a]">
                        Rekomendasi Armada AI ({formatTotalWeightDisplay(totalWeight)})
                      </span>
                      <h4 className="font-black text-slate-900 text-sm">
                        {vehicleRec === "MOTOR" &&
                          "Armada Motor Listrik (< 30 kg)"}
                        {vehicleRec === "PICKUP" &&
                          "Armada Mobil Pickup Eco (30 - 200 kg)"}
                        {vehicleRec === "TRUCK" &&
                          "Armada Truk Hidrolik Besar (> 200 kg / Kwintal / Ton)"}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {formattedCategoriesSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                    <span className="px-3 py-1 rounded-xl bg-[#16a34a] text-[#ffffff] font-black text-xs uppercase tracking-wider">
                      {vehicleRec}
                    </span>
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      {formatTotalWeightDisplay(totalWeight)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Upload Foto Sampah */}
              <div className="bg-[#ffffff] rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-base font-extrabold text-slate-900 block">
                      2. Unggah Foto Tumpukan Sampah
                    </label>
                    <p className="text-xs text-slate-500">
                      Unggah foto langsung dari perangkat Anda atau gunakan URL gambar
                    </p>
                  </div>
                  <ImageIcon className="w-5 h-5 text-[#16a34a]" />
                </div>

                {/* File Upload Dropzone */}
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-emerald-300 rounded-2xl bg-[#f0fdf4]/60 hover:bg-[#f0fdf4] transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-[#16a34a] mb-1.5" />
                  <span className="text-xs font-bold text-slate-800">
                    {uploadedFileName
                      ? `File terpilih: ${uploadedFileName}`
                      : "Klik untuk unggah foto dari Kamera / Galeri"}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Format JPG, PNG, atau WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Or URL Input + Quick Presets */}
                <div className="space-y-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setUploadedFileName(null);
                    }}
                    placeholder="Atau tempel URL foto sampah..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">
                      Contoh foto cepat:
                    </span>
                    {photoPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setUploadedFileName(null);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                          imageUrl === preset.url
                            ? "bg-[#f0fdf4] text-[#16a34a] border-[#16a34a]"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Preview */}
                {imageUrl && (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-emerald-200">
                    <img
                      src={imageUrl}
                      alt="Preview Foto Sampah"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-black/65 text-white text-[11px] font-bold">
                      Preview Foto Laporan
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Location Picker & Submit */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-base font-extrabold text-slate-900 block">
                      3. Peta Interaktif Titik Jemput
                    </label>
                    <p className="text-xs text-slate-500">
                      Klik peta atau geser pin untuk menentukan lokasi akurat
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseGPS}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <LocateFixed className="w-3.5 h-3.5" />
                    <span>Titik GPS</span>
                  </button>
                </div>

                {/* Interactive Map Picker */}
                <div className="w-full h-72 rounded-2xl overflow-hidden">
                  <LeafletMap
                    center={[location.lat, location.lng]}
                    zoom={15}
                    selectedLocation={location}
                    interactivePicker={true}
                    onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
                    height="100%"
                  />
                </div>

                {/* Coordinate Readout */}
                <div className="p-3 rounded-xl bg-[#f0fdf4] border border-emerald-200 text-xs font-mono text-slate-700 flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-bold text-[#16a34a]">
                    <MapPin className="w-4 h-4" />
                    Koordinat Jemput:
                  </span>
                  <span>
                    {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                  </span>
                </div>

                {/* Detail Patokan Alamat */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Detail Alamat / Patokan Lokasi Driver:
                  </label>
                  <textarea
                    rows={2}
                    value={addressNote}
                    onChange={(e) => setAddressNote(e.target.value)}
                    placeholder="Contoh: Rumah pagar hijau nomor 12, seberang minimarket..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>
              </div>

              {/* Summary & Submit Card */}
              <div className="bg-[#ffffff] rounded-2xl p-6 border-2 border-[#16a34a] shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block">
                      Total Berat ({Object.keys(selectedCategories).length}{" "}
                      Kategori)
                    </span>
                    <span className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                      <Scale className="w-5 h-5 text-[#16a34a]" />
                      {formatTotalWeightDisplay(totalWeight)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 block">
                      Perolehan Poin
                    </span>
                    <span className="text-xl font-black text-[#16a34a] flex items-center justify-end gap-1">
                      <Coins className="w-5 h-5 text-amber-500 fill-amber-400" />
                      +{estimatedPoints} Poin
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#16a34a] hover:bg-green-700 text-[#ffffff] font-black text-sm tracking-wide shadow-md shadow-[#16a34a]/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting
                    ? "Mengirim Laporan ke Server..."
                    : "Kirim Laporan & Panggil Armada"}
                </button>

                <p className="text-[11px] text-slate-500 text-center">
                  Terhubung langsung ke REST API Backend NestJS (
                  <code className="text-[#16a34a] font-bold">POST /reports</code>
                  )
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
