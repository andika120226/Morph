import { NextResponse } from "next/server";
import { morphServerStore, FleetDriver } from "@/lib/morphStore";

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
      syncEngine: "MORPH Fleet Sync API v2.0",
      count: morphServerStore.drivers.length,
      data: morphServerStore.drivers,
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDriver: FleetDriver = {
      id: body.id || `DRV-${Math.floor(10 + Math.random() * 90)}`,
      name: body.name || "Mitra Driver Baru",
      phone: body.phone || "0812-7700-0000",
      plateNumber: body.plateNumber || "BE 9001 YX",
      vehicleType: body.vehicleType || "Motor Gerobak",
      district: body.district || "Kedaton",
      currentLoadKg: Number(body.currentLoadKg ?? 0),
      maxCapacityKg: Number(body.maxCapacityKg ?? 100),
      rating: Number(body.rating ?? 5.0),
      isOnline: body.isOnline !== undefined ? Boolean(body.isOnline) : true,
      completedToday: Number(body.completedToday ?? 0),
      latitude: Number(body.latitude ?? -5.3824),
      longitude: Number(body.longitude ?? 105.2586),
    };

    morphServerStore.drivers.unshift(newDriver);

    return NextResponse.json(
      {
        status: "success",
        message: "Armada driver berhasil ditambahkan.",
        data: newDriver,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Data driver tidak valid." },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = morphServerStore.drivers.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json(
        { status: "error", message: "Driver tidak ditemukan." },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    morphServerStore.drivers[index] = {
      ...morphServerStore.drivers[index],
      ...updates,
    };

    return NextResponse.json(
      {
        status: "success",
        message: `Data driver ${id} berhasil diperbarui.`,
        data: morphServerStore.drivers[index],
      },
      { headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Gagal memperbarui driver." },
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

    morphServerStore.drivers = morphServerStore.drivers.filter(
      (d) => d.id !== id
    );

    return NextResponse.json(
      {
        status: "success",
        message: `Driver ${id} berhasil dihapus.`,
      },
      { headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Gagal menghapus driver." },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
