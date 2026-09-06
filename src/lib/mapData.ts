import * as fs from "fs";
import * as path from "path";

// Precomputed at build time: run `node precompute-map.cjs` after any change to src/data/idn.json
// Output: data/map-precomputed.json (~120KB vs 631KB raw geojson)
// Worker only loads this small precomputed file, not the full geojson bundle.

export type MapProvince = { name: string; path: string };

type Precomputed = {
  provinces: Record<string, { path: string; cx: number; cy: number }>;
};

const DATA_DIR = path.join(process.cwd(), "data");

function readJSON<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, rel), "utf-8")) as T;
}

let _cache: { paths: MapProvince[]; centroids: Record<string, { x: number; y: number }> } | null = null;

export const MAP_W = 680;
export const MAP_H = 450;

export function getMapData() {
  if (_cache) return _cache;
  const data = readJSON<Precomputed>("map-precomputed.json");
  const paths: MapProvince[] = [];
  const centroids: Record<string, { x: number; y: number }> = {};
  for (const [name, v] of Object.entries(data.provinces)) {
    paths.push({ name, path: v.path });
    centroids[name] = { x: v.cx, y: v.cy };
  }
  _cache = { paths, centroids };
  return _cache;
}