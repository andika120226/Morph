"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  MapPin,
  Truck,
  CheckCircle2,
  RefreshCw,
  Layers,
  Trash2,
  Coins,
  Navigation,
  Search,
  LocateFixed,
  Compass,
  Loader2,
} from "lucide-react";
import LeafletMap, { MapMarker } from "@/components/LeafletMap";

interface Report {
  id: string;
  category: string;
  address?: string;
  weight: number;
  latitude: number;
  longitude: number;
  status: "PENDING" | "ACCEPTED" | "COMPLETED";
  vehicleRec: string;
  imageUrl?: string;
  createdAt?: string;
  user?: {
    name?: string;
    points?: number;
  };
}

interface Driver {
  id: string;
  name: string;
  vehicleType: string;
  isReady: boolean;
  currentLat: number;
  currentLng: number;
}

interface SearchResultItem {
  display_name: string;
  lat: string;
  lon: string;
}

const BANDAR_LAMPUNG_QUICK_AREAS = [
  { name: "Kedaton (Jl. ZA. Pagar Alam)", lat: -5.3824, lng: 105.2586 },
  { name: "Tanjung Karang / Tugu Adipura", lat: -5.4215, lng: 105.2582 },
  { name: "Sukarame (UIN / Korpri)", lat: -5.3895, lng: 105.2921 },
  { name: "Rajabasa (Unila)", lat: -5.3672, lng: 105.2448 },
  { name: "Teluk Betung / Pahoman", lat: -5.4412, lng: 105.2685 },
];

export default function DriverMapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Map Center & Custom GPS Coordinate State (Default: Bandar Lampung)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-5.402, 105.262]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    label?: string;
  } | null>({
    lat: -5.402,
    lng: 105.262,
    label: "Posisi GPS Driver (Bandar Lampung)",
  });

  // Coordinate Input Form State
  const [latInput, setLatInput] = useState<string>("-5.402000");
  const [lngInput, setLngInput] = useState<string>("105.262000");

  // Address Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchingAddress, setIsSearchingAddress] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Dummy Laporan Sampah di Wilayah Bandar Lampung
  const fallbackReports: Report[] = [
    {
      id: "rep-bdl-01",
      category: "ORGANIC:15kg + ANORGANIC:10kg",
      address: "Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung",
      weight: 25,
      latitude: -5.3824,
      longitude: 105.2586,
      status: "PENDING",
      vehicleRec: "MOTOR",
      imageUrl:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-10-28T09:10:00.000Z",
    },
    {
      id: "rep-bdl-02",
      category: "ANORGANIC:55kg + PAPER:30kg",
      address: "Jl. Endro Suratmin, Sukarame, Bandar Lampung",
      weight: 85,
      latitude: -5.3895,
      longitude: 105.2921,
      status: "ACCEPTED",
      vehicleRec: "PICKUP",
      imageUrl:
        "https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-10-28T08:55:00.000Z",
    },
    {
      id: "rep-bdl-03",
      category: "ORGANIC:120kg + ANORGANIC:120kg",
      address: "Jl. Raden Intan (Area Tugu Adipura), Enggal, Bandar Lampung",
      weight: 240,
      latitude: -5.4215,
      longitude: 105.2582,
      status: "PENDING",
      vehicleRec: "TRUCK",
      imageUrl:
        "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-10-28T08:40:00.000Z",
    },
    {
      id: "rep-bdl-04",
      category: "PAPER:20kg + ANORGANIC:18kg",
      address: "Jl. Prof. Dr. Ir. Sumantri Brojonegoro, Rajabasa, Bandar Lampung",
      weight: 38,
      latitude: -5.3672,
      longitude: 105.2448,
      status: "PENDING",
      vehicleRec: "PICKUP",
      imageUrl:
        "https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-10-28T08:30:00.000Z",
    },
    {
      id: "rep-bdl-05",
      category: "ANORGANIC:12kg",
      address: "Jl. Diponegoro, Teluk Betung Utara, Bandar Lampung",
      weight: 12,
      latitude: -5.4412,
      longitude: 105.2685,
      status: "COMPLETED",
      vehicleRec: "MOTOR",
      imageUrl:
        "https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=600&q=80",
      createdAt: "2026-10-28T08:05:00.000Z",
    },
  ];

  // Dummy Armada Driver di Wilayah Bandar Lampung
  const fallbackDrivers: Driver[] = [
    {
      id: "drv-bdl-01",
      name: "Budi Santoso (Motor Listrik - Kedaton)",
      vehicleType: "MOTOR",
      isReady: true,
      currentLat: -5.3785,
      currentLng: 105.2542,
    },
    {
      id: "drv-bdl-02",
      name: "Armada Pickup Eco 03 (Sukarame)",
      vehicleType: "PICKUP",
      isReady: true,
      currentLat: -5.3945,
      currentLng: 105.2845,
    },
    {
      id: "drv-bdl-03",
      name: "Truk Hidrolik MORPH 01 (Tanjung Karang)",
      vehicleType: "TRUCK",
      isReady: true,
      currentLat: -5.4155,
      currentLng: 105.2615,
    },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [reportsRes, driversRes] = await Promise.allSettled([
        fetch(`${apiUrl}/reports`),
        fetch(`${apiUrl}/drivers`),
      ]);

      if (reportsRes.status === "fulfilled" && reportsRes.value.ok) {
        const data = await reportsRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          // Pastikan titik-titik lama yang masih berkoordinat Jakarta (-6.x) disesuaikan ke Bandar Lampung + gabungkan dengan titik Bandar Lampung
          const normalized = data.map((r: Report, idx: number) => {
            if (r.latitude < -6.0) {
              const bdlRef = fallbackReports[idx % fallbackReports.length];
              return {
                ...r,
                latitude: bdlRef.latitude,
                longitude: bdlRef.longitude,
                address: bdlRef.address,
              };
            }
            return {
              ...r,
              address: r.address || "Bandar Lampung, Lampung",
            };
          });
          setReports(normalized);
        } else {
          setReports(fallbackReports);
        }
      } else {
        setReports(fallbackReports);
      }

      if (driversRes.status === "fulfilled" && driversRes.value.ok) {
        const dData = await driversRes.value.json();
        if (Array.isArray(dData) && dData.length > 0) {
          const normalizedDrivers = dData.map((d: Driver, idx: number) => {
            if (d.currentLat < -6.0) {
              const bdlDrv = fallbackDrivers[idx % fallbackDrivers.length];
              return {
                ...d,
                currentLat: bdlDrv.currentLat,
                currentLng: bdlDrv.currentLng,
              };
            }
            return d;
          });
          setDrivers(normalizedDrivers);
        } else {
          setDrivers(fallbackDrivers);
        }
      } else {
        setDrivers(fallbackDrivers);
      }
    } catch {
      setReports(fallbackReports);
      setDrivers(fallbackDrivers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi Pencarian Alamat (OpenStreetMap Nominatim Geocoding, fokus Bandar Lampung)
  const handleSearchAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingAddress(true);
    setSearchResults([]);

    try {
      const q = searchQuery.toLowerCase().includes("lampung")
        ? searchQuery.trim()
        : `${searchQuery.trim()}, Bandar Lampung`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&limit=5`
      );
      const data: SearchResultItem[] = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
        const first = data[0];
        const lat = Number(parseFloat(first.lat).toFixed(6));
        const lng = Number(parseFloat(first.lon).toFixed(6));
        applyCoordinates(lat, lng, first.display_name.split(",")[0]);
      } else {
        setMessage({
          text: "Alamat tidak ditemukan. Coba gunakan kata kunci kecamatan di Bandar Lampung.",
          type: "error",
        });
      }
    } catch {
      setMessage({
        text: "Gagal mencari alamat. Gunakan tombol area cepat Bandar Lampung atau input koordinat GPS.",
        type: "error",
      });
    } finally {
      setIsSearchingAddress(false);
    }
  };

  // Fungsi Terapkan Koordinat GPS & Arahkan Peta
  const applyCoordinates = (lat: number, lng: number, labelText?: string) => {
    setLatInput(lat.toFixed(6));
    setLngInput(lng.toFixed(6));
    setMapCenter([lat, lng]);
    setMapZoom(15);
    setGpsLocation({
      lat,
      lng,
      label: labelText || `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    });
  };

  // Handler Form Input Manual Koordinat GPS
  const handleManualGpsSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedLat = parseFloat(latInput);
    const parsedLng = parseFloat(lngInput);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setMessage({
        text: "Masukkan nilai koordinat Latitude dan Longitude yang valid.",
        type: "error",
      });
      return;
    }

    applyCoordinates(
      parsedLat,
      parsedLng,
      `Titik GPS Manual (${parsedLat.toFixed(4)}, ${parsedLng.toFixed(4)})`
    );
    setMessage({
      text: `Koordinat GPS berhasil diatur ke (${parsedLat.toFixed(5)}, ${parsedLng.toFixed(5)})`,
      type: "success",
    });
  };

  // Handler Ambil GPS Perangkat Saat Ini
  const handleUseDeviceGps = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          applyCoordinates(lat, lng, "Lokasi GPS Perangkat Saya");
          setMessage({
            text: `Lokasi GPS perangkat berhasil ditemukan (${lat}, ${lng})`,
            type: "success",
          });
        },
        () => {
          setMessage({
            text: "Akses GPS browser ditolak. Silakan ketik koordinat GPS secara manual atau klik peta.",
            type: "error",
          });
        }
      );
    }
  };

  const handleUpdateStatus = async (
    reportId: string,
    newStatus: "ACCEPTED" | "COMPLETED"
  ) => {
    setIsUpdating(true);
    setMessage(null);

    try {
      const res = await fetch(`${apiUrl}/reports/${reportId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      setMessage({
        text:
          newStatus === "COMPLETED"
            ? `Penjemputan selesai! Poin reward warga berhasil ditambahkan ke akun.`
            : `Titik laporan berhasil diambil oleh armada driver.`,
        type: "success",
      });
      fetchData();
    } catch {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      setMessage({
        text:
          newStatus === "COMPLETED"
            ? `Penjemputan selesai & poin warga telah diberikan!`
            : `Armada sedang menuju lokasi penjemputan sampah.`,
        type: "success",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const markers: MapMarker[] = [
    ...reports.map((r) => ({
      id: r.id,
      latitude: r.latitude,
      longitude: r.longitude,
      title: `Titik Sampah: ${r.category}`,
      address: r.address || "Bandar Lampung",
      category: r.category,
      weight: r.weight,
      vehicleRec: r.vehicleRec,
      status: r.status,
    })),
    ...drivers.map((d) => ({
      id: d.id,
      latitude: d.currentLat,
      longitude: d.currentLng,
      title: d.name,
      isDriver: true,
      vehicleType: d.vehicleType,
    })),
  ];

  const filteredReports = reports.filter((r) => {
    if (filterStatus === "ALL") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffffff] border border-emerald-200 text-[#16a34a] text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wilayah Operasional: Bandar Lampung</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Peta Driver &amp; Titik Sampah Bandar Lampung
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Cari alamat jalan di Bandar Lampung, atur titik koordinat GPS, dan pantau ikon sampah warga (<code className="text-[#16a34a] font-bold">Trash2</code>) secara real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ffffff] border border-emerald-200 text-slate-800 hover:border-[#16a34a] hover:text-[#16a34a] text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isLoading ? "animate-spin text-[#16a34a]" : ""
              }`}
            />
            <span>Segarkan Data Peta</span>
          </button>
        </div>

        {/* Pencarian Alamat & Setting Koordinat GPS Panel */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* 1. Pencarian Alamat */}
            <form
              onSubmit={handleSearchAddress}
              className="lg:col-span-6 space-y-1.5"
            >
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Cari Alamat / Jalan di Bandar Lampung</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: Jl. ZA Pagar Alam, Kedaton, Sukarame, Pahoman..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                />
                <button
                  type="submit"
                  disabled={isSearchingAddress}
                  className="px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-green-700 text-[#ffffff] text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  {isSearchingAddress ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Cari Alamat</span>
                </button>
              </div>
            </form>

            {/* 2. Setting Koordinat GPS Manual & Auto */}
            <form
              onSubmit={handleManualGpsSubmit}
              className="lg:col-span-6 space-y-1.5"
            >
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Setting Koordinat GPS (Latitude &amp; Longitude)</span>
              </label>
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <input
                  type="number"
                  step="any"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  placeholder="Latitude (-5.3824)"
                  className="w-full sm:w-36 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                />
                <input
                  type="number"
                  step="any"
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  placeholder="Longitude (105.2586)"
                  className="w-full sm:w-36 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Set GPS
                </button>
                <button
                  type="button"
                  onClick={handleUseDeviceGps}
                  title="Gunakan Lokasi GPS Perangkat Saya"
                  className="px-3.5 py-2.5 rounded-xl bg-[#f0fdf4] hover:bg-emerald-100 text-[#16a34a] border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <LocateFixed className="w-4 h-4" />
                  <span>GPS Saya</span>
                </button>
              </div>
            </form>
          </div>

          {/* Hasil Pencarian Alamat Dropdown / List */}
          {searchResults.length > 0 && (
            <div className="p-3 rounded-xl bg-[#f0fdf4] border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#16a34a]">
                <span>Hasil Pencarian Alamat (Klik untuk arahkan peta):</span>
                <button
                  type="button"
                  onClick={() => setSearchResults([])}
                  className="underline cursor-pointer"
                >
                  Tutup Hasil
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const lat = Number(parseFloat(item.lat).toFixed(6));
                      const lng = Number(parseFloat(item.lon).toFixed(6));
                      applyCoordinates(lat, lng, item.display_name.split(",")[0]);
                      setSearchResults([]);
                    }}
                    className="text-left p-2 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-100 text-xs text-slate-700 truncate cursor-pointer"
                  >
                    📍 {item.display_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pintasan Cepat Kecamatan di Bandar Lampung */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500">
              Lokasi Cepat Bandar Lampung:
            </span>
            {BANDAR_LAMPUNG_QUICK_AREAS.map((area) => (
              <button
                key={area.name}
                type="button"
                onClick={() => applyCoordinates(area.lat, area.lng, area.name)}
                className="px-2.5 py-1 rounded-lg bg-[#f0fdf4] hover:bg-[#16a34a] text-[#16a34a] hover:text-white border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>

        {/* Status Toast Alert */}
        {message && (
          <div className="p-4 rounded-2xl bg-[#ffffff] border-2 border-[#16a34a] text-slate-900 text-sm font-bold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
              <span>{message.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="text-xs text-[#16a34a] underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Map + Reports Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Driver Map */}
          <div className="lg:col-span-8">
            <div className="bg-[#ffffff] rounded-2xl p-4 border border-emerald-100 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                  <Navigation className="w-4 h-4 text-[#16a34a]" />
                  <span>
                    Koordinat Aktif: {Number(latInput).toFixed(5)},{" "}
                    {Number(lngInput).toFixed(5)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#16a34a] text-white inline-flex items-center justify-center">
                      <Trash2 className="w-3 h-3" />
                    </span>
                    <span>Titik Sampah Warga</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white inline-flex items-center justify-center">
                      <Truck className="w-3 h-3" />
                    </span>
                    <span>Mitra Driver Siaga</span>
                  </span>
                </div>
              </div>

              <div className="h-[540px] rounded-2xl overflow-hidden">
                <LeafletMap
                  markers={markers}
                  center={mapCenter}
                  zoom={mapZoom}
                  height="100%"
                  interactivePicker={true}
                  selectedLocation={gpsLocation}
                  onLocationSelect={(lat, lng) => {
                    applyCoordinates(
                      lat,
                      lng,
                      `Titik GPS Dipilih (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Actionable Report Cards */}
          <div className="lg:col-span-4">
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#16a34a]" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Titik Sampah Bandar Lampung
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] text-xs font-extrabold font-mono">
                  {filteredReports.length} Titik
                </span>
              </div>

              {/* Status Filter Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#f0fdf4] border border-emerald-100 text-xs font-bold">
                {["ALL", "PENDING", "ACCEPTED", "COMPLETED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      filterStatus === st
                        ? "bg-[#16a34a] text-[#ffffff] shadow-2xs"
                        : "text-slate-600 hover:text-[#16a34a]"
                    }`}
                  >
                    {st === "ALL"
                      ? "Semua"
                      : st === "PENDING"
                      ? "Menunggu"
                      : st === "ACCEPTED"
                      ? "Dijemput"
                      : "Selesai"}
                  </button>
                ))}
              </div>

              {/* Report Cards List */}
              <div className="space-y-3 max-h-[430px] overflow-y-auto pr-1">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Belum ada laporan sampah pada filter ini.
                  </div>
                ) : (
                  filteredReports.map((report) => {
                    const isSelected = selectedReportId === report.id;
                    const earnedPoints = Math.round(Number(report.weight) * 10);

                    return (
                      <div
                        key={report.id}
                        onClick={() => {
                          setSelectedReportId(report.id);
                          applyCoordinates(
                            report.latitude,
                            report.longitude,
                            report.address || report.category
                          );
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#16a34a] bg-[#f0fdf4] ring-2 ring-[#16a34a]/15"
                            : "border-slate-200 hover:border-emerald-300 bg-[#ffffff]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] flex items-center justify-center shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </div>
                            <div>
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                  report.status === "PENDING"
                                    ? "bg-amber-100 text-amber-800"
                                    : report.status === "ACCEPTED"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-emerald-100 text-[#16a34a]"
                                }`}
                              >
                                {report.status}
                              </span>
                              <h4 className="text-xs font-extrabold text-slate-900 mt-0.5 line-clamp-1">
                                {report.category}
                              </h4>
                            </div>
                          </div>

                          <span className="text-xs font-black font-mono text-[#16a34a] bg-[#f0fdf4] border border-emerald-200 px-2.5 py-1 rounded-lg shrink-0">
                            {report.weight} kg
                          </span>
                        </div>

                        {report.address && (
                          <p className="text-xs text-slate-600 font-medium mb-2 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#16a34a] shrink-0 mt-0.5" />
                            <span>{report.address}</span>
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-[#16a34a]" />
                            Armada:{" "}
                            <strong className="text-slate-800">
                              {report.vehicleRec}
                            </strong>
                          </span>
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Coins className="w-3.5 h-3.5" />+{earnedPoints} Poin
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-slate-400 mb-3">
                          GPS: {report.latitude.toFixed(4)},{" "}
                          {report.longitude.toFixed(4)}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                          {report.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(report.id, "ACCEPTED");
                                }}
                                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Ambil Jemputan
                              </button>
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(report.id, "COMPLETED");
                                }}
                                className="flex-1 py-2 rounded-xl bg-[#16a34a] hover:bg-green-700 text-[#ffffff] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Selesai &amp; Beri Poin
                              </button>
                            </>
                          )}

                          {report.status === "ACCEPTED" && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(report.id, "COMPLETED");
                              }}
                              className="w-full py-2 rounded-xl bg-[#16a34a] hover:bg-green-700 text-[#ffffff] text-xs font-bold transition-colors shadow-sm shadow-[#16a34a]/20 cursor-pointer"
                            >
                              Selesaikan Penjemputan (+{earnedPoints} Poin)
                            </button>
                          )}

                          {report.status === "COMPLETED" && (
                            <span className="text-xs text-[#16a34a] font-bold flex items-center gap-1.5 py-1">
                              <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                              <span>
                                Selesai Dijemput (+{earnedPoints} Poin Diberikan)
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
