import * as fs from "fs";
import * as path from "path";
import type {
  Meta,
  ProcessedKomoditas,
  ForecastKomoditas,
  ForecastPoint,
  InsightKomoditas,
} from "./types";

// ponytail: fs calls only run during `next build` (force-static pages)
// Worker never calls these — all pages are pre-rendered HTML at build time
// upgrade path: if any page needs runtime data, switch that page to fetch from R2/KV

const DATA_DIR = path.join(process.cwd(), "data");

function readJSON<T>(rel: string): T {
  const p = path.join(DATA_DIR, rel);
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

export function getMeta(): Meta {
  return readJSON<Meta>("processed/meta.json");
}

export function getKomoditasProcessed(slug: string): ProcessedKomoditas {
  return readJSON<ProcessedKomoditas>(`processed/${slug}.json`);
}

/** Hanya N hari terakhir — untuk listing/dashboard agar RSC payload kecil */
export function getKomoditasProcessedSlim(slug: string, days = 90): ProcessedKomoditas {
  const d = readJSON<ProcessedKomoditas>(`processed/${slug}.json`);
  return { ...d, seri: d.seri.slice(-days) };
}

export function getKomoditasForecast(slug: string): ForecastKomoditas {
  return readJSON<ForecastKomoditas>(`forecast/${slug}.json`);
}

/** Hanya future forecast points — untuk listing/dashboard */
export function getKomoditasForecastSlim(slug: string): ForecastKomoditas {
  const d = readJSON<ForecastKomoditas>(`forecast/${slug}.json`);
  const provinsi: ForecastKomoditas["provinsi"] = {};
  for (const [prov, val] of Object.entries(d.provinsi)) {
    provinsi[prov] = { ...val, seri: val.seri.filter((s) => s.is_future) };
  }
  return { ...d, provinsi };
}

/** Data grafik ringkas untuk komponen client. Jangan kirim arsip penuh ke RSC. */
export function getKomoditasForecastWindow(
  slug: string,
  province: string,
  historyDays = 30
): ForecastPoint[] {
  const series = getKomoditasForecast(slug).provinsi[province]?.seri ?? [];
  return [
    ...series.filter((point) => !point.is_future).slice(-historyDays),
    ...series.filter((point) => point.is_future),
  ];
}

export function getInsight(): InsightKomoditas[] {
  return readJSON<InsightKomoditas[]>("insight/cuaca.json");
}

export type PriceNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
};

/** Ringkasan pergerakan harga terbaru untuk notifikasi aplikasi. */
export function getPriceNotifications(): PriceNotification[] {
  return getMeta().komoditas
    .flatMap((commodity) => {
      const points = getKomoditasProcessedSlim(commodity.slug, 2).seri;
      const latest = points.at(-1);
      const previous = points.at(-2);
      if (!latest || !previous) return [];
      const average = (point: typeof latest) => {
        const values = Object.values(point.data).map((item) => item.harga).filter(Number.isFinite);
        return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
      };
      const current = average(latest);
      const before = average(previous);
      if (current == null || before == null || before === 0) return [];
      const change = ((current - before) / before) * 100;
      if (Math.abs(change) < 0.05) return [];
      const direction = change > 0 ? "naik" : "turun";
      return [{
        id: commodity.slug,
        title: `${commodity.nama} ${direction}`,
        body: `${Math.abs(change).toLocaleString("id-ID", { maximumFractionDigits: 1 })}% dibanding hari sebelumnya secara nasional.`,
        time: `Data ${latest.tanggal}`,
        change: Math.abs(change),
      }];
    })
    .sort((a, b) => b.change - a.change)
    .slice(0, 3)
    .map(({ change: _change, ...notification }) => notification);
}

export function getDashboardChart(province: string, historyDays = 365): Record<string, ForecastPoint[]> {
  return Object.fromEntries(getMeta().komoditas.map((commodity) => {
    const series = getKomoditasForecast(commodity.slug).provinsi[province]?.seri ?? [];
    const history = series.filter((point) => !point.is_future).slice(-historyDays);
    const future = series.filter((point) => point.is_future);
    return [commodity.slug, [...history, ...future]];
  }));
}
