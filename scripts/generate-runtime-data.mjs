import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const outputDir = path.join(root, "src", "generated");
const runtimeDataDir = path.join(root, "public", "_data");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(dataDir, relativePath), "utf8"));
}

function averagePrice(series) {
  if (!series) return null;
  const values = Object.values(series.data);
  if (values.length === 0) return null;
  return Math.round(values.reduce((total, item) => total + (item.harga ?? 0), 0) / values.length);
}

const meta = await readJson("processed/meta.json");
const insights = await readJson("insight/cuaca.json");
const lines = [];

for (const commodity of meta.komoditas) {
  const processed = await readJson(`processed/${commodity.slug}.json`);
  const forecast = await readJson(`forecast/${commodity.slug}.json`);
  const current = averagePrice(processed.seri.at(-1));
  const previous = averagePrice(processed.seri.at(-2));
  const trend = current != null && previous != null && previous > 0
    ? Math.round(((current - previous) / previous) * 100)
    : 0;
  const trendText = trend > 1
    ? `naik ${trend}% 7 hari`
    : trend < -1
      ? `turun ${Math.abs(trend)}% 7 hari`
      : "stabil 7 hari";

  let forecastText = "tidak ada forecast";
  const province = Object.keys(forecast.provinsi)[0];
  const series = province ? forecast.provinsi[province].seri : [];
  const base = series.filter((point) => !point.is_future).at(-1)?.forecast;
  const end = series.filter((point) => point.is_future).at(-1)?.forecast;
  if (base && end && base > 0) {
    const change = Math.round(((end - base) / base) * 100);
    const direction = change > 0
      ? `naik ${change}%`
      : change < 0
        ? `turun ${Math.abs(change)}%`
        : "stabil";
    forecastText = `diprediksi ${direction} 14 hari (prov ${province})`;
  }

  let weatherText = "tidak ada data cuaca";
  const sample = insights.find((item) => item.komoditas === commodity.slug)?.provinsi[0];
  if (sample && (sample.r_hujan_harian != null || sample.r_suhu_harian != null)) {
    const describe = (value) => value == null
      ? "-"
      : `${Math.abs(value) >= 0.5 ? "kuat" : Math.abs(value) >= 0.3 ? "sedang" : "lemah"} ${value >= 0 ? "positif" : "negatif"}`;
    weatherText = `korelasi hujan ${describe(sample.r_hujan_harian)}, suhu ${describe(sample.r_suhu_harian)} (prov ${sample.provinsi})`;
  }

  const formattedPrice = current == null ? "-" : current.toLocaleString("id-ID");
  lines.push(`${commodity.nama}: harga rata-rata Rp ${formattedPrice} (${trendText}); ${forecastText}; ${weatherText}`);
}

const text = [
  "AROMA = dashboard analisis harga pangan Indonesia.",
  `Dipantau: ${meta.komoditas.length} komoditas, ${meta.provinsi.length} provinsi. Satuan harga per kg sesuai sumber PIHPS.`,
  "Korelasi cuaca: angka positif = saat hujan/suhu naik harga cenderung naik; negatif = sebaliknya.",
  "Detail tiap komoditas:",
  ...lines,
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "chat-context.json"),
  `${JSON.stringify({ text }, null, 2)}\n`
);

await rm(runtimeDataDir, { recursive: true, force: true });
await Promise.all([
  mkdir(path.join(runtimeDataDir, "processed"), { recursive: true }),
  mkdir(path.join(runtimeDataDir, "forecast"), { recursive: true }),
  mkdir(path.join(runtimeDataDir, "insight"), { recursive: true }),
]);
await Promise.all([
  writeFile(path.join(runtimeDataDir, "processed", "meta.json"), JSON.stringify(meta)),
  writeFile(path.join(runtimeDataDir, "insight", "cuaca.json"), JSON.stringify(insights)),
]);

await Promise.all(meta.komoditas.flatMap((commodity) => [
  (async () => {
    const processed = await readJson(`processed/${commodity.slug}.json`);
    processed.seri = processed.seri.slice(-90);
    await writeFile(
      path.join(runtimeDataDir, "processed", `${commodity.slug}.json`),
      JSON.stringify(processed)
    );
  })(),
  (async () => {
    const forecast = await readJson(`forecast/${commodity.slug}.json`);
    for (const province of Object.values(forecast.provinsi)) {
      const historical = province.seri.filter((point) => !point.is_future).slice(-365);
      const future = province.seri.filter((point) => point.is_future);
      province.seri = [...historical, ...future];
    }
    await writeFile(
      path.join(runtimeDataDir, "forecast", `${commodity.slug}.json`),
      JSON.stringify(forecast)
    );
  })(),
]));

console.log("Generated chat context and Cloudflare runtime data");
