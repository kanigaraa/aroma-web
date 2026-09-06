import { env } from "cloudflare:workers";
import type {
  ForecastKomoditas,
  InsightKomoditas,
  Meta,
  ProcessedKomoditas,
} from "./types";

const cache = new Map<string, Promise<unknown>>();

async function readJSON<T>(relativePath: string): Promise<T> {
  const existing = cache.get(relativePath);
  if (existing) return existing as Promise<T>;

  const pending = env.ASSETS.fetch(
    new Request(`https://aroma-assets.invalid/_data/${relativePath}`)
  ).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Data AROMA tidak ditemukan: ${relativePath} (${response.status})`);
    }
    return response.json() as Promise<T>;
  });

  cache.set(relativePath, pending);
  return pending;
}

export function getMeta(): Promise<Meta> {
  return readJSON<Meta>("processed/meta.json");
}

export function getKomoditasProcessed(slug: string): Promise<ProcessedKomoditas> {
  return readJSON<ProcessedKomoditas>(`processed/${slug}.json`);
}

export function getKomoditasForecast(slug: string): Promise<ForecastKomoditas> {
  return readJSON<ForecastKomoditas>(`forecast/${slug}.json`);
}

export function getInsight(): Promise<InsightKomoditas[]> {
  return readJSON<InsightKomoditas[]>("insight/cuaca.json");
}
