"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Wrench,
  Waves,
  AlertTriangle,
  Send,
  FileSearch,
  ClipboardCheck,
  HardHat,
  CheckSquare,
  Square,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";

interface HeavyEquipmentOption {
  id: string;
  name: string;
  spec: string;
  useCase: string;
}

const HEAVY_EQUIPMENT_LIST: HeavyEquipmentOption[] = [
  {
    id: "EXCAVATOR",
    name: "Ekskavator (Standard / Long-Arm / Amfibi)",
    spec: "Kapasitas keruk 1.5 - 5 Ton/jam",
    useCase: "Pengerukan sampah padat & sedimen di badan sungai atau tebing",
  },
  {
    id: "PONTOON_BOAT",
    name: "Perahu Ponton & Trash Skimmer",
    spec: "Armada apung penyaring sampah sungai",
    useCase: "Pengangkatan sampah plastik terapung di tengah aliran sungai",
  },
  {
    id: "DUMP_TRUCK",
    name: "Armada Dump Truck Hidrolik & Arm Roll",
    spec: "Kapasitas angkut 8 - 15 Ton per ritase",
    useCase: "Evakuasi hasil kerukan ekskavator menuju fasilitas pengolahan akhir",
  },
  {
    id: "WHEEL_LOADER",
    name: "Wheel Loader / Mini Bulldozer",
    spec: "Pendorong & pemuat tumpukan sampah liar",
    useCase: "Pembersihan lahan terbuka atau TPS liar berskala luas",
  },
  {
    id: "TRASH_BOOM",
    name: "Jaring Penahan Sampah (Trash Boom) & Tim Satgas",
    spec: "Instalasi barikade sungai + 15 personel lapangan",
    useCase: "Menahan laju kiriman sampah di hilir sungai sebelum diangkut",
  },
];

interface SpecialRequestTicket {
  id: string;
  requesterName: string;
  organization: string;
  contactPhone: string;
  projectTitle: string;
  projectType: string;
  locationAddress: string;
  estimatedVolume: string;
  requestedEquipment: string[];
  urgency: "NORMAL" | "TINGGI" | "DARURAT_BANJIR";
  description: string;
  status: "MENUNGGU_ANALISIS_ADMIN" | "SURVEI_DAN_PERENCANAAN_ALAT" | "DISETUJUI_SIAP_TERJUN";
  adminAnalysisNote: string;
  createdAt: string;
}

export default function ContactPage() {
  const [requesterName, setRequesterName] = useState("Andika Pratama");
  const [organization, setOrganization] = useState("Komunitas Peduli Sungai Bandar Lampung");
  const [contactPhone, setContactPhone] = useState("+62 812-8890-4521");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectType, setProjectType] = useState("PEMBERSIHAN_SUNGAI");
  const [locationAddress, setLocationAddress] = useState("");
  const [estimatedVolume, setEstimatedVolume] = useState("± 15 Ton (Sepanjang 200 Meter Aliran Sungai)");
  const [urgency, setUrgency] = useState<"NORMAL" | "TINGGI" | "DARURAT_BANJIR">("TINGGI");
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([
    "EXCAVATOR",
    "DUMP_TRUCK",
  ]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SpecialRequestTicket | null>(null);

  const [tickets, setTickets] = useState<SpecialRequestTicket[]>([
    {
      id: "OPS-BDL-901",
      requesterName: "Bpk. Hendra Wijaya (RT 04 / Kelurahan Way Halim)",
      organization: "Warga & Pokmas Way Halim",
      contactPhone: "+62 813-7721-9012",
      projectTitle: "Pembersihan Tumpukan Sampah & Sedimentasi Sungai Way Halim",
      projectType: "PEMBERSIHAN_SUNGAI",
      locationAddress: "Aliran Sungai Way Halim Sektor Jembatan Merah, Bandar Lampung",
      estimatedVolume: "± 25 Ton (Menyumbat Aliran Air)",
      requestedEquipment: [
        "Ekskavator (Standard / Long-Arm / Amfibi)",
        "Armada Dump Truck Hidrolik & Arm Roll",
        "Jaring Penahan Sampah (Trash Boom) & Tim Satgas",
      ],
      urgency: "DARURAT_BANJIR",
      description:
        "Terdapat tumpukan sampah bambu, plastik, dan lumpur tebal di bawah jembatan yang menghambat aliran sungai dan rawan meluap saat hujan deras. Membutuhkan ekskavator untuk mengeruk dari bibir sungai.",
      status: "SURVEI_DAN_PERENCANAAN_ALAT",
      adminAnalysisNote:
        "Tim Engineer Admin MORPH telah mengecek lokasi. Akses jalan lebar 4,5 meter memadai untuk mobilisasi 1 unit Ekskavator Long-Arm dan 2 Dump Truck Hidrolik. Dijadwalkan pengerukan pada hari Sabtu pagi.",
      createdAt: "27 Okt 2026, 15:30 WIB",
    },
    {
      id: "OPS-BDL-884",
      requesterName: "Dinas Lingkungan & Komunitas Bersih Teluk",
      organization: "Forum Komunitas Pesisir Teluk Betung",
      contactPhone: "+62 811-7204-331",
      projectTitle: "Operasi Bersih Muara Sungai Kuala & Pesisir Teluk Betung",
      projectType: "PEMBERSIHAN_SUNGAI",
      locationAddress: "Muara Sungai Kuala, Teluk Betung Selatan, Bandar Lampung",
      estimatedVolume: "± 12 Ton (Sampah Kiriman Muara)",
      requestedEquipment: [
        "Perahu Ponton & Trash Skimmer",
        "Ekskavator (Standard / Long-Arm / Amfibi)",
        "Armada Dump Truck Hidrolik & Arm Roll",
      ],
      urgency: "TINGGI",
      description:
        "Permintaan bantuan operasi khusus pengangkatan sampah muara sungai sebelum memasuki perairan teluk.",
      status: "DISETUJUI_SIAP_TERJUN",
      adminAnalysisNote:
        "Analisis Admin Selesai: Rencana operasi disetujui. 1 Ekskavator Amfibi, 1 Perahu Ponton, dan 3 Dump Truck siap diterjunkan bersama 20 personel lapangan MORPH.",
      createdAt: "24 Okt 2026, 09:15 WIB",
    },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("morph_special_ops_tickets");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTickets((prev) => [...parsed, ...prev]);
          }
        }
      } catch {
        // ignore storage error
      }
    }
  }, []);

  const toggleEquipment = (eqId: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eqId) ? prev.filter((id) => id !== eqId) : [...prev, eqId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !locationAddress.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);

    const equipmentNames = selectedEquipment.map(
      (id) => HEAVY_EQUIPMENT_LIST.find((item) => item.id === id)?.name || id
    );

    const newTicket: SpecialRequestTicket = {
      id: "OPS-BDL-" + Math.floor(100 + Math.random() * 900),
      requesterName: requesterName.trim(),
      organization: organization.trim() || "Masyarakat Umum",
      contactPhone: contactPhone.trim(),
      projectTitle: projectTitle.trim(),
      projectType,
      locationAddress: locationAddress.trim(),
      estimatedVolume: estimatedVolume.trim(),
      requestedEquipment:
        equipmentNames.length > 0
          ? equipmentNames
          : ["Menunggu Rekomendasi Analisis Admin MORPH"],
      urgency,
      description: description.trim(),
      status: "MENUNGGU_ANALISIS_ADMIN",
      adminAnalysisNote:
        "Permintaan diterima oleh Meja Perencanaan Admin MORPH. Tim teknis sedang menganalisis kelayakan medan, akses mobilisasi alat berat (seperti Ekskavator/Dump Truck), serta estimasi jumlah personel sebelum alat diterjunkan.",
      createdAt: "Baru saja",
    };

    setTimeout(() => {
      setTickets((prev) => [newTicket, ...prev]);
      setSubmittedTicket(newTicket);
      setIsSubmitting(false);

      if (typeof window !== "undefined") {
        try {
          const existing = JSON.parse(
            localStorage.getItem("morph_special_ops_tickets") || "[]"
          );
          localStorage.setItem(
            "morph_special_ops_tickets",
            JSON.stringify([newTicket, ...existing])
          );
        } catch {
          // ignore storage error
        }
      }

      setProjectTitle("");
      setLocationAddress("");
      setDescription("");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Banner (Dashboard-style Eco Green & White) */}
        <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-10 border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] text-xs font-extrabold uppercase tracking-wider">
                <Waves className="w-4 h-4" />
                <span>Layanan Kontak &amp; Operasi Khusus MORPH</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Kontak Kami &amp; Pengajuan{" "}
                <span className="text-[#16a34a]">
                  Pembersihan Skala Besar
                </span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                Butuh penanganan khusus seperti <strong>pembersihan sungai</strong>, pengerukan tumpukan sampah liar, atau normalisasi saluran air yang membutuhkan perencanaan matang dan <strong>alat berat (seperti Ekskavator, Perahu Ponton, &amp; Dump Truck)</strong>? Ajukan ke tim Admin MORPH untuk dianalisis dan direncanakan sebelum armada diterjunkan.
              </p>

              {/* Direct Contact Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f0fdf4] border border-emerald-200">
                  <Phone className="w-4 h-4 text-[#16a34a]" />
                  <span>Hotline Tanggap Sungai: (0721) 889-4000</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f0fdf4] border border-emerald-200">
                  <Mail className="w-4 h-4 text-[#16a34a]" />
                  <span>ops-khusus@morph.id</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f0fdf4] border border-emerald-200">
                  <MapPin className="w-4 h-4 text-[#16a34a]" />
                  <span>Posko Utama: Kedaton, Bandar Lampung</span>
                </div>
              </div>
            </div>

            {/* 4-Step Admin Planning Workflow Box */}
            <div className="lg:col-span-4">
              <div className="bg-[#f0fdf4] rounded-2xl p-6 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-[#16a34a] font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Alur Perencanaan &amp; Analisis Admin</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 bg-[#ffffff] p-3 rounded-xl border border-emerald-100">
                    <div className="w-6 h-6 rounded-lg bg-[#16a34a] text-white font-black flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Pengajuan Lokasi (Sungai / Lahan)
                      </h4>
                      <p className="text-slate-500 mt-0.5">
                        Warga/instansi melaporkan titik sungai atau lokasi beserta usulan alat yang dibutuhkan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#ffffff] p-3 rounded-xl border border-emerald-100">
                    <div className="w-6 h-6 rounded-lg bg-[#16a34a] text-white font-black flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Analisis Teknis oleh Admin MORPH
                      </h4>
                      <p className="text-slate-500 mt-0.5">
                        Admin menganalisis medan sungai, akses jalan alat berat, dan menentukan tipe Ekskavator/Armada.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[#ffffff] p-3 rounded-xl border border-emerald-100">
                    <div className="w-6 h-6 rounded-lg bg-[#16a34a] text-white font-black flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Mobilisasi Ekskavator &amp; Tim Satgas
                      </h4>
                      <p className="text-slate-500 mt-0.5">
                        Setelah perencanaan disetujui, alat berat dan tim diterjunkan ke lokasi secara terukur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Konfirmasi Pengajuan Berhasil */}
        {submittedTicket && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-200 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-[#f0fdf4] text-[#16a34a] text-xs font-extrabold border border-emerald-200">
                  Tiket Perencanaan #{submittedTicket.id}
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Permintaan Masuk ke Meja Analisis Admin!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Tim Admin &amp; Engineer MORPH akan melakukan kajian teknis dan perencanaan kebutuhan alat berat sebelum diterjunkan ke lokasi.
                </p>
              </div>

              <div className="bg-[#f0fdf4] rounded-2xl p-4 border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Judul Operasi:</span>
                  <span className="font-bold text-slate-900 text-right">
                    {submittedTicket.projectTitle}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Lokasi:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {submittedTicket.locationAddress}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Alat Berat Diajukan:</span>
                  <span className="font-bold text-[#16a34a] text-right">
                    {submittedTicket.requestedEquipment.join(", ")}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                  <span className="text-slate-500">Status Saat Ini:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px]">
                    MENUNGGU ANALISIS ADMIN
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSubmittedTicket(null)}
                className="w-full py-3.5 rounded-xl bg-[#16a34a] hover:bg-green-700 text-[#ffffff] font-bold text-sm cursor-pointer"
              >
                Mengerti &amp; Pantau Status Analisis
              </button>
            </div>
          </div>
        )}

        {/* Main Grid: Form Pengajuan Operasi Khusus (Kiri) & Daftar Kajian Admin (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Permintaan Tanggapan & Perencanaan Alat Berat */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-[#16a34a] text-xs font-extrabold uppercase tracking-wider mb-1">
                  <FileSearch className="w-4 h-4" />
                  <span>Formulir Permintaan Operasi &amp; Kajian Alat Berat</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Ajukan Pembersihan Sungai / Lokasi Khusus
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi detail kondisi lokasi agar pihak Admin MORPH dapat menganalisis kebutuhan alat berat (seperti Ekskavator) secara tepat.
                </p>
              </div>

              {/* Identitas Pemohon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nama Pemohon / Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    required
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Instansi / Komunitas / RT-RW
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Contoh: Kelurahan / Pokmas / Komunitas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>
              </div>

              {/* Kategori Objek & Tingkat Urgensi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Kategori Lokasi Pembersihan
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  >
                    <option value="PEMBERSIHAN_SUNGAI">
                      🌊 Pembersihan Sungai &amp; Kali
                    </option>
                    <option value="NORMALISASI_DRAINASE">
                      🚰 Normalisasi Kanal / Drainase Besar
                    </option>
                    <option value="LAHAN_TPS_LIAR">
                      🏗️ Penertiban Lahan TPS Liar Skala Besar
                    </option>
                    <option value="PESISIR_PANTAI">
                      🏖️ Pembersihan Muara &amp; Pesisir Pantai
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tingkat Urgensi Lapangan
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) =>
                      setUrgency(
                        e.target.value as "NORMAL" | "TINGGI" | "DARURAT_BANJIR"
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  >
                    <option value="NORMAL">Normal (Terjadwal Rutin)</option>
                    <option value="TINGGI">
                      Prioritas Tinggi (Tumpukan Menebal)
                    </option>
                    <option value="DARURAT_BANJIR">
                      ⚠️ Darurat (Menyumbat Aliran Sungai / Rawan Banjir)
                    </option>
                  </select>
                </div>
              </div>

              {/* Nama Lokasi / Sungai & Alamat Detail */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Judul Permintaan Operasi (Misal: Pembersihan Sungai A)
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Contoh: Pembersihan Aliran Sungai Way Halim / Sungai A dari Tumpukan Sampah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Titik Lokasi / Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={locationAddress}
                      onChange={(e) => setLocationAddress(e.target.value)}
                      placeholder="Contoh: Jembatan Sungai Way Halim, Bandar Lampung"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Estimasi Volume / Panjang Area
                    </label>
                    <input
                      type="text"
                      value={estimatedVolume}
                      onChange={(e) => setEstimatedVolume(e.target.value)}
                      placeholder="Contoh: ± 20 Ton / Panjang 150 Meter"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  </div>
                </div>
              </div>

              {/* Pilihan Kebutuhan Alat Berat (Untuk Dianalisis Admin) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Usulan Kebutuhan Alat Berat &amp; Sarana (Dianalisis Admin)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Pilih alat yang menurut Anda dibutuhkan di lokasi; tim Admin akan memverifikasi kelayakan medannya
                    </p>
                  </div>
                  <Wrench className="w-4 h-4 text-[#16a34a]" />
                </div>

                <div className="space-y-2.5">
                  {HEAVY_EQUIPMENT_LIST.map((eq) => {
                    const isSelected = selectedEquipment.includes(eq.id);
                    return (
                      <div
                        key={eq.id}
                        onClick={() => toggleEquipment(eq.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                          isSelected
                            ? "border-[#16a34a] bg-[#f0fdf4]"
                            : "border-slate-200 hover:border-emerald-200 bg-white"
                        }`}
                      >
                        <div className="mt-0.5 text-[#16a34a]">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 fill-[#16a34a] text-white" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-xs font-extrabold text-slate-900">
                              {eq.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[#16a34a]">
                              {eq.spec}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {eq.useCase}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deskripsi Kondisi Medan & Akses Jalan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Deskripsi Kondisi Lapangan &amp; Akses Alat Berat
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kondisi sungai/lokasi (misal: kedalaman sungai, apakah jalan di pinggir sungai cukup lebar untuk dilalui Ekskavator & Dump Truck, jenis sampah yang menumpuk)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#16a34a] hover:bg-green-700 text-[#ffffff] font-black text-sm shadow-md shadow-[#16a34a]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Mengirim Permintaan ke Admin MORPH..."
                    : "Kirim Permintaan Analisis & Perencanaan ke Admin"}
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Status Tanggapan & Analisis Teknis Admin MORPH */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#ffffff] rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-[#16a34a]" />
                    <span>Pantauan Analisis &amp; Tanggapan Admin</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daftar pengajuan operasi pembersihan yang sedang dikaji maupun dijadwalkan oleh Admin
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] text-xs font-extrabold">
                  {tickets.length} Pengajuan
                </span>
              </div>

              <div className="space-y-4 max-h-[760px] overflow-y-auto pr-1">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-[#ffffff] space-y-3 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-extrabold text-slate-500">
                        #{t.id}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          t.status === "DISETUJUI_SIAP_TERJUN"
                            ? "bg-[#f0fdf4] text-[#16a34a] border border-emerald-200"
                            : t.status === "SURVEI_DAN_PERENCANAAN_ALAT"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {t.status === "DISETUJUI_SIAP_TERJUN" &&
                          "✓ Disetujui & Alat Siap Terjun"}
                        {t.status === "SURVEI_DAN_PERENCANAAN_ALAT" &&
                          "🔍 Tahap Survei & Perencanaan Alat"}
                        {t.status === "MENUNGGU_ANALISIS_ADMIN" &&
                          "⏳ Menunggu Analisis Admin"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {t.projectTitle}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                        <span>{t.locationAddress}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold">
                        Est. Volume: {t.estimatedVolume}
                      </span>
                      {t.urgency === "DARURAT_BANJIR" && (
                        <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Darurat Aliran Sungai
                        </span>
                      )}
                    </div>

                    {/* Daftar Alat Berat yang Dianalisis */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Kebutuhan Alat Berat &amp; Armada:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {t.requestedEquipment.map((eqName, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f0fdf4] border border-emerald-200 text-[#16a34a] text-[11px] font-bold"
                          >
                            <HardHat className="w-3 h-3" />
                            {eqName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Kotak Tanggapan & Analisis Admin MORPH */}
                    <div className="p-3 rounded-xl bg-[#f0fdf4] border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-[#16a34a]">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Hasil Analisis &amp; Tanggapan Admin MORPH:
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {t.adminAnalysisNote}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {t.organization}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

