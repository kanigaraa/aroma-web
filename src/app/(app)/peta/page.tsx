import { CalendarDays } from "lucide-react";
import {
  getMeta,
  getKomoditasProcessed,
  getKomoditasForecast,
  getInsight,
} from "@/lib/data";
import MapExplorer from "@/components/MapExplorer";
import { getMapData } from "@/lib/mapData";
import type { Status } from "@/lib/types";

export const dynamic = "force-static";

type ProvDetail = {
  nama: string;
  harga: number;
  satuan: string;
  status: Status;
  forecast: string;
  rCuaca: number | null;
};

// histori harga per provinsi (maks 90 hari terakhir) utk chart tren
type ProvHistory = { tanggal: string; harga: number }[];

export default function PetaPage() {
  const meta = getMeta();
  const lastTanggal = getKomoditasProcessed("beras").seri.at(-1)?.tanggal;
  const { paths, centroids } = getMapData();

  // data per komoditas -> { status: Record<prov,Status>, detail: Record<prov,ProvDetail> }
  const dataset: Record<
    string,
    {
      status: Record<string, Status>;
      detail: Record<string, ProvDetail>;
      history: Record<string, ProvHistory>;
    }
  > = {};

  meta.komoditas.forEach((k) => {
    const p = getKomoditasProcessed(k.slug);
    const fc = getKomoditasForecast(k.slug);
    const insight = getInsight().find((i) => i.komoditas === k.slug);
    const status: Record<string, Status> = {};
    const detail: Record<string, ProvDetail> = {};
    const history: Record<string, ProvHistory> = {};
    // 90 hari terakhir utk semua provinsi (satu pass)
    const last90 = p.seri.slice(-90);
    const last = p.seri[p.seri.length - 1];
    meta.provinsi.forEach((prov) => {
      const d = last?.data[prov];
      status[prov] = d?.status ?? "stabil";
      // Harga terakhir yang diketahui: data harian kadang bolong (None) utk sebagian
      // provinsi (mis. Riau, Kalbar). Kalau kosong pd tgl terakhir, pakai harga
      // terdekat yg ada dari riwayat 90 hari utk hindari "0" palsu di peta.
      let lastKnown = d?.harga ?? 0;
      if (!lastKnown) {
        for (let i = last90.length - 1; i >= 0; i--) {
          const h = last90[i].data[prov]?.harga;
          if (h) { lastKnown = h; break; }
        }
      }
      const fcSeri = fc.provinsi[prov]?.seri ?? [];
      const fcLast = fcSeri.filter((f) => f.is_future).at(-1);
      const ins = insight?.provinsi.find(
        (i) => i.provinsi.toLowerCase() === prov.toLowerCase()
      );
      detail[prov] = {
        nama: k.nama,
        harga: lastKnown,
        satuan: k.satuan ?? "kg",
        status: d?.status ?? "stabil",
        forecast: fcLast ? String(fcLast.forecast) : "0",
        rCuaca: ins?.r_hujan_harian ?? null,
      };
      history[prov] = last90
        .map((s) => ({ tanggal: s.tanggal, harga: s.data[prov]?.harga ?? 0 }))
        .filter((h) => h.harga > 0);
    });
    dataset[k.slug] = { status, detail, history };
  });

  return (
    <main className="flex-1 min-w-0 px-6 py-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-primary">
              Peta Risiko Nasional
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs text-secondary">
            <CalendarDays className="h-3.5 w-3.5 text-accent" />
            Data per {lastTanggal}
          </div>
        </div>
        <MapExplorer komoditas={meta.komoditas} dataset={dataset} paths={paths} centroids={centroids} />
    </main>
  );
}
