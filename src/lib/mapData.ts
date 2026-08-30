import geojson from "@/data/idn.json";

// Proses geojson provinsi di SERVER (idn.json 631KB tak bisa ke client bundle).
// Keluarkan hanya path SVG + centroid tiap provinsi sbg data ringan ke client.

export type MapProvince = { name: string; path: string };

type Feature = {
  type: string;
  properties: { name: string; slug: string };
  geometry: { type: string; coordinates: any };
};

const features = (geojson as any).features as Feature[];

function flattenCoords(geo: any): [number, number][] {
  const out: [number, number][] = [];
  const push = (c: number[]) => out.push([c[0], c[1]]);
  const walk = (g: any) => {
    if (!g) return;
    if (g.type === "Polygon") g.coordinates.forEach((ring: any) => ring.forEach(push));
    else if (g.type === "MultiPolygon")
      g.coordinates.forEach((poly: any) => poly.forEach((ring: any) => ring.forEach(push)));
  };
  walk(geo);
  return out;
}

function project(pts: [number, number][], width: number, height: number) {
  const lngs = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats);
  // 6% margin di semua sisi; konten di-crop via viewBox bounds (lihat bawah)
  const pad = 0.02;
  const scale = Math.min(
    (width * (1 - 2 * pad)) / (maxLng - minLng || 1),
    (height * (1 - 2 * pad)) / (maxLat - minLat || 1)
  );
  const x = (lng: number) => (lng - minLng) * scale + pad * width;
  const y = (lat: number) => (maxLat - lat) * scale + pad * height;
  return { x, y };
}

const titleCase = (s: string) =>
  s.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const W = 1200;
const H = 680;
const allCoords = features.flatMap((f) => flattenCoords(f.geometry));
const proj = project(allCoords, W, H);

// Crop viewBox ke bounds proyeksi aktual semua path -> peta memenuhi & center
function projectedBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [lng, lat] of allCoords) {
    const x = proj.x(lng), y = proj.y(lat);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}
const B = projectedBounds();
export const MAP_OFF_X = Math.max(0, B.minX);
export const MAP_OFF_Y = Math.max(0, B.minY);
export const MAP_W = Math.ceil(B.maxX - B.minX);
export const MAP_H = Math.ceil(B.maxY - B.minY);

function ringToPath(ring: number[][]): string {
  return (
    "M" +
    ring
      .map((c) => `${proj.x(c[0]) - MAP_OFF_X},${proj.y(c[1]) - MAP_OFF_Y}`)
      .join(" L") +
    " Z"
  );
}

function toPath(geo: any): string {
  if (geo.type === "Polygon")
    return geo.coordinates.map((ring: number[][]) => ringToPath(ring)).join(" ");
  if (geo.type === "MultiPolygon")
    return geo.coordinates
      .flat()
      .map((ring: number[][]) => ringToPath(ring))
      .join(" ");
  return "";
}

export function getMapData(): { paths: MapProvince[]; centroids: Record<string, { x: number; y: number }> } {
  const paths: MapProvince[] = [];
  const centroids: Record<string, { x: number; y: number }> = {};
  features.forEach((f) => {
    const name = titleCase(f.properties.name);
    paths.push({ name, path: toPath(f.geometry) });
    const pts = flattenCoords(f.geometry);
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    centroids[name] = { x: proj.x(cx) - MAP_OFF_X, y: proj.y(cy) - MAP_OFF_Y };
  });
  return { paths, centroids };
}
