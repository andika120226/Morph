import { NextResponse } from "next/server";
import { PartnerInboxItem } from "@/lib/morphStore";
import { morphHybridStore } from "@/lib/supabase";

export async function GET() {
  const data = await morphHybridStore.getInbox();
  return NextResponse.json({
    status: "success",
    data,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEntry: PartnerInboxItem = {
      id: body.id || `INB-BDL-${Math.floor(100 + Math.random() * 900)}`,
      fullName: body.fullName || "Anonim",
      contact: body.contact || "-",
      category: body.category || "Pertanyaan Umum",
      district: body.district || "Kedaton",
      message: body.message || "",
      status: "BARU",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    await morphHybridStore.insertInbox(newEntry);

    return NextResponse.json(
      {
        status: "success",
        message: "Pengajuan berhasil diterima oleh sistem MORPH.",
        data: newEntry,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: "Format data pengajuan tidak valid.",
      },
      { status: 400 }
    );
  }
}
