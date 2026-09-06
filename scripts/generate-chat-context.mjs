import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));
const meta = read("data/processed/meta.json");
const insight = read("data/insight/cuaca.json");
const average = (row) => {
  const prices = Object.values(row?.data ?? {}).map((v) => v.harga).filter((v) => Number.isFinite(v) && v > 0);
  return prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
};

const commodities = meta.komoditas.map((commodity) => {
  const data = read(`data/processed/${commodity.slug}.json`);
  const forecast = read(`data/forecast/${commodity.slug}.json`);
  const latest = data.seri.at(-1);
  const weekAgo = latest ? new Date(`${latest.tanggal}T00:00:00Z`) : null;
  weekAgo?.setUTCDate(weekAgo.getUTCDate() - 7);
  const previous = data.seri.find((row) => row.tanggal === weekAgo?.toISOString().slice(0, 10));
  return {
    nama: commodity.nama,
    satuan: commodity.satuan,
    tanggal: latest?.tanggal ?? null,
    rata_rata: average(latest),
    rata_rata_7_hari_lalu: average(previous),
    harga_provinsi: Object.fromEntries(Object.entries(latest?.data ?? {}).map(([province, value]) => [province, value.harga > 0 ? value.harga : null])),
    prediksi: Object.entries(forecast.provinsi).map(([province, value]) => {
      const end = value.seri.filter((point) => point.is_future).at(-1);
      return end ? { provinsi: province, tanggal: end.tanggal, harga: Math.round(end.forecast) } : null;
    }).filter(Boolean),
    korelasi_cuaca: insight.find((item) => item.komoditas === commodity.slug)?.provinsi.slice(0, 1).map((item) => ({
      provinsi: item.provinsi, hujan: item.r_hujan_harian, suhu: item.r_suhu_harian,
    })) ?? [],
  };
});

const output = new URL("src/lib/generated/chat-context.json", root);
mkdirSync(fileURLToPath(new URL(".", output)), { recursive: true });
writeFileSync(output, JSON.stringify(commodities) + "\n");
console.log(`Konteks chatbot dibuat: ${commodities.length} komoditas.`);
