import * as fs from "fs";
import * as path from "path";
import type {
  Meta,
  ProcessedKomoditas,
  ForecastKomoditas,
  InsightKomoditas,
} from "./types";

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

export function getKomoditasForecast(slug: string): ForecastKomoditas {
  return readJSON<ForecastKomoditas>(`forecast/${slug}.json`);
}

export function getInsight(): InsightKomoditas[] {
  return readJSON<InsightKomoditas[]>("insight/cuaca.json");
}
