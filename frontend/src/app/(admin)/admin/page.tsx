"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Recycle,
  LayoutDashboard,
  Radio,
  Truck,
  Gift,
  Inbox,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Coins,
  Scale,
  Users,
  Star,
  Trash2,
  Edit3,
  Power,
  LogOut,
  ExternalLink,
  Sparkles,
  Check,
  Search,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Phone,
  Building2,
} from "lucide-react";
import LeafletMap, { MapMarker } from "@/components/LeafletMap";
import { morphApi } from "@/services/morphApi";
import {
  MobileOrder,
  FleetDriver,
  RewardRedemptionItem,
  PartnerInboxItem,
  WeeklyWasteStat,
  OrderStatus,
  INITIAL_MOBILE_ORDERS,
  INITIAL_DRIVERS,
  INITIAL_REWARD_REDEMPTIONS,
  INITIAL_PARTNER_INBOX,
  INITIAL_WEEKLY_STATS,
  INITIAL_DISTRICT_STATS,
} from "@/lib/morphStore";

type AdminTab = "analytics" | "orders" | "fleet" | "rewards" | "inbox";

const DISTRICT_COLORS: Record<string, string> = {
  Kedaton: "#00880D",
  Sukarame: "#059669",
  Rajabasa: "#10B981",
  "Way Halim": "#0D9488",
  Enggal: "#34D399",
};

const RANDOM_CITIZEN_SAMPLES = [
  {
    name: "Bpk. Ridwan Kamiludin",
    phone: "0812-7789-3310",
    address: "Jl. Sultan Agung No. 19, Way Halim",
    district: "Way Halim" as const,
    lat: -5.3798,
    lng: 105.2755,
  },
  {
    name: "Ibu Maya Sari",
    phone: "0813-6902-5512",
    address: "Jl. Pagar Alam Gg. Cempaka No. 8, Kedaton",
    district: "Kedaton" as const,
    lat: -5.3835,
    lng: 105.2549,
  },
  {
    name: "Kafe Kopi Lampung Sukarame",
    phone: "0821-8841-9002",
    address: "Jl. Ryacudu Korpri Jaya, Sukarame",
    district: "Sukarame" as const,
    lat: -5.3882,
    lng: 105.2938,
  },
  {
    name: "Wisma Mahasiswa Rajabasa",
    phone: "0852-7102-4490",
    address: "Jl. Zainal Abidin Pagar Alam, Rajabasa",
    district: "Rajabasa" as const,
    lat: -5.3688,
    lng: 105.2462,
  },
  {
    name: "Bpk. Hendrawan Saputra",
    phone: "0811-7205-881",
    address: "Jl. Jenderal Sudirman No. 40, Enggal",
    district: "Enggal" as const,
    lat: -5.4228,
    lng: 105.2608,
  },
];

export default function SecretAdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // KPI & Chart Dynamic State (initialized to match exact specification benchmarks)
  const [organicTotalKg, setOrganicTotalKg] = useState<number>(820);
  const [anorganicTotalKg, setAnorganicTotalKg] = useState<number>(600);
  const [completedOrdersBaseCount, setCompletedOrdersBaseCount] = useState<number>(22);
  const [totalPointsCirculating, setTotalPointsCirculating] = useState<number>(142000);

  const [weeklyStats, setWeeklyStats] = useState<WeeklyWasteStat[]>(
    INITIAL_WEEKLY_STATS
  );
  const [districtStats, setDistrictStats] = useState<
    Record<"Kedaton" | "Sukarame" | "Rajabasa" | "Enggal" | "Way Halim", number>
  >(INITIAL_DISTRICT_STATS);

  // Core Entities State
  const [orders, setOrders] = useState<MobileOrder[]>(INITIAL_MOBILE_ORDERS);
  const [drivers, setDrivers] = useState<FleetDriver[]>(INITIAL_DRIVERS);
  const [redemptions, setRedemptions] = useState<RewardRedemptionItem[]>(
    INITIAL_REWARD_REDEMPTIONS
  );
  const [inboxItems, setInboxItems] = useState<PartnerInboxItem[]>(
    INITIAL_PARTNER_INBOX
  );

  // Filter & Selection State
  const [orderFilter, setOrderFilter] = useState<string>("ALL");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // Assign Driver / Edit Weight Modal State
  const [assignModalOrder, setAssignModalOrder] = useState<MobileOrder | null>(
    null
  );
  const [selectedDriverIdForOrder, setSelectedDriverIdForOrder] =
    useState<string>("DRV-01");
  const [actualWeightInput, setActualWeightInput] = useState<number>(18);

  // Add / Edit Driver Modal State
  const [showDriverModal, setShowDriverModal] = useState<boolean>(false);
  const [editingDriver, setEditingDriver] = useState<FleetDriver | null>(null);
  const [drvName, setDrvName] = useState("");
  const [drvPhone, setDrvPhone] = useState("");
  const [drvPlate, setDrvPlate] = useState("");
  const [drvVehicle, setDrvVehicle] =
    useState<FleetDriver["vehicleType"]>("Motor Gerobak");
  const [drvDistrict, setDrvDistrict] = useState("Kedaton");
  const [drvLoad, setDrvLoad] = useState(25);
  const [drvMaxCap, setDrvMaxCap] = useState(100);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  // Sync Inbox from Public Landing Page ('morph_inbox') & 3-Second Live API Polling from NestJS / Flutter
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawInbox = localStorage.getItem("morph_inbox");
      if (rawInbox) {
        const parsedInbox: PartnerInboxItem[] = JSON.parse(rawInbox);
        if (Array.isArray(parsedInbox) && parsedInbox.length > 0) {
          setInboxItems((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newEntries = parsedInbox.filter((i) => !existingIds.has(i.id));
            return [...newEntries, ...prev];
          });
        }
      }
    } catch {
      // ignore storage parse error
    }

    // Auto-Refresh / Polling setiap 3 detik ke morphApi (NestJS /api/orders -> fallback /api/mobile/orders)
    const pollInterval = setInterval(async () => {
      try {
        const snapshot = await morphApi.fetchLiveEcosystemData();
        if (snapshot.orders && snapshot.orders.length > 0) {
          setOrders((prev) => {
            const existingIds = new Set(prev.map((o) => o.id));
            const incomingNew = snapshot.orders.filter(
              (o) => !existingIds.has(o.id)
            );
            return incomingNew.length > 0 ? [...incomingNew, ...prev] : prev;
          });
        }
      } catch {
        // silent fallback
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  // Derived KPI Calculations
  const totalWasteKg = organicTotalKg + anorganicTotalKg;
  const activeOrdersCount = orders.filter(
    (o) => o.status === "SEARCHING_DRIVER" || o.status === "ON_THE_WAY"
  ).length;
  const completedOrdersInTable = orders.filter(
    (o) => o.status === "COMPLETED"
  ).length;
  const totalCompletedToday = completedOrdersBaseCount + completedOrdersInTable;
  const totalOrdersToday = activeOrdersCount + totalCompletedToday;
  // Base 6 extra active partner units + active online drivers in table = 12 online fleet units
  const onlineDriversCount =
    6 + drivers.filter((d) => d.isOnline).length;

  // =========================================================================
  // CRUD ACTION 1: SIMULASI ORDER BARU DARI MOBILE APP
  // =========================================================================
  const handleSimulateNewMobileOrder = async () => {
    const sample =
      RANDOM_CITIZEN_SAMPLES[
        Math.floor(Math.random() * RANDOM_CITIZEN_SAMPLES.length)
      ];
    const orgKg = Math.floor(5 + Math.random() * 14);
    const anorgKg = Math.floor(4 + Math.random() * 12);
    const totalKg = orgKg + anorgKg;
    const categoryLabel =
      orgKg > 0 && anorgKg > 0
        ? "Campuran (Organik & Anorganik)"
        : orgKg > 0
        ? "Organik"
        : "Anorganik";

    const newOrder: MobileOrder = {
      id: `MRP-${Math.floor(8822 + Math.random() * 900)}`,
      time: "Baru saja",
      citizenName: sample.name,
      citizenPhone: sample.phone,
      address: sample.address,
      district: sample.district,
      category: categoryLabel,
      organicKg: orgKg,
      anorganicKg: anorgKg,
      totalKg,
      driverId: null,
      driverName: null,
      vehiclePlate: null,
      status: "SEARCHING_DRIVER",
      pointsAwarded: totalKg * 10,
      latitude: sample.lat,
      longitude: sample.lng,
    };

    setOrders((prev) => [newOrder, ...prev]);

    try {
      await fetch("/api/mobile/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
    } catch {
      // in-memory fallback handled
    }

    showToast(
      `📱 Order Mobile Baru #${newOrder.id} (${sample.name} - ${totalKg} Kg) masuk ke antrean Live Dispatch!`
    );
  };

  // =========================================================================
  // CRUD ACTION 2: TUGASKAN DRIVER (MANUAL ASSIGN) & SELESAIKAN ORDER
  // =========================================================================
  const handleAssignDriverToOrder = async (
    order: MobileOrder,
    driverId: string
  ) => {
    const driver = drivers.find((d) => d.id === driverId) || drivers[0];
    if (!driver) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: "ON_THE_WAY",
              driverId: driver.id,
              driverName: driver.name,
              vehiclePlate: driver.plateNumber,
            }
          : o
      )
    );

    try {
      await fetch("/api/mobile/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          status: "ON_THE_WAY",
          driverId: driver.id,
          driverName: driver.name,
          vehiclePlate: driver.plateNumber,
        }),
      });
    } catch {
      // handled
    }

    setAssignModalOrder(null);
    showToast(
      `🚛 Mitra Driver ${driver.name} (${driver.plateNumber}) berhasil ditugaskan ke Order #${order.id}!`
    );
  };

  const handleCompleteOrderAndAwardPoints = async (
    order: MobileOrder,
    finalKg?: number
  ) => {
    const verifiedKg = finalKg || order.totalKg;
    const ratio = order.totalKg > 0 ? verifiedKg / order.totalKg : 1;
    const addedOrg = Math.round(order.organicKg * ratio);
    const addedAnorg = Math.max(0, verifiedKg - addedOrg);
    const pointsEarned = verifiedKg * 100; // 1 Kg = 100 Poin Sirkular (Setara Rp 1.000)

    // 1. Update status order menjadi COMPLETED
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: "COMPLETED",
              totalKg: verifiedKg,
              organicKg: addedOrg,
              anorganicKg: addedAnorg,
              pointsAwarded: pointsEarned,
              driverName: o.driverName || "Budi Santoso",
              vehiclePlate: o.vehiclePlate || "BE 4521 YX",
            }
          : o
      )
    );

    // 2. Update KPI Tonase & Poin Sirkular
    setOrganicTotalKg((prev) => prev + addedOrg);
    setAnorganicTotalKg((prev) => prev + addedAnorg);
    setTotalPointsCirculating((prev) => prev + pointsEarned);

    // 3. Update Grafik Mingguan (Hari Minggu / Hari Aktif)
    setWeeklyStats((prev) =>
      prev.map((item, idx) =>
        idx === prev.length - 1
          ? {
              ...item,
              Organik: item.Organik + addedOrg,
              Anorganik: item.Anorganik + addedAnorg,
            }
          : item
      )
    );

    // 4. Update Grafik Distribusi Kecamatan
    setDistrictStats((prev) => ({
      ...prev,
      [order.district]: (prev[order.district] || 200) + verifiedKg,
    }));

    // 5. Update Muatan Armada Driver terkait
    if (order.driverId) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === order.driverId
            ? {
                ...d,
                currentLoadKg: Math.min(
                  d.maxCapacityKg,
                  d.currentLoadKg + verifiedKg
                ),
                completedToday: d.completedToday + 1,
              }
            : d
        )
      );
    }

    try {
      await fetch("/api/mobile/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          status: "COMPLETED",
          totalKg: verifiedKg,
        }),
      });
    } catch {
      // handled
    }

    setAssignModalOrder(null);
    showToast(
      `✅ Order #${order.id} Selesai! +${verifiedKg} Kg masuk ke Grafik Tonase & +${pointsEarned.toLocaleString(
        "id-ID"
      )} Poin dikirim ke ${order.citizenName}.`
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "CANCELLED" } : o
      )
    );
    showToast(`Order #${orderId} telah dibatalkan.`);
  };

  // =========================================================================
  // CRUD ACTION 3: MANAJEMEN ARMADA DRIVER (TAMBAH / EDIT / TOGGLE ONLINE)
  // =========================================================================
  const openAddDriverModal = () => {
    setEditingDriver(null);
    setDrvName("");
    setDrvPhone("0812-7700-9911");
    setDrvPlate("BE 9240 YX");
    setDrvVehicle("Motor Gerobak");
    setDrvDistrict("Kedaton");
    setDrvLoad(0);
    setDrvMaxCap(100);
    setShowDriverModal(true);
  };

  const openEditDriverModal = (driver: FleetDriver) => {
    setEditingDriver(driver);
    setDrvName(driver.name);
    setDrvPhone(driver.phone);
    setDrvPlate(driver.plateNumber);
    setDrvVehicle(driver.vehicleType);
    setDrvDistrict(driver.district);
    setDrvLoad(driver.currentLoadKg);
    setDrvMaxCap(driver.maxCapacityKg);
    setShowDriverModal(true);
  };

  const handleSaveDriver = async (e: FormEvent) => {
    e.preventDefault();
    if (!drvName.trim() || !drvPlate.trim()) return;

    if (editingDriver) {
      const updated: FleetDriver = {
        ...editingDriver,
        name: drvName.trim(),
        phone: drvPhone.trim(),
        plateNumber: drvPlate.trim().toUpperCase(),
        vehicleType: drvVehicle,
        district: drvDistrict,
        currentLoadKg: Number(drvLoad),
        maxCapacityKg: Number(drvMaxCap),
      };
      setDrivers((prev) =>
        prev.map((d) => (d.id === editingDriver.id ? updated : d))
      );
      showToast(`Data Mitra Driver ${updated.name} berhasil diperbarui!`);
    } else {
      const newDrv: FleetDriver = {
        id: `DRV-0${drivers.length + 1}`,
        name: drvName.trim(),
        phone: drvPhone.trim(),
        plateNumber: drvPlate.trim().toUpperCase(),
        vehicleType: drvVehicle,
        district: drvDistrict,
        currentLoadKg: Number(drvLoad),
        maxCapacityKg: Number(drvMaxCap),
        rating: 5.0,
        isOnline: true,
        completedToday: 0,
        latitude: -5.3824 + (Math.random() - 0.5) * 0.03,
        longitude: 105.2586 + (Math.random() - 0.5) * 0.03,
      };
      setDrivers((prev) => [newDrv, ...prev]);

      try {
        await fetch("/api/mobile/drivers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDrv),
        });
      } catch {
        // handled
      }

      showToast(
        `Mitra Driver Baru ${newDrv.name} (${newDrv.plateNumber}) berhasil ditambahkan ke Armada Bandar Lampung!`
      );
    }

    setShowDriverModal(false);
  };

  const handleToggleDriverOnline = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, isOnline: !d.isOnline } : d
      )
    );
    showToast("Status operasional armada berhasil diperbarui.");
  };

  // =========================================================================
  // CRUD ACTION 4: MANAJEMEN POIN REWARD & PENCAIRAN
  // =========================================================================
  const handleApproveRedemption = (redemption: RewardRedemptionItem) => {
    setRedemptions((prev) =>
      prev.map((r) =>
        r.id === redemption.id ? { ...r, status: "DISETUJUI" } : r
      )
    );
    showToast(
      `💰 Pencairan ${redemption.rewardTitle} (${redemption.pointsCost.toLocaleString(
        "id-ID"
      )} Poin) untuk ${redemption.citizenName} telah disetujui!`
    );
  };

  const handleSimulateNewRedemption = () => {
    const newRed: RewardRedemptionItem = {
      id: `RWD-${Math.floor(905 + Math.random() * 90)}`,
      citizenName: "Bpk. Ridwan Kamiludin",
      citizenPhone: "0812-7789-3310",
      district: "Way Halim",
      pointsCost: 5000,
      rewardTitle: "Saldo Dompet Digital MORPH Pay Rp 50.000",
      rewardCategory: "E-Wallet",
      equivalentRupiah: 50000,
      requestedAt: "Baru saja",
      status: "MENUNGGU_PERSETUJUAN",
    };
    setRedemptions((prev) => [newRed, ...prev]);
    showToast(
      `🎁 Permintaan penukaran 5.000 Poin baru dari aplikasi mobile warga berhasil masuk!`
    );
  };

  // =========================================================================
  // CRUD ACTION 5: INBOX PENGAJUAN MITRA (DARI WEB PUBLIK)
  // =========================================================================
  const handleApprovePartnerInbox = (item: PartnerInboxItem) => {
    const updatedList = inboxItems.map((i) =>
      i.id === item.id ? { ...i, status: "DITERIMA_MITRA" as const } : i
    );
    setInboxItems(updatedList);

    if (typeof window !== "undefined") {
      localStorage.setItem("morph_inbox", JSON.stringify(updatedList));
    }

    // Jika pengajuan adalah Daftar Driver, otomatis tambahkan juga ke tabel Armada Driver!
    if (item.category === "Daftar Driver") {
      const newDriverFromInbox: FleetDriver = {
        id: `DRV-M${Math.floor(10 + Math.random() * 89)}`,
        name: item.fullName,
        phone: item.contact,
        plateNumber: `BE ${Math.floor(2000 + Math.random() * 7000)} YX`,
        vehicleType: "Motor Gerobak",
        district: item.district,
        currentLoadKg: 0,
        maxCapacityKg: 100,
        rating: 5.0,
        isOnline: true,
        completedToday: 0,
        latitude: -5.3824,
        longitude: 105.2586,
      };
      setDrivers((prev) => [newDriverFromInbox, ...prev]);
      showToast(
        `🤝 ${item.fullName} resmi diterima sebagai Mitra Driver & otomatis terdaftar di Manajemen Armada!`
      );
    } else {
      showToast(
        `🤝 Pengajuan ${item.category} dari ${item.fullName} (Kec. ${item.district}) resmi diterima sebagai Mitra MORPH!`
      );
    }
  };

  const handleDeleteInboxItem = (id: string) => {
    const updatedList = inboxItems.filter((i) => i.id !== id);
    setInboxItems(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("morph_inbox", JSON.stringify(updatedList));
    }
    showToast(`Pesan inbox #${id} telah dihapus.`);
  };

  // Filtered Orders for Menu 2
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "ALL") return true;
    return o.status === orderFilter;
  });

  // Leaflet Markers combining Active Orders (Warga) and Fleet Drivers in Bandar Lampung
  const fleetMapMarkers: MapMarker[] = [
    ...drivers.map((d) => ({
      id: d.id,
      latitude: d.latitude,
      longitude: d.longitude,
      title: `${d.name} (${d.plateNumber})`,
      address: `Kec. ${d.district} • Muatan ${d.currentLoadKg}/${d.maxCapacityKg} Kg`,
      isDriver: true,
      vehicleType: d.vehicleType,
    })),
    ...orders
      .filter((o) => o.status !== "CANCELLED")
      .map((o) => ({
        id: o.id,
        latitude: o.latitude,
        longitude: o.longitude,
        title: `${o.id} • ${o.citizenName}`,
        address: o.address,
        category: o.category,
        weight: o.totalKg,
        vehicleRec: o.totalKg > 30 ? "PICKUP" : "MOTOR",
        status:
          o.status === "COMPLETED"
            ? "COMPLETED"
            : o.status === "ON_THE_WAY"
            ? "ACCEPTED"
            : "PENDING",
      })),
  ];

  // Donut Chart Geometry Calculation for District Breakdown
  const districtEntries = Object.entries(districtStats);
  const totalDistrictVolume = districtEntries.reduce(
    (acc, [, val]) => acc + val,
    0
  );
  const donutRadius = 70;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let cumulativePercent = 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row font-sans">
      {/* =====================================================================
          SIDEBAR KIRI (GAYA GOCORP ENTERPRISE PORTAL)
      ====================================================================== */}
      <aside className="w-full lg:w-72 bg-[#0F172A] text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00880D] flex items-center justify-center text-white shadow-md shadow-[#00880D]/30">
                <Recycle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white">
                    MORPH
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#00880D] text-[10px] font-extrabold uppercase">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Command Center • Bandar Lampung
                </span>
              </div>
            </div>
          </div>

          {/* 5 Sidebar Menu Items */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Menu Operasional Utama
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-[#00880D] text-white shadow-lg shadow-[#00880D]/25"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Ringkasan &amp; Grafik</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#00880D] text-white shadow-lg shadow-[#00880D]/25"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Radio className="w-4 h-4" />
                <span>Live Order &amp; Dispatch</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {activeOrdersCount} Live
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("fleet")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "fleet"
                  ? "bg-[#00880D] text-white shadow-lg shadow-[#00880D]/25"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Truck className="w-4 h-4" />
                <span>Manajemen Armada Driver</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold">
                {onlineDriversCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rewards")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "rewards"
                  ? "bg-[#00880D] text-white shadow-lg shadow-[#00880D]/25"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Gift className="w-4 h-4" />
                <span>Katalog &amp; Penukaran Poin</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] font-bold">
                {
                  redemptions.filter(
                    (r) => r.status === "MENUNGGU_PERSETUJUAN"
                  ).length
                }
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inbox")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "inbox"
                  ? "bg-[#00880D] text-white shadow-lg shadow-[#00880D]/25"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Inbox Kemitraan</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {inboxItems.filter((i) => i.status === "BARU").length} Baru
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
              REST API Bridge Flutter
            </span>
            <code className="text-[11px] text-slate-300 block font-mono truncate">
              /api/mobile/orders
            </code>
            <code className="text-[11px] text-slate-300 block font-mono truncate">
              /api/mobile/drivers
            </code>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Web Publik</span>
            </Link>
            <button
              type="button"
              onClick={() => router.push("/admin-login")}
              className="py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          MAIN CONTENT AREA (KANAN)
      ====================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header with Mobile Sync API Status Indicator */}
        <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#0F172A]">
              {activeTab === "analytics" &&
                "Ringkasan Eksekutif & Grafik Analitik Kota Bandar Lampung"}
              {activeTab === "orders" &&
                "Live Order Mobile & Dispatch Center (Warga ↔ Driver)"}
              {activeTab === "fleet" &&
                "Peta Monitoring Armada & Manajemen Mitra Driver"}
              {activeTab === "rewards" &&
                "Manajemen Poin Reward Sirkular & Pencairan Saldo"}
              {activeTab === "inbox" &&
                "Inbox Pengajuan Mitra & Kerjasama RT/RW (Dari Web Publik)"}
            </h1>
            <p className="text-xs text-slate-500">
              Sinkronisasi waktu nyata dengan Aplikasi Mobile Flutter Warga &amp; Mitra Driver
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Required Status Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#00880D]/10 border border-[#00880D]/25 text-[#00880D] text-xs font-extrabold">
              <span>🟢 Mobile Sync API: Active</span>
            </div>

            {/* Quick Simulation Button */}
            <button
              type="button"
              onClick={handleSimulateNewMobileOrder}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold shadow-md shadow-[#00880D]/20 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Simulasi Order Baru dari Mobile</span>
            </button>
          </div>
        </header>

        {/* Live Toast Notification Banner */}
        {toastMsg && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-[#0F172A] text-white border-l-4 border-[#00880D] shadow-xl flex items-center justify-between gap-4 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-xs text-emerald-400 underline cursor-pointer shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Content Body */}
        <main className="p-6 space-y-6 flex-1">
          {/* =================================================================
              4 KPI CARDS UTAMA (TAMPIL DI ATAS UNTUK VISIBILITAS EKSEKUTIF)
          ================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* KPI 1: Total Sampah Terkelola */}
            <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Total Sampah Terkelola
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#00880D]/10 text-[#00880D] flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#0F172A]">
                {totalWasteKg.toLocaleString("id-ID")} Kg
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2 py-0.5 rounded-md bg-[#00880D]/10 text-[#00880D]">
                  {organicTotalKg.toLocaleString("id-ID")} Kg Organik
                </span>
                <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700">
                  {anorganicTotalKg.toLocaleString("id-ID")} Kg Anorganik
                </span>
              </div>
            </div>

            {/* KPI 2: Order Mobile Hari Ini */}
            <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Order Mobile Hari Ini
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#0F172A]">
                {totalOrdersToday} Pesanan
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800">
                  {activeOrdersCount} Sedang Berjalan
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[#00880D]">
                  {totalCompletedToday} Selesai
                </span>
              </div>
            </div>

            {/* KPI 3: Mitra Driver Aktif */}
            <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Mitra Driver Aktif
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#059669]/10 text-[#059669] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#0F172A]">
                {onlineDriversCount} Armada Online
              </div>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00880D]" />
                <span>Siaga di 20 Kecamatan Bandar Lampung</span>
              </p>
            </div>

            {/* KPI 4: Total Poin Sirkular Beredar */}
            <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Total Poin Sirkular Beredar
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#00880D]">
                {totalPointsCirculating.toLocaleString("id-ID")} Poin
              </div>
              <p className="text-xs font-bold text-slate-600">
                Setara{" "}
                <span className="text-[#0F172A] font-black">
                  Rp {(totalPointsCirculating * 10).toLocaleString("id-ID")}
                </span>{" "}
                Nilai Ekonomi Warga
              </p>
            </div>
          </div>

          {/* =================================================================
              MENU 1: RINGKASAN EKSEKUTIF & GRAFIK ANALITIK (BAR & DONUT CHART)
          ================================================================== */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Grafik 1 (Bar Chart): Tren Pengumpulan Sampah Mingguan (Senin - Minggu) */}
                <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#00880D]">
                        Grafik Analitik #1 • Recharts Bar Engine
                      </span>
                      <h3 className="text-lg font-black text-[#0F172A]">
                        Tren Pengumpulan Sampah Mingguan (Kg)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Perbandingan tonase sampah Organik vs Anorganik (Senin – Minggu)
                      </p>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-[#00880D]" />
                        <span>Organik (Kg)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-[#0D9488]" />
                        <span>Anorganik (Kg)</span>
                      </span>
                    </div>
                  </div>

                  {/* Interactive Grouped Bar Chart */}
                  <div className="relative h-64 pt-6 pb-2 px-2 flex items-end justify-between gap-3 border-b border-slate-200">
                    {/* Horizontal Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-2">
                      {[160, 120, 80, 40, 0].map((tick) => (
                        <div
                          key={tick}
                          className="w-full border-b border-dashed border-slate-100 flex items-center"
                        >
                          <span className="text-[10px] font-mono text-slate-400 -mt-4">
                            {tick} kg
                          </span>
                        </div>
                      ))}
                    </div>

                    {weeklyStats.map((stat, idx) => {
                      const maxScale = 165;
                      const orgHeightPct = Math.min(
                        100,
                        Math.round((stat.Organik / maxScale) * 100)
                      );
                      const anorgHeightPct = Math.min(
                        100,
                        Math.round((stat.Anorganik / maxScale) * 100)
                      );
                      const isHovered = hoveredBarIndex === idx;

                      return (
                        <div
                          key={stat.day}
                          onMouseEnter={() => setHoveredBarIndex(idx)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                          className="relative z-10 flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                        >
                          {/* Hover Tooltip */}
                          {isHovered && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 bg-[#0F172A] text-white px-3 py-2 rounded-xl shadow-xl text-[11px] whitespace-nowrap pointer-events-none">
                              <div className="font-extrabold border-b border-slate-700 pb-0.5 mb-1">
                                {stat.day} (Total: {stat.Organik + stat.Anorganik} Kg)
                              </div>
                              <div className="text-emerald-400 font-bold">
                                Organik: {stat.Organik} Kg
                              </div>
                              <div className="text-teal-300 font-bold">
                                Anorganik: {stat.Anorganik} Kg
                              </div>
                            </div>
                          )}

                          {/* Paired Bars */}
                          <div className="w-full max-w-[44px] h-full flex items-end justify-center gap-1.5">
                            <div
                              style={{ height: `${orgHeightPct}%` }}
                              className="flex-1 bg-[#00880D] group-hover:bg-[#059669] rounded-t-lg transition-all duration-300 relative"
                            >
                              <span className="hidden sm:block text-[9px] font-mono font-bold text-slate-600 text-center -mt-4">
                                {stat.Organik}
                              </span>
                            </div>
                            <div
                              style={{ height: `${anorgHeightPct}%` }}
                              className="flex-1 bg-[#0D9488] group-hover:bg-teal-500 rounded-t-lg transition-all duration-300 relative"
                            >
                              <span className="hidden sm:block text-[9px] font-mono font-bold text-slate-500 text-center -mt-4">
                                {stat.Anorganik}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex items-center justify-between gap-3 pt-3 px-2">
                    {weeklyStats.map((stat) => (
                      <div
                        key={stat.day}
                        className="flex-1 text-center text-xs font-extrabold text-slate-700"
                      >
                        {stat.day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grafik 2 (Pie/Donut Chart): Distribusi Volume Sampah per Kecamatan di Bandar Lampung */}
                <div className="lg:col-span-5 bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#00880D]">
                      Grafik Analitik #2 • Donut Chart
                    </span>
                    <h3 className="text-lg font-black text-[#0F172A]">
                      Distribusi Volume Sampah per Kecamatan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Proporsi serapan sampah di 5 Kecamatan utama Bandar Lampung
                    </p>
                  </div>

                  {/* Interactive SVG Donut Chart */}
                  <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 180 180"
                        className="w-full h-full -rotate-90 transform"
                      >
                        {districtEntries.map(([distName, val]) => {
                          const pct =
                            totalDistrictVolume > 0
                              ? val / totalDistrictVolume
                              : 0;
                          const strokeDasharray = `${
                            pct * donutCircumference
                          } ${donutCircumference}`;
                          const strokeDashoffset = -(
                            cumulativePercent * donutCircumference
                          );
                          cumulativePercent += pct;
                          const isHovered = hoveredDistrict === distName;

                          return (
                            <circle
                              key={distName}
                              cx="90"
                              cy="90"
                              r={donutRadius}
                              fill="transparent"
                              stroke={DISTRICT_COLORS[distName] || "#00880D"}
                              strokeWidth={isHovered ? 28 : 24}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              onMouseEnter={() => setHoveredDistrict(distName)}
                              onMouseLeave={() => setHoveredDistrict(null)}
                              className="transition-all duration-200 cursor-pointer"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400">
                          {hoveredDistrict || "Total Kota"}
                        </span>
                        <span className="text-xl font-black text-[#0F172A]">
                          {hoveredDistrict
                            ? `${
                                districtStats[
                                  hoveredDistrict as keyof typeof districtStats
                                ]
                              } Kg`
                            : `${totalDistrictVolume.toLocaleString("id-ID")} Kg`}
                        </span>
                      </div>
                    </div>

                    {/* District Legend Breakdown */}
                    <div className="w-full space-y-2.5">
                      {districtEntries.map(([distName, val]) => {
                        const pct = Math.round(
                          (val / totalDistrictVolume) * 100
                        );
                        return (
                          <div
                            key={distName}
                            onMouseEnter={() => setHoveredDistrict(distName)}
                            onMouseLeave={() => setHoveredDistrict(null)}
                            className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{
                                  backgroundColor:
                                    DISTRICT_COLORS[distName] || "#00880D",
                                }}
                              />
                              <span className="font-bold text-slate-800">
                                {distName}
                              </span>
                            </div>
                            <div className="font-mono font-extrabold text-slate-900">
                              {val} Kg{" "}
                              <span className="text-slate-400 font-normal">
                                ({pct}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Wilayah Prioritas: Kec. Kedaton &amp; Sukarame</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="text-[#00880D] font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Detail Transaksi</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Preview of Latest Mobile Orders inside Executive Summary */}
              <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-[#0F172A]">
                      Aktivitas Live Dispatch Terbaru dari Aplikasi Mobile
                    </h3>
                    <p className="text-xs text-slate-500">
                      Menampilkan 4 pesanan penjemputan terakhir yang masuk dari smartphone warga
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-[#0F172A] cursor-pointer"
                  >
                    Buka Semua Order ({orders.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase">
                        <th className="py-3 px-3 font-extrabold">ID Order</th>
                        <th className="py-3 px-3 font-extrabold">Warga &amp; Kecamatan</th>
                        <th className="py-3 px-3 font-extrabold">Kategori</th>
                        <th className="py-3 px-3 font-extrabold">Berat</th>
                        <th className="py-3 px-3 font-extrabold">Mitra Driver</th>
                        <th className="py-3 px-3 font-extrabold">Status</th>
                        <th className="py-3 px-3 font-extrabold text-right">Aksi Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 4).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-3 font-mono font-black text-[#0F172A]">
                            {o.id}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">
                              {o.citizenName}
                            </div>
                            <div className="text-slate-500">
                              Kec. {o.district} • {o.time}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">
                            {o.category}
                          </td>
                          <td className="py-3 px-3 font-mono font-black text-[#00880D]">
                            {o.totalKg} Kg
                          </td>
                          <td className="py-3 px-3">
                            {o.driverName ? (
                              <span className="font-bold text-slate-800">
                                {o.driverName} ({o.vehiclePlate})
                              </span>
                            ) : (
                              <span className="text-amber-600 font-bold italic">
                                Belum Ditugaskan
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                o.status === "SEARCHING_DRIVER"
                                  ? "bg-amber-100 text-amber-800"
                                  : o.status === "ON_THE_WAY"
                                  ? "bg-blue-100 text-blue-800"
                                  : o.status === "COMPLETED"
                                  ? "bg-emerald-100 text-[#00880D]"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {o.status === "SEARCHING_DRIVER" && "Mencari Driver"}
                              {o.status === "ON_THE_WAY" && "Dijemput"}
                              {o.status === "COMPLETED" && "Selesai"}
                              {o.status === "CANCELLED" && "Dibatalkan"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {o.status === "SEARCHING_DRIVER" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignModalOrder(o);
                                  setActualWeightInput(o.totalKg);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#00880D] text-white font-bold cursor-pointer"
                              >
                                Tugaskan Driver
                              </button>
                            )}
                            {o.status === "ON_THE_WAY" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCompleteOrderAndAwardPoints(o)
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#059669] text-white font-bold cursor-pointer"
                              >
                                Selesai (+Poin)
                              </button>
                            )}
                            {o.status === "COMPLETED" && (
                              <span className="text-[#00880D] font-extrabold">
                                +{o.pointsAwarded} Pts
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              MENU 2: LIVE ORDER MOBILE & DISPATCH (CRUD TRANSAKSI MOBILE)
          ================================================================== */}
          {activeTab === "orders" && (
            <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#0F172A]">
                    Tabel Live Order &amp; Manual Dispatch Armada
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pantau pesanan warga dari aplikasi Flutter, tugaskan mitra driver, dan verifikasi timbangan aktual (Kg).
                  </p>
                </div>

                {/* Filter Status Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-extrabold">
                  {[
                    { id: "ALL", label: "Semua" },
                    { id: "SEARCHING_DRIVER", label: "Mencari Driver" },
                    { id: "ON_THE_WAY", label: "Dijemput" },
                    { id: "COMPLETED", label: "Selesai" },
                    { id: "CANCELLED", label: "Dibatalkan" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOrderFilter(tab.id)}
                      className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                        orderFilter === tab.id
                          ? "bg-[#00880D] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 text-xs uppercase">
                      <th className="py-3.5 px-4 font-extrabold">ID Order</th>
                      <th className="py-3.5 px-4 font-extrabold">Waktu</th>
                      <th className="py-3.5 px-4 font-extrabold">
                        Nama Warga &amp; Alamat
                      </th>
                      <th className="py-3.5 px-4 font-extrabold">Kategori</th>
                      <th className="py-3.5 px-4 font-extrabold">
                        Estimasi Berat (Kg)
                      </th>
                      <th className="py-3.5 px-4 font-extrabold">Mitra Driver</th>
                      <th className="py-3.5 px-4 font-extrabold">Status Badge</th>
                      <th className="py-3.5 px-4 font-extrabold text-right">
                        Tombol Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="py-4 px-4 font-mono font-black text-[#0F172A]">
                          {order.id}
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500 font-semibold whitespace-nowrap">
                          {order.time}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-[#0F172A]">
                            {order.citizenName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {order.address} (Kec. {order.district})
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-xs text-slate-800 block">
                            {order.category}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Org: {order.organicKg} Kg • Anorg: {order.anorganicKg}{" "}
                            Kg
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono font-black text-base text-[#00880D]">
                            {order.totalKg} Kg
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {order.driverName ? (
                            <div>
                              <div className="font-extrabold text-slate-900 text-xs">
                                {order.driverName}
                              </div>
                              <div className="font-mono text-[11px] text-slate-500">
                                {order.vehiclePlate}
                              </div>
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                              Menunggu Dispatch
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                              order.status === "SEARCHING_DRIVER"
                                ? "bg-amber-100 text-amber-800"
                                : order.status === "ON_THE_WAY"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "COMPLETED"
                                ? "bg-emerald-100 text-[#00880D]"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status === "SEARCHING_DRIVER" &&
                              "⏳ Mencari Driver"}
                            {order.status === "ON_THE_WAY" &&
                              "🚛 Menuju Lokasi"}
                            {order.status === "COMPLETED" && "✅ Selesai"}
                            {order.status === "CANCELLED" && "✖ Dibatalkan"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                          {order.status === "SEARCHING_DRIVER" && (
                            <button
                              type="button"
                              onClick={() => {
                                setAssignModalOrder(order);
                                setActualWeightInput(order.totalKg);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold shadow-xs cursor-pointer"
                            >
                              Tugaskan Driver
                            </button>
                          )}

                          {order.status === "ON_THE_WAY" && (
                            <button
                              type="button"
                              onClick={() => {
                                setAssignModalOrder(order);
                                setActualWeightInput(order.totalKg);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#00880D] text-white text-xs font-extrabold shadow-xs cursor-pointer"
                            >
                              Selesai (Tambah Poin)
                            </button>
                          )}

                          {(order.status === "SEARCHING_DRIVER" ||
                            order.status === "ON_THE_WAY") && (
                            <button
                              type="button"
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-2.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold cursor-pointer"
                              title="Batalkan Pesanan"
                            >
                              Batal
                            </button>
                          )}

                          {order.status === "COMPLETED" && (
                            <span className="text-xs font-extrabold text-[#00880D]">
                              +{order.pointsAwarded.toLocaleString("id-ID")} Poin
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              MENU 3: PETA MONITORING ARMADA & MANAJEMEN DRIVER (CRUD DRIVER)
          ================================================================== */}
          {activeTab === "fleet" && (
            <div className="space-y-6">
              {/* Interactive OpenStreetMap Bandar Lampung Fleet Map */}
              <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-[#0F172A]">
                      Peta Monitoring Armada &amp; Titik Order Bandar Lampung
                    </h2>
                    <p className="text-xs text-slate-500">
                      OpenStreetMap Real-Time GPS tanpa watermark • Menampilkan posisi Mitra Driver aktif &amp; titik jemput warga
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openAddDriverModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold shadow-md cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Tambah Mitra Driver Baru</span>
                  </button>
                </div>

                <div className="h-[430px] rounded-2xl overflow-hidden">
                  <LeafletMap
                    markers={fleetMapMarkers}
                    center={[-5.392, 105.262]}
                    zoom={13}
                    height="100%"
                  />
                </div>
              </div>

              {/* Fleet Driver Cards / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {drivers.map((drv) => {
                  const loadPct = Math.min(
                    100,
                    Math.round((drv.currentLoadKg / drv.maxCapacityKg) * 100)
                  );
                  return (
                    <div
                      key={drv.id}
                      className={`bg-[#FFFFFF] rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                        drv.isOnline
                          ? "border-slate-200 shadow-xs"
                          : "border-slate-200/60 opacity-70 bg-slate-50"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black ${
                                drv.isOnline ? "bg-[#00880D]" : "bg-slate-400"
                              }`}
                            >
                              <Truck className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-black text-sm text-[#0F172A]">
                                {drv.name}
                              </h4>
                              <span className="font-mono text-xs font-extrabold text-[#00880D] bg-[#00880D]/10 px-2 py-0.5 rounded-md">
                                {drv.plateNumber}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              drv.isOnline
                                ? "bg-emerald-100 text-[#00880D]"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {drv.isOnline ? "● Online" : "Offline"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              Jenis Armada
                            </span>
                            <span className="font-bold text-slate-800">
                              {drv.vehicleType}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              Zona Kecamatan
                            </span>
                            <span className="font-bold text-slate-800">
                              Kec. {drv.district}
                            </span>
                          </div>
                        </div>

                        {/* Load Capacity Progress Bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">
                              Kapasitas Muatan Saat Ini:
                            </span>
                            <span className="font-mono text-[#0F172A]">
                              {drv.currentLoadKg}/{drv.maxCapacityKg} Kg (
                              {loadPct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              style={{ width: `${loadPct}%` }}
                              className={`h-full rounded-full transition-all ${
                                loadPct > 85 ? "bg-amber-500" : "bg-[#00880D]"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            {drv.rating.toFixed(1)} Rating
                          </span>
                          <span>{drv.completedToday} Jemputan Hari Ini</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditDriverModal(drv)}
                          className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Armada</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDriverOnline(drv.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer ${
                            drv.isOnline
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-[#00880D] hover:bg-emerald-100"
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{drv.isOnline ? "Nonaktifkan" : "Aktifkan"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================
              MENU 4: MANAJEMEN POIN REWARD & PENUKARAN (CRUD REWARD)
          ================================================================== */}
          {activeTab === "rewards" && (
            <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#0F172A]">
                    Persetujuan Pencairan Poin Reward Warga (Ekonomi Sirkular)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kelola permintaan penukaran Poin MORPH dari aplikasi mobile menjadi Saldo Dompet Digital, Beras 5 Kg, atau Token PLN.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateNewRedemption}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Simulasi Klaim Reward Warga</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 text-xs uppercase">
                      <th className="py-3.5 px-4 font-extrabold">ID Klaim</th>
                      <th className="py-3.5 px-4 font-extrabold">
                        Warga &amp; Kecamatan
                      </th>
                      <th className="py-3.5 px-4 font-extrabold">
                        Item Reward Ditukar
                      </th>
                      <th className="py-3.5 px-4 font-extrabold">
                        Poin Dipotong
                      </th>
                      <th className="py-3.5 px-4 font-extrabold">
                        Nilai Setara
                      </th>
                      <th className="py-3.5 px-4 font-extrabold">Status</th>
                      <th className="py-3.5 px-4 font-extrabold text-right">
                        Otorisasi Admin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70">
                    {redemptions.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-4 px-4 font-mono font-black text-[#0F172A]">
                          {item.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-[#0F172A]">
                            {item.citizenName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.citizenPhone} • Kec. {item.district}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-extrabold text-slate-900 block">
                            {item.rewardTitle}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Kategori: {item.rewardCategory} • {item.requestedAt}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-black text-amber-600">
                          -{item.pointsCost.toLocaleString("id-ID")} Poin
                        </td>
                        <td className="py-4 px-4 font-extrabold text-[#00880D]">
                          Rp {item.equivalentRupiah.toLocaleString("id-ID")}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                              item.status === "DISETUJUI"
                                ? "bg-emerald-100 text-[#00880D]"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.status === "DISETUJUI"
                              ? "✓ Disetujui & Cair"
                              : "⏳ Menunggu Persetujuan"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {item.status === "MENUNGGU_PERSETUJUAN" ? (
                            <button
                              type="button"
                              onClick={() => handleApproveRedemption(item)}
                              className="px-4 py-2 rounded-xl bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold shadow-xs cursor-pointer"
                            >
                              Setujui Pencairan
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-slate-400">
                              Selesai Dicairkan
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              MENU 5: INBOX PENGAJUAN MITRA (TERHUBUNG DARI WEB PUBLIK TASK 1)
          ================================================================== */}
          {activeTab === "inbox" && (
            <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#0F172A]">
                    Inbox Pendaftaran Mitra Driver &amp; Kerjasama RT/RW
                  </h2>
                  <p className="text-xs text-slate-500">
                    Data tersinkronisasi langsung dari formulir pendaftaran di Halaman Publik (<code className="text-[#00880D] font-bold">localStorage: morph_inbox</code>)
                  </p>
                </div>

                <span className="px-3.5 py-1.5 rounded-full bg-[#00880D]/10 text-[#00880D] text-xs font-extrabold">
                  Total {inboxItems.length} Pengajuan Masuk
                </span>
              </div>

              <div className="space-y-4">
                {inboxItems.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    Belum ada pengajuan kemitraan di inbox.
                  </div>
                ) : (
                  inboxItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-[#00880D] bg-[#F8FAFC] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-400">
                            #{item.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#00880D]/10 text-[#00880D] text-xs font-extrabold">
                            {item.category}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                            Kecamatan {item.district}
                          </span>
                          {item.status === "DITERIMA_MITRA" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold">
                              ✓ Resmi Diterima Sebagai Mitra
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-black text-[#0F172A]">
                          {item.fullName}{" "}
                          <span className="text-xs font-semibold text-slate-500">
                            ({item.contact})
                          </span>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80">
                          &ldquo;{item.message}&rdquo;
                        </p>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                        {item.status !== "DITERIMA_MITRA" && (
                          <button
                            type="button"
                            onClick={() => handleApprovePartnerInbox(item)}
                            className="px-4 py-2.5 rounded-xl bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Terima sebagai Mitra</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteInboxItem(item.id)}
                          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          MODAL 1: TUGASKAN DRIVER / SELESAIKAN ORDER & INPUT BERAT AKTUAL
      ====================================================================== */}
      {assignModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#00880D]/10 text-[#00880D] text-xs font-extrabold">
                Dispatch Order #{assignModalOrder.id}
              </span>
              <h3 className="text-xl font-black text-[#0F172A] mt-2">
                {assignModalOrder.status === "SEARCHING_DRIVER"
                  ? "Tugaskan Mitra Driver ke Lokasi Warga"
                  : "Verifikasi Timbangan Aktual & Selesaikan Order"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {assignModalOrder.citizenName} • {assignModalOrder.address}
              </p>
            </div>

            {assignModalOrder.status === "SEARCHING_DRIVER" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                    Pilih Armada Driver Online Terdekat
                  </label>
                  <select
                    value={selectedDriverIdForOrder}
                    onChange={(e) =>
                      setSelectedDriverIdForOrder(e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-[#0F172A] bg-white"
                  >
                    {drivers
                      .filter((d) => d.isOnline)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.plateNumber}) — Kec. {d.district} [Muatan{" "}
                          {d.currentLoadKg}/{d.maxCapacityKg} Kg]
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleAssignDriverToOrder(
                        assignModalOrder,
                        selectedDriverIdForOrder
                      )
                    }
                    className="flex-1 py-3 rounded-full bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Luncurkan Driver Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignModalOrder(null)}
                    className="px-5 py-3 rounded-full bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2">
                    Berat Sampah Aktual Hasil Timbangan Driver (Kg)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={actualWeightInput}
                    onChange={(e) =>
                      setActualWeightInput(Number(e.target.value))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-mono font-black text-[#00880D]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Otomatis menambah grafik tonase sampah &amp; mengirim{" "}
                    <strong className="text-[#00880D]">
                      +{(actualWeightInput * 100).toLocaleString("id-ID")} Poin
                    </strong>{" "}
                    ke dompet aplikasi mobile warga.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCompleteOrderAndAwardPoints(
                        assignModalOrder,
                        actualWeightInput
                      )
                    }
                    className="flex-1 py-3 rounded-full bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Konfirmasi Selesai &amp; Kirim Poin
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignModalOrder(null)}
                    className="px-5 py-3 rounded-full bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: TAMBAH / EDIT ARMADA DRIVER
      ====================================================================== */}
      {showDriverModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDriver}
            className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4"
          >
            <h3 className="text-xl font-black text-[#0F172A]">
              {editingDriver
                ? `Edit Armada ${editingDriver.name}`
                : "Tambah Mitra Driver Baru"}
            </h3>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                Nama Lengkap Driver
              </label>
              <input
                type="text"
                required
                value={drvName}
                onChange={(e) => setDrvName(e.target.value)}
                placeholder="Contoh: Hendra Wijaya"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Plat Nomor Armada
                </label>
                <input
                  type="text"
                  required
                  value={drvPlate}
                  onChange={(e) => setDrvPlate(e.target.value)}
                  placeholder="BE 4521 YX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  No. WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={drvPhone}
                  onChange={(e) => setDrvPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Jenis Kendaraan
                </label>
                <select
                  value={drvVehicle}
                  onChange={(e) =>
                    setDrvVehicle(
                      e.target.value as FleetDriver["vehicleType"]
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Motor Gerobak">Motor Gerobak</option>
                  <option value="Motor Listrik">Motor Listrik</option>
                  <option value="Pickup Box">Pickup Box</option>
                  <option value="Truk Mini">Truk Mini</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Kecamatan
                </label>
                <select
                  value={drvDistrict}
                  onChange={(e) => setDrvDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Kedaton">Kedaton</option>
                  <option value="Sukarame">Sukarame</option>
                  <option value="Rajabasa">Rajabasa</option>
                  <option value="Way Halim">Way Halim</option>
                  <option value="Enggal">Enggal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Muatan Saat Ini (Kg)
                </label>
                <input
                  type="number"
                  min={0}
                  value={drvLoad}
                  onChange={(e) => setDrvLoad(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  Kapasitas Maks (Kg)
                </label>
                <input
                  type="number"
                  min={10}
                  value={drvMaxCap}
                  onChange={(e) => setDrvMaxCap(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-full bg-[#00880D] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer"
              >
                Simpan Data Armada
              </button>
              <button
                type="button"
                onClick={() => setShowDriverModal(false)}
                className="px-5 py-3 rounded-full bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
