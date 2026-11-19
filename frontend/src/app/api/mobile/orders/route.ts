import { NextResponse } from "next/server";
import { morphServerStore, MobileOrder } from "@/lib/morphStore";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  return NextResponse.json(
    {
      status: "success",
      syncEngine: "MORPH Mobile Sync API v2.0",
      count: morphServerStore.orders.length,
      data: morphServerStore.orders,
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const organicKg = Number(body.organicKg ?? 8);
    const anorganicKg = Number(body.anorganicKg ?? 7);
    const totalKg = Number(body.totalKg ?? organicKg + anorganicKg);

    const newOrder: MobileOrder = {
      id: body.id || `MRP-${Math.floor(8822 + Math.random() * 1000)}`,
      time: body.time || "Baru saja",
      citizenName: body.citizenName || "Warga Bandar Lampung",
      citizenPhone: body.citizenPhone || "0812-8890-1122",
      address: body.address || "Jl. ZA. Pagar Alam, Kedaton",
      district: body.district || "Kedaton",
      category:
        body.category ||
        (organicKg > 0 && anorganicKg > 0
          ? "Campuran (Organik & Anorganik)"
          : organicKg > 0
          ? "Organik"
          : "Anorganik"),
      organicKg,
      anorganicKg,
      totalKg,
      driverId: body.driverId || null,
      driverName: body.driverName || null,
      vehiclePlate: body.vehiclePlate || null,
      status: body.status || "SEARCHING_DRIVER",
      pointsAwarded: Math.round(totalKg * 10),
      latitude: Number(body.latitude ?? -5.3824),
      longitude: Number(body.longitude ?? 105.2586),
    };

    morphServerStore.orders.unshift(newOrder);

    return NextResponse.json(
      {
        status: "success",
        message: "Order penjemputan dari Mobile App berhasil terdaftar.",
        data: newOrder,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Payload order tidak valid." },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, driverId, driverName, vehiclePlate, totalKg } = body;

    const index = morphServerStore.orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return NextResponse.json(
        { status: "error", message: "Order tidak ditemukan." },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const existing = morphServerStore.orders[index];
    const updatedWeight = totalKg !== undefined ? Number(totalKg) : existing.totalKg;

    const updated: MobileOrder = {
      ...existing,
      status: status ?? existing.status,
      driverId: driverId !== undefined ? driverId : existing.driverId,
      driverName: driverName !== undefined ? driverName : existing.driverName,
      vehiclePlate:
        vehiclePlate !== undefined ? vehiclePlate : existing.vehiclePlate,
      totalKg: updatedWeight,
      pointsAwarded: Math.round(updatedWeight * 10),
    };

    morphServerStore.orders[index] = updated;

    return NextResponse.json(
      {
        status: "success",
        message: `Order ${id} berhasil diperbarui ke status ${updated.status}.`,
        data: updated,
      },
      { headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Gagal memperbarui order." },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Parameter id wajib disertakan." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    morphServerStore.orders = morphServerStore.orders.filter((o) => o.id !== id);

    return NextResponse.json(
      {
        status: "success",
        message: `Order ${id} berhasil dihapus.`,
      },
      { headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Gagal menghapus order." },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
