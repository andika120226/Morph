import { NextResponse } from "next/server";
import { morphServerStore } from "@/lib/morphStore";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      status: "active",
      bridge: "MORPH Mobile Sync API Bridge",
      region: "Bandar Lampung",
      ordersCount: morphServerStore.orders.length,
      driversCount: morphServerStore.drivers.length,
      orders: morphServerStore.orders,
      drivers: morphServerStore.drivers,
      redemptions: morphServerStore.redemptions,
    },
    { headers: CORS_HEADERS }
  );
}
