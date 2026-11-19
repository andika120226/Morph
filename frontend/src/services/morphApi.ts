import { MobileOrder, FleetDriver, INITIAL_MOBILE_ORDERS, INITIAL_DRIVERS } from "@/lib/morphStore";

const NEST_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface MorphSyncSnapshot {
  orders: MobileOrder[];
  drivers: FleetDriver[];
  wargaPointsBalance: number;
  source: "NESTJS_BACKEND" | "NEXT_MOCK_BRIDGE";
}

/**
 * Service API Terpusat Next.js (morphApi.ts)
 * Menghubungkan Admin Dashboard Next.js dengan NestJS (/api/orders)
 * serta memiliki fallback otomatis ke Next.js API Route (/api/mobile/orders)
 */
export const morphApi = {
  // 1. Ambil seluruh pesanan & status armada (Digunakan untuk auto-polling 3 detik di Admin)
  async fetchLiveEcosystemData(): Promise<MorphSyncSnapshot> {
    try {
      const res = await fetch(`${NEST_API_BASE}/api/orders`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        const mappedOrders: MobileOrder[] = (json.data || []).map((o: any) => ({
          id: o.id,
          time: o.createdAt
            ? new Date(o.createdAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }) + " WIB"
            : "Baru saja",
          citizenName: o.citizenName || "Keluarga Budi Santoso",
          citizenPhone: "0812-7741-9021",
          address: o.addressText || "Jl. ZA. Pagar Alam, Kedaton",
          district: o.district || "Kedaton",
          category: o.category === "ANORGANIK" ? "Anorganik" : "Organik",
          organicKg:
            o.category === "ORGANIK"
              ? Number(o.actualWeightKg ?? o.estimatedWeightKg ?? 5)
              : 0,
          anorganicKg:
            o.category === "ANORGANIK"
              ? Number(o.actualWeightKg ?? o.estimatedWeightKg ?? 5)
              : 0,
          totalKg: Number(o.actualWeightKg ?? o.estimatedWeightKg ?? 5),
          driverId: o.driverId || null,
          driverName: o.driverName || null,
          vehiclePlate: o.driverPlate || null,
          status:
            o.status === "SEARCHING"
              ? "SEARCHING_DRIVER"
              : o.status === "ACCEPTED" || o.status === "ON_THE_WAY"
              ? "ON_THE_WAY"
              : o.status === "COMPLETED"
              ? "COMPLETED"
              : "CANCELLED",
          pointsAwarded: Number(o.pointsEarned ?? 50),
          latitude: Number(o.pickupLat ?? -5.3824),
          longitude: Number(o.pickupLng ?? 105.2586),
        }));

        return {
          orders: mappedOrders.length > 0 ? mappedOrders : INITIAL_MOBILE_ORDERS,
          drivers: INITIAL_DRIVERS,
          wargaPointsBalance: Number(json.wargaPointsBalance ?? 1250),
          source: "NESTJS_BACKEND",
        };
      }
    } catch {
      // Fallback otomatis ke Next.js In-Memory Mock API (/api/mobile/orders)
    }

    try {
      const mockRes = await fetch("/api/mobile/orders", { cache: "no-store" });
      if (mockRes.ok) {
        const mockJson = await mockRes.json();
        return {
          orders:
            Array.isArray(mockJson.data) && mockJson.data.length > 0
              ? mockJson.data
              : INITIAL_MOBILE_ORDERS,
          drivers: INITIAL_DRIVERS,
          wargaPointsBalance: 1250,
          source: "NEXT_MOCK_BRIDGE",
        };
      }
    } catch {
      // Fallback ke seed data
    }

    return {
      orders: INITIAL_MOBILE_ORDERS,
      drivers: INITIAL_DRIVERS,
      wargaPointsBalance: 1250,
      source: "NEXT_MOCK_BRIDGE",
    };
  },

  // 2. Buat Order Baru (POST /api/orders -> fallback /api/mobile/orders)
  async createOrder(payload: {
    id?: string;
    citizenName: string;
    category: "ORGANIK" | "ANORGANIK";
    estimatedWeightKg: number;
    pickupLat: number;
    pickupLng: number;
    addressText: string;
    district?: string;
  }) {
    try {
      const res = await fetch(`${NEST_API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback ke Next.js mock endpoint
    }

    const fallbackRes = await fetch("/api/mobile/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: payload.id,
        citizenName: payload.citizenName,
        address: payload.addressText,
        district: payload.district || "Kedaton",
        category: payload.category === "ANORGANIK" ? "Anorganik" : "Organik",
        organicKg:
          payload.category === "ORGANIK" ? payload.estimatedWeightKg : 0,
        anorganicKg:
          payload.category === "ANORGANIK" ? payload.estimatedWeightKg : 0,
        totalKg: payload.estimatedWeightKg,
        latitude: payload.pickupLat,
        longitude: payload.pickupLng,
      }),
    });
    return fallbackRes.json();
  },

  // 3. Terima / Tugaskan Driver (PATCH /api/orders/:id/accept)
  async acceptOrder(
    orderId: string,
    driverInfo: { driverId: string; driverName: string; plateNumber: string }
  ) {
    try {
      const res = await fetch(`${NEST_API_BASE}/api/orders/${orderId}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverInfo),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback ke /api/mobile/orders
    }

    const fallbackRes = await fetch("/api/mobile/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        status: "ON_THE_WAY",
        driverId: driverInfo.driverId,
        driverName: driverInfo.driverName,
        vehiclePlate: driverInfo.plateNumber,
      }),
    });
    return fallbackRes.json();
  },

  // 4. Selesaikan Penjemputan & Timbang Berat Aktual (PATCH /api/orders/:id/complete)
  async completeOrder(orderId: string, actualWeightKg: number) {
    try {
      const res = await fetch(
        `${NEST_API_BASE}/api/orders/${orderId}/complete`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actualWeightKg }),
        }
      );
      if (res.ok) return await res.json();
    } catch {
      // Fallback ke /api/mobile/orders
    }

    const fallbackRes = await fetch("/api/mobile/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        status: "COMPLETED",
        totalKg: actualWeightKg,
      }),
    });
    return fallbackRes.json();
  },
};
