import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";

type Body = { rows?: { nama: string; avg: number | null; dir: number; delta: number; status: string }[]; lastTanggal?: string; provinsi?: string[] };
type GroqResponse = { choices?: { message?: { content?: string } }[] };

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
  const bytes = new TextEncoder().encode(
    JSON.stringify(rows.map((r) => [r.nama, r.avg, r.dir, r.status]))
  );
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hash = Array.from(new Uint8Array(digest).slice(0, 6), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  const key = `${lastTanggal}-${hash}`;
  const cache = (caches as CacheStorage & { default: Cache }).default;
  const cacheKey = new Request(`https://aroma-cache.invalid/insight/${encodeURIComponent(key)}`);

  const cached = await cache.match(cacheKey);
  if (cached) {
    return NextResponse.json(await cached.json());
  }

  // 2) Bangun daftar konteks utk AI
  const list = rows
    .map((r) => `${r.nama}: Rp${r.avg ?? "?"}, status ${r.status}, ${r.dir > 0 ? "naik" : r.dir < 0 ? "turun" : "stabil"}`)
    .join("\n");

  const prompt = `Kamu adalah asisten analisis harga pangan Indonesia. Ringkas kondisi harga pangan hari ini (${lastTanggal}) dalam 2-3 kalimat untuk pembaca umum (bukan analis data), dalam Bahasa Indonesia, informatif dan natural. Jangan menyebutkan istilah teknis seperti zscore atau persentase mentah. Fokus pada hal paling menonjol: komoditas berstatus waspada/tinggi, serta yang naik/turun paling besar. Jangan menyebutkan semua komoditas — pilih yang paling relevan. Mulai langsung dengan kalimat pertama, tanpa kata pengantar.\n\nData (${provinsi.length} provinsi):\n${list}`;

  // 3) Panggil GROQ
  const GROQ_KEY = env.GROQ_API_KEY;
  const GROQ_MODEL = env.GROQ_MODEL;
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
    const data = await res.json() as GroqResponse;
    const text: string | undefined = data?.choices?.[0]?.message?.content;

    if (!text) return NextResponse.json({ text: null, error: "groq empty" }, { status: 502 });

    await cache.put(
      cacheKey,
      Response.json(
        { text },
        { headers: { "Cache-Control": "public, max-age=86400" } }
      )
    );

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ text: null, error: (e as Error).message }, { status: 500 });
  }
}
