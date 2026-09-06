import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Ringkasan AI tidak tersedia." }, { status: 410 });
}
