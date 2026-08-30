import { NextResponse } from "next/server";
import { getMeta, getKomoditasProcessed, getKomoditasForecast, getInsight } from "@/lib/data";

export const runtime = "nodejs";

const API = "https://api.groq.com/openai/v1/chat/completions";

function buildContext(): string {
  const meta = getMeta();
  const parts: string[] = [];
  meta.komoditas.forEach((k) => {
    const p = getKomoditasProcessed(k.slug);
    const fc = getKomoditasForecast(k.slug);
    const last = p.seri[p.seri.length - 1];
    const prev = p.seri[p.seri.length - 2];
    const vals = last ? Object.values(last.data) : [];
    const avg = vals.length
      ? Math.round(vals.reduce((a, v) => a + (v.harga ?? 0), 0) / vals.length).toLocaleString("id-ID")
      : "-";

    // tren 7 hari: % perubahan harga rata-rata
    const avgOf = (s: typeof last) =>
      s ? Math.round(Object.values(s.data).reduce((a, v) => a + (v.harga ?? 0), 0) / Object.values(s.data).length) : null;
    const cur = avgOf(last);
    const wk = avgOf(prev);
    const tren = cur != null && wk != null && wk > 0 ? Math.round(((cur - wk) / wk) * 100) : 0;
    const arah = tren > 1 ? `naik ${tren}% 7 hari` : tren < -1 ? `turun ${Math.abs(tren)}% 7 hari` : "stabil 7 hari";

    // forecast 14 hari: % perubahan prediksi hari terakhir vs harga terakhir
    let forecastTxt = "tidak ada forecast";
    const prov0 = Object.keys(fc.provinsi)[0];
    const seri = prov0 ? fc.provinsi[prov0].seri : [];
    const future = seri.filter((f) => f.is_future);
    const lastHist = seri.filter((f) => !f.is_future).at(-1);
    const base = lastHist?.forecast;
    const end = future.at(-1)?.forecast;
    if (base && end && base > 0) {
      const fpct = Math.round(((end - base) / base) * 100);
      forecastTxt = `diprediksi ${fpct > 0 ? `naik ${fpct}%` : fpct < 0 ? `turun ${Math.abs(fpct)}%` : "stabil"} 14 hari (prov ${prov0})`;
    }

    // cuaca: korelasi hujan & suhu (kekuatan + arah)
    let cuacaTxt = "tidak ada data cuaca";
    const ins = getInsight().find((i) => i.komoditas === k.slug);
    const samp = ins?.provinsi[0];
    if (samp && (samp.r_hujan_harian != null || samp.r_suhu_harian != null)) {
      const rh = samp.r_hujan_harian;
      const rs = samp.r_suhu_harian;
      const huj = rh == null ? "-" : `${Math.abs(rh) >= 0.5 ? "kuat" : Math.abs(rh) >= 0.3 ? "sedang" : "lemah"} ${rh >= 0 ? "positif" : "negatif"}`;
      const suh = rs == null ? "-" : `${Math.abs(rs) >= 0.5 ? "kuat" : Math.abs(rs) >= 0.3 ? "sedang" : "lemah"} ${rs >= 0 ? "positif" : "negatif"}`;
      cuacaTxt = `korelasi hujan ${huj}, suhu ${suh} (prov ${samp.provinsi})`;
    }

    parts.push(
      `${k.nama}: harga rata-rata Rp ${avg} (${arah}); ${forecastTxt}; ${cuacaTxt}`
    );
  });
  return [
    `AROMA = dashboard analisis harga pangan Indonesia.`,
    `Dipantau: ${meta.komoditas.length} komoditas, ${meta.provinsi.length} provinsi. Satuan harga per kg sesuai sumber PIHPS.`,
    `Korelasi cuaca: angka positif = saat hujan/suhu naik harga cenderung naik; negatif = sebaliknya.`,
    `Detail tiap komoditas:`,
    ...parts,
  ].join("\n");
}

export async function POST(req: Request) {
  const key = process.env.GROQ_API_KEY;
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
        model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
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
