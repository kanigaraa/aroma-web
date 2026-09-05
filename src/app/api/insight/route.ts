import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

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
  const GROQ_KEY = process.env.GROQ_API_KEY;
  const GROQ_MODEL = process.env.GROQ_MODEL ?? "qwen/qwen3-8b";
  if (!GROQ_KEY) return NextResponse.json({ text: null, error: "no key" }, { status: 500 });

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text: string | undefined = data?.choices?.[0]?.message?.content;

    if (!text) return NextResponse.json({ text: null, error: "groq empty" }, { status: 502 });

    // 4) Simpan cache (sinkron, best-effort)
    await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => {});
    await fs.writeFile(file, JSON.stringify({ text, at: new Date().toISOString() })).catch(() => {});

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ text: null, error: (e as Error).message }, { status: 500 });
  }
}
