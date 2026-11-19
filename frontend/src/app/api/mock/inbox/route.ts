import { NextResponse } from "next/server";

export interface InboxSubmission {
  id: string;
  fullName: string;
  contact: string;
  category: string;
  district: string;
  message: string;
  status: "BARU" | "DIPROSES" | "SELESAI";
  createdAt: string;
}

// In-memory store for serverless preview (complemented by localStorage 'morph_inbox' on client)
const memoryInbox: InboxSubmission[] = [
  {
    id: "INB-BDL-101",
    fullName: "Hendra Wijaya (Ketua RT 04)",
    contact: "0812-7788-9900",
    category: "Kerjasama RT-RW",
    district: "Way Halim",
    message:
      "Pengajuan integrasi penjemputan sampah terjadwal untuk 85 KK di lingkungan RT 04 Kelurahan Way Halim Permai.",
    status: "BARU",
    createdAt: "2026-10-28T08:30:00.000Z",
  },
  {
    id: "INB-BDL-102",
    fullName: "Ahmad Fauzi",
    contact: "0853-6611-2233",
    category: "Daftar Driver",
    district: "Kedaton",
    message:
      "Ingin bergabung sebagai Mitra Driver armada Motor Roda Tiga / Pickup area Kedaton dan Rajabasa.",
    status: "DIPROSES",
    createdAt: "2026-10-28T09:15:00.000Z",
  },
];

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: memoryInbox,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEntry: InboxSubmission = {
      id: body.id || `INB-BDL-${Math.floor(100 + Math.random() * 900)}`,
      fullName: body.fullName || "Anonim",
      contact: body.contact || "-",
      category: body.category || "Pertanyaan Umum",
      district: body.district || "Kedaton",
      message: body.message || "",
      status: "BARU",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    memoryInbox.unshift(newEntry);

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
