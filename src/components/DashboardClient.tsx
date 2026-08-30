"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  MapPin,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  CalendarDays,
  CloudSun,
  Sprout,
} from "lucide-react";
import DashboardChart from "./DashboardChart";
import { RiskBadge } from "./RiskBadge";
import IndonesiaMap from "./IndonesiaMap";
import CommodityIcon from "./CommodityIcon";
import type { ForecastPoint, Status } from "@/lib/types";

export type KomoRow = {
  slug: string;
  nama: string;
  satuan: string;
  status: Status;
  avg: number | null;
  dir: 0 | 1 | -1;
  delta: number;
  provCount: number;
  seed: number;
};

type Insight = { komoditas: string; nama: string };

type Props = {
  komoditas: { slug: string; nama: string; satuan: string }[];
  provinsi: string[];
  rows: KomoRow[];
  chart: Record<string, Record<string, ForecastPoint[]>>;
  statusNasional: Record<string, Status>;
  statusPerProv: Record<string, Record<string, Status>>; // komoditas -> prov -> status
  mapPaths: { name: string; path: string }[];
  mapCentroids: Record<string, { x: number; y: number }>;
  defaultProv: string;
  lastTanggal: string;
  insights: Insight[];
  moving?: KomoRow;
};

export default function DashboardClient({
  komoditas,
  provinsi,
  rows,
  chart,
  statusNasional,
  statusPerProv,
  mapPaths,
  mapCentroids,
  defaultProv,
  lastTanggal,
  insights,
  moving,
}: Props) {
  // komoditas terpilih di card Perbandingan Harga -> sinkron ke Peta Risiko
  const [komo, setKomo] = useState("beras");
  const mapStatus: Record<string, Status> = statusPerProv[komo] ?? {};

  return (
    <main className="flex-1 min-w-0 px-6 py-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-primary">Ringkasan Pangan</h1>
          <p className="text-sm text-secondary mt-1">
            Pantau harga pangan nasional dan perkiraan 14 hari ke depan.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs text-secondary">
          <CalendarDays className="h-3.5 w-3.5 text-accent" />
          {lastTanggal}
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-bold text-primary tnum">{rows.length}</div>
              <div className="text-xs text-secondary">Komoditas dipantau</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <div className="text-2xl font-bold text-primary tnum">{provinsi.length}</div>
              <div className="text-xs text-secondary">Provinsi dipantau</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              {moving && moving.dir < 0 ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
            </span>
            <div className="min-w-0">
              <div className="text-2xl font-bold text-primary tnum">
                {moving ? `${moving.dir > 0 ? "+" : "−"}${Math.round(moving.delta).toLocaleString("id-ID")}` : "—"}
              </div>
              <div className="text-xs text-secondary truncate">
                {moving ? `${moving.nama} pergerakan terbesar` : "Harga cenderung stabil"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* MAIN + CHART */}
        <div className="xl:col-span-2 space-y-5 min-w-0">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-primary">Perbandingan Harga</h2>
                <p className="text-xs text-secondary mt-0.5">
                  Komoditas untuk wilayah {defaultProv}
                </p>
              </div>
              <select
                aria-label="Komoditas"
                value={komo}
                onChange={(e) => setKomo(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-surface py-2 pl-3 pr-9 text-sm font-semibold text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                style={{ backgroundImage: "none" }}
              >
                {komoditas.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.nama}</option>
                ))}
              </select>
            </div>
            <DashboardChart
              komoditas={komoditas}
              chart={chart}
              status={statusNasional}
              komo={komo}
              prov={defaultProv}
            />
          </section>

          {/* GRID KOMODITAS */}
          <section className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-primary">Harga per Komoditas</h2>
                <p className="text-xs text-secondary mt-0.5">Rata-rata nasional hari ini</p>
              </div>
              <Link href="/komoditas" className="text-xs font-semibold text-accent-strong hover:underline inline-flex items-center gap-0.5">
                Lihat semua <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((k) => (
                <Link
                  key={k.slug}
                  href={`/komoditas/${k.slug}`}
                  className="group rounded-xl border border-border bg-background/60 p-4 hover:border-accent/40 hover:shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <CommodityIcon slug={k.slug} seed={k.seed} size={40} />
                    <RiskBadge status={k.status} />
                  </div>
                  <div className="mt-3 text-sm font-semibold text-primary">{k.nama}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold text-primary tnum">Rp {fmt(k.avg)}</span>
                    {k.dir !== 0 && (
                      <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${k.dir > 0 ? "text-red-500" : "text-teal-600"}`}>
                        {k.dir > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(k.delta).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] text-secondary">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {k.provCount} provinsi</span>
                    <ChevronRight className="h-3.5 w-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT PANEL */}
        <aside className="hidden xl:flex flex-col gap-5 min-w-0">
          <Link href="/peta" className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/40">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-1.5">
                <Sprout className="h-4 w-4 text-accent" /> Peta Risiko
              </h3>
              <ChevronRight className="h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="text-[11px] text-secondary mb-2">
              Status {komoditas.find((k) => k.slug === komo)?.nama ?? ""}
            </div>
            <div className="rounded-xl bg-muted/60 p-2">
              <IndonesiaMap status={mapStatus} paths={mapPaths} centroids={mapCentroids} className="w-full" />
            </div>
          </Link>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-1.5 mb-3">
              <CloudSun className="h-4 w-4 text-accent" /> Pengaruh Cuaca
            </h3>
            <div className="space-y-2">
              {insights.slice(0, 3).map((ins) => (
                <div key={ins.komoditas} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                  <CommodityIcon slug={ins.komoditas} seed={komoditas.findIndex((k) => k.slug === ins.komoditas)} size={26} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-primary truncate">{ins.nama}</div>
                    <div className="text-[11px] text-secondary">Paling dipengaruhi cuaca</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function fmt(n: number | null | undefined): string {
  return n == null ? "—" : Math.round(n).toLocaleString("id-ID");
}
