import * as fs from "fs";
import * as path from "path";
import type {
  Meta,
  ProcessedKomoditas,
  ForecastKomoditas,
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

export function getInsight(): InsightKomoditas[] {
  return readJSON<InsightKomoditas[]>("insight/cuaca.json");
}
