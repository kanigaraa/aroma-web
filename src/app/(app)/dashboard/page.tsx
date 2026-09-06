import { getMeta, getKomoditasProcessedSlim, getDashboardChart, getInsight } from "@/lib/data";
import DashboardClient, { type KomoRow } from "@/components/DashboardClient";
import { summarizeStatus } from "@/components/RiskBadge";
import { getMapData } from "@/lib/mapData";
import type { Status } from "@/lib/types";

export const dynamic = "force-static";

function trendFrom(seri: { data: Record<string, { harga: number }> }[]) {
  if (seri.length < 2) return { delta: 0, dir: 0 as 0 | 1 | -1 };
  const last = Object.values(seri.at(-1)!.data);
  const prev = Object.values(seri.at(-2)!.data);
  const a = last.reduce((s, d) => s + d.harga, 0) / last.length;
  const b = prev.reduce((s, d) => s + d.harga, 0) / prev.length;
  const delta = a - b;
  return { delta, dir: delta > 0 ? 1 : delta < 0 ? -1 : 0 };
}

export default function Home() {
  const meta = getMeta();
  // Wilayah default akun (sementara DKI, nanti melalui pengaturan akun).
  const defaultProv = meta.provinsi.includes("DKI Jakarta") ? "DKI Jakarta" : meta.provinsi[0];

  const rows: KomoRow[] = meta.komoditas.map((k) => {
    const p = getKomoditasProcessedSlim(k.slug);
    const last = p.seri[p.seri.length - 1];
    const st = summarizeStatus(p.seri);
    const { dir, delta } = trendFrom(p.seri);
    const values = last ? Object.values(last.data) : [];
    const avg = values.length
      ? Math.round(values.reduce((s, d) => s + d.harga, 0) / values.length)
      : null;
    const provCount = new Set(p.provinsi).size;
    return { ...k, status: st, avg, dir: dir as 0 | 1 | -1, delta, provCount, seed: meta.komoditas.findIndex((x) => x.slug === k.slug) } as KomoRow;
  });

  const moving = rows.filter((r) => r.dir !== 0).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];

  const chart = getDashboardChart(defaultProv);
  const statusNasional: Record<string, Status> = {};
  const statusPerProv: Record<string, Record<string, Status>> = {};
  meta.komoditas.forEach((k) => {
    const p = getKomoditasProcessedSlim(k.slug);
    const last = p.seri[p.seri.length - 1];
    const perProv: Record<string, Status> = {};
    meta.provinsi.forEach((prov) => {
      perProv[prov] = last?.data[prov]?.status ?? "stabil";
    });
    statusNasional[k.slug] = rows.find((r) => r.slug === k.slug)?.status ?? "stabil";
    statusPerProv[k.slug] = perProv;
  });

  const { paths: mapPaths, centroids: mapCentroids } = getMapData();

  const insights = getInsight();
  const pBeras = getKomoditasProcessedSlim("beras", 1);
  const lastTanggal = pBeras.seri[pBeras.seri.length - 1]?.tanggal ?? "";

  return (
    <DashboardClient
      komoditas={meta.komoditas}
      provinsi={meta.provinsi}
      rows={rows}
      chart={chart}
      statusNasional={statusNasional}
      statusPerProv={statusPerProv}
      mapPaths={mapPaths}
      mapCentroids={mapCentroids}
      defaultProv={defaultProv}
      lastTanggal={lastTanggal}
      insights={insights.map((i) => ({ komoditas: i.komoditas, nama: i.nama }))}
      moving={moving}
    />
  );
}
