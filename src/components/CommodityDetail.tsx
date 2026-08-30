"use client";

import { useState } from "react";
import { MapPin, CloudSun, Droplets, Thermometer } from "lucide-react";
import PriceChart from "./PriceChart";
import type { ForecastPoint, InsightProvinsi } from "@/lib/types";

type Props = {
  nama: string;
  satuan: string;
  provinsi: string[];
  chart: Record<string, ForecastPoint[]>;
  insight: InsightProvinsi[] | undefined;
};

export default function CommodityDetail({
  nama,
  satuan,
  provinsi,
  chart,
  insight,
}: Props) {
  const [prov, setProv] = useState(provinsi[0] ?? "");
  const data = chart[prov] ?? [];
  const ins = insight?.find((i) => i.provinsi === prov);
  const last = data.filter((d) => !d.is_future).at(-1);
  const fc = data.filter((d) => d.is_future).at(-1);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-secondary" htmlFor="prov">
          Provinsi
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
          <select
            id="prov"
            value={prov}
            onChange={(e) => setProv(e.target.value)}
            className="appearance-none rounded-xl border border-border bg-surface py-2 pl-9 pr-9 text-sm font-medium text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {provinsi.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-primary">Harga {nama} · {prov}</h2>
            <p className="text-xs text-secondary mt-0.5">Harga terbaru & perkiraan 14 hari</p>
          </div>
        </div>
        <PriceChart data={data} satuan={satuan} height={340} />
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="text-xs text-secondary">Harga Terakhir</div>
          <div className="text-2xl font-bold text-primary mt-1 tnum">
            {last?.harga != null ? `Rp ${Math.round(last.harga).toLocaleString("id-ID")}` : "—"}
          </div>
          <div className="text-[11px] text-secondary mt-0.5">
            {last?.tanggal} · {prov}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="text-xs text-secondary">Perkiraan 14 Hari</div>
          <div className="text-2xl font-bold text-coral mt-1 tnum">
            {fc ? `Rp ${Math.round(fc.forecast).toLocaleString("id-ID")}` : "—"}
          </div>
          <div className="text-[11px] text-secondary mt-0.5">Akhir perkiraan</div>
        </div>
      </div>

      {ins && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center gap-2">
            <CloudSun className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-primary">Insight Cuaca · {prov}</h3>
            <span className="ml-auto text-[11px] text-secondary">
              Pengaruh cuaca <span className="font-semibold text-primary">{ins.kekuatan}</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-muted p-3">
              <div className="flex items-center gap-1.5 text-secondary">
                <Droplets className="h-3.5 w-3.5" /> Hujan harian
              </div>
              <div className="font-semibold text-primary mt-1 tnum">{ins.r_hujan_harian?.toFixed(2) ?? "—"}</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="flex items-center gap-1.5 text-secondary">
                <Thermometer className="h-3.5 w-3.5" /> Suhu harian
              </div>
              <div className="font-semibold text-primary mt-1 tnum">{ins.r_suhu_harian?.toFixed(2) ?? "—"}</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
