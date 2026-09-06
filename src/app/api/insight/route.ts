import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { AIError, completeChat } from "@/lib/groq";

// Ringkasan Hari Ini — hasil LLM di-cache per (tanggal + hash data).
// Satu panggilan GROQ per kombinasi data; refresh berulang tidak memanggil AI lagi.
const CACHE_DIR = path.join(process.cwd(), ".cache", "insight");

type Body = { rows?: { nama: string; avg: number | null; dir: number; delta: number; status: string }[]; lastTanggal?: string; provinsi?: string[] };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ text: null, error: "bad json" }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  const lastTanggal = body.lastTanggal ?? "terbaru";
  const provinsi = Array.isArray(body.provinsi) ? body.provinsi : [];

  // Kunci cache: tanggal + hash ringkas baris data (semua komoditas)
  const hash = createHash("sha1")
    .update(JSON.stringify(rows.map((r) => [r.nama, r.avg, r.dir, r.status])))
    .digest("hex")
    .slice(0, 12);
  const key = `${lastTanggal}-${hash}`;
  const file = path.join(CACHE_DIR, `${key}.json`);

  // 1) Cek cache
  try {
    const cached = JSON.parse(await fs.readFile(file, "utf8"));
    return NextResponse.json({ text: cached.text });
  } catch {
    /* cache miss — hitung ulang */
  }

  // 2) Bangun daftar konteks utk AI
  const list = rows
    .map((r) => `${r.nama}: Rp${r.avg ?? "?"}, status ${r.status}, ${r.dir > 0 ? "naik" : r.dir < 0 ? "turun" : "stabil"}`)
    .join("\n");

  const prompt = `Kamu adalah asisten analisis harga pangan Indonesia. Ringkas kondisi harga pangan hari ini (${lastTanggal}) dalam 2-3 kalimat untuk pembaca umum (bukan analis data), dalam Bahasa Indonesia, informatif dan natural. Jangan menyebutkan istilah teknis seperti zscore atau persentase mentah. Fokus pada hal paling menonjol: komoditas berstatus waspada/tinggi, serta yang naik/turun paling besar. Jangan menyebutkan semua komoditas — pilih yang paling relevan. Mulai langsung dengan kalimat pertama, tanpa kata pengantar.\n\nData (${provinsi.length} provinsi):\n${list}`;

  // 3) Panggil GROQ
  try {
    const text = await completeChat([{ role: "user", content: prompt }]);

    // 4) Simpan cache (sinkron, best-effort)
    await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => {});
    await fs.writeFile(file, JSON.stringify({ text, at: new Date().toISOString() })).catch(() => {});

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ text: null, error: e instanceof AIError ? e.message : "Gagal memproses ringkasan." },
      { status: e instanceof AIError ? e.status : 500 });
  }
}
