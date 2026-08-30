import { NextResponse } from "next/server";
import { getMeta, getKomoditasProcessed, getKomoditasForecast, getInsight } from "@/lib/data";

export const runtime = "nodejs";

const API = "https://openrouter.ai/api/v1/chat/completions";

function buildContext(): string {
  const meta = getMeta();
  const komoditas = meta.komoditas.map((k) => {
    const p = getKomoditasProcessed(k.slug);
    const last = p.seri[p.seri.length - 1];
    const vals = last ? Object.values(last.data) : [];
    const avg = vals.length
      ? Math.round(vals.reduce((a, v) => a + (v.harga ?? 0), 0) / vals.length).toLocaleString("id-ID")
      : "-";
    return `${k.nama}: harga rata-rata Rp ${avg}`;
  });
  const prov = meta.provinsi.length;
  const insights = getInsight()
    .map((i) => `${i.nama}: ${i.provinsi.slice(0, 3).map((p) => p.provinsi).join(", ") || "nasional"}`)
    .slice(0, 5);
  return [
    `AROMA = dashboard analisis harga pangan Indonesia.`,
    `Dipantau: ${meta.komoditas.length} komoditas, ${prov} provinsi.`,
    `Harga terkini: ${komoditas.join("; ")}.`,
    `Insight: ${insights.join("; ")}.`,
  ].join("\n");
}

export async function POST(req: Request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "AI belum dikonfigurasi." }, { status: 500 });
  }
  try {
    const { messages } = await req.json();
    const sys = [
      "Kamu asisten data harga pangan AROMA. Jawab dalam Bahasa Indonesia, ringkas, faktual, pakai angka dari data yang diberikan.",
      "Kalau data tak mendukung, bilang jujur 'tidak ada data itu'. Jangan mengarang.",
      buildContext(),
    ].join("\n\n");
    const r = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [{ role: "system", content: sys }, ...messages],
        max_tokens: 500,
      }),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => null);
      return NextResponse.json(
        { error: e?.error?.message || "Layanan AI sedang sibuk, coba lagi." },
        { status: 502 }
      );
    }
    const d = await r.json();
    const text = d.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Gagal memproses permintaan." }, { status: 500 });
  }
}
