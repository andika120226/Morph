import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  MobileOrder,
  FleetDriver,
  PartnerInboxItem,
  INITIAL_MOBILE_ORDERS,
  INITIAL_DRIVERS,
  INITIAL_PARTNER_INBOX,
  morphServerStore,
} from "./morphStore";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl.startsWith("http");

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * HYBRID STORE (Cloud Supabase PostgreSQL <-> In-Memory + LocalStorage Dummy Fallback)
 * Jika NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY diisi, baca/tulis dari Supabase.
 * Jika belum diisi atau terjadi kendala jaringan, otomatis gunakan In-Memory & LocalStorage Dummy Data.
 */
export const morphHybridStore = {
  // =========================================================================
  // 1. ORDERS (morph_orders)
  // =========================================================================
  async getOrders(): Promise<MobileOrder[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("morph_orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            time: row.time || "Live Sync",
            citizenName: row.citizen_name || "Warga Bandar Lampung",
            citizenPhone: row.citizen_phone || "0812-7741-9021",
            address: row.address || "Jl. ZA. Pagar Alam, Kedaton",
            district: row.district || "Kedaton",
            category: row.category || "Organik",
            organicKg: Number(row.organic_kg ?? 5),
            anorganicKg: Number(row.anorganic_kg ?? 0),
            totalKg: Number(row.total_kg ?? 5),
            driverId: row.driver_id || null,
            driverName: row.driver_name || null,
            vehiclePlate: row.vehicle_plate || null,
            status: row.status || "SEARCHING_DRIVER",
            pointsAwarded: Number(row.points_awarded ?? 50),
            latitude: Number(row.latitude ?? -5.3824),
            longitude: Number(row.longitude ?? 105.2586),
          }));
        }
      } catch {
        // Fallback otomatis ke In-Memory Store
      }
    }
    return morphServerStore.orders.length > 0
      ? morphServerStore.orders
      : INITIAL_MOBILE_ORDERS;
  },

  async upsertOrder(order: MobileOrder): Promise<MobileOrder> {
    if (supabase) {
      try {
        await supabase.from("morph_orders").upsert({
          id: order.id,
          time: order.time,
          citizen_name: order.citizenName,
          citizen_phone: order.citizenPhone,
          address: order.address,
          district: order.district,
          category: order.category,
          organic_kg: order.organicKg,
          anorganic_kg: order.anorganicKg,
          total_kg: order.totalKg,
          driver_id: order.driverId,
          driver_name: order.driverName,
          vehicle_plate: order.vehiclePlate,
          status: order.status,
          points_awarded: order.pointsAwarded,
          latitude: order.latitude,
          longitude: order.longitude,
        });
      } catch {
        // Fallback ke In-Memory Store
      }
    }

    const idx = morphServerStore.orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      morphServerStore.orders[idx] = order;
    } else {
      morphServerStore.orders.unshift(order);
    }
    return order;
  },

  // =========================================================================
  // 2. DRIVERS (morph_drivers)
  // =========================================================================
  async getDrivers(): Promise<FleetDriver[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("morph_drivers")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            name: row.name,
            phone: row.phone || "0812-7210-4411",
            plateNumber: row.plate_number || "BE 4521 YX",
            vehicleType: row.vehicle_type || "Motor Gerobak",
            district: row.district || "Kedaton",
            currentLoadKg: Number(row.current_load_kg ?? 35),
            maxCapacityKg: Number(row.max_capacity_kg ?? 100),
            rating: Number(row.rating ?? 4.9),
            isOnline: Boolean(row.is_online ?? true),
            completedToday: Number(row.completed_today ?? 5),
            latitude: Number(row.latitude ?? -5.3824),
            longitude: Number(row.longitude ?? 105.2586),
          }));
        }
      } catch {
        // Fallback ke In-Memory Store
      }
    }
    return morphServerStore.drivers.length > 0
      ? morphServerStore.drivers
      : INITIAL_DRIVERS;
  },

  async upsertDriver(driver: FleetDriver): Promise<FleetDriver> {
    if (supabase) {
      try {
        await supabase.from("morph_drivers").upsert({
          id: driver.id,
          name: driver.name,
          phone: driver.phone,
          plate_number: driver.plateNumber,
          vehicle_type: driver.vehicleType,
          district: driver.district,
          current_load_kg: driver.currentLoadKg,
          max_capacity_kg: driver.maxCapacityKg,
          rating: driver.rating,
          is_online: driver.isOnline,
          completed_today: driver.completedToday,
          latitude: driver.latitude,
          longitude: driver.longitude,
        });
      } catch {
        // Fallback ke In-Memory Store
      }
    }

    const idx = morphServerStore.drivers.findIndex((d) => d.id === driver.id);
    if (idx >= 0) {
      morphServerStore.drivers[idx] = driver;
    } else {
      morphServerStore.drivers.unshift(driver);
    }
    return driver;
  },

  // =========================================================================
  // 3. INBOX KEMITRAAN (morph_inbox)
  // =========================================================================
  async getInbox(): Promise<PartnerInboxItem[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("morph_inbox")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            fullName: row.full_name,
            contact: row.contact,
            category: row.category || "Kerjasama RT-RW",
            district: row.district || "Kedaton",
            message: row.message || "",
            status: row.status === "DITERIMA_MITRA" ? "DITERIMA_MITRA" : "BARU",
            createdAt: row.created_at || new Date().toISOString(),
          }));
        }
      } catch {
        // Fallback ke In-Memory Store
      }
    }
    return morphServerStore.inbox.length > 0
      ? morphServerStore.inbox
      : INITIAL_PARTNER_INBOX;
  },

  async insertInbox(item: PartnerInboxItem): Promise<PartnerInboxItem> {
    if (supabase) {
      try {
        await supabase.from("morph_inbox").upsert({
          id: item.id,
          full_name: item.fullName,
          contact: item.contact,
          category: item.category,
          district: item.district,
          message: item.message,
          status: item.status,
        });
      } catch {
        // Fallback ke In-Memory Store
      }
    }

    morphServerStore.inbox.unshift(item);
    return item;
  },
};
