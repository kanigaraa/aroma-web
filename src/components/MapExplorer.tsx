"use client";

import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  TrendingUp,
  TrendingDown,
  CloudSun,
  MapPin,
  X,
  ChevronDown,
  Package,
  Search,
  BellRing,
} from "lucide-react";
import IndonesiaMap from "./IndonesiaMap";
import { RiskBadge } from "./RiskBadge";
import {
  COMPARE_COLORS,
  AlertControl,
  CompareChart,
  TrendChart,
  type ProvHistory,
} from "./MapExplorerCharts";
import { MAP_W, MAP_H, type MapProvince } from "@/lib/mapConst";
import type { Status } from "@/lib/types";

type ProvDetail = {
  nama: string;
  harga: number | null;
  satuan: string;
  status: Status;
  forecast: string | null;
  rCuaca: number | null;
};

type Props = {
  komoditas: { slug: string; nama: string }[];
  dataset: Record<
    string,
    {
      status: Record<string, Status>;
      detail: Record<string, ProvDetail>;
      history: Record<string, ProvHistory>;
    }
  >;
  paths: MapProvince[];
  centroids: Record<string, { x: number; y: number }>;
};

type Filter = "semua" | Status;

const STATUS_LABEL: Record<Status, string> = {
  stabil: "Stabil",
  waspada: "Waspada",
  tinggi: "Tinggi",
};

export default function MapExplorer({ komoditas, dataset, paths, centroids }: Props) {
  const [slug, setSlug] = useState(komoditas[0]?.slug ?? "beras");
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ clientX: number; clientY: number } | null>(null);
  const [filter, setFilter] = useState<Filter>("semua");
  const [q, setQ] = useState("");
  const [compare, setCompare] = useState<string[]>([]);
  // Ambang harga tersimpan di browser ini.
  const [thresholds, setThresholds] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("aroma-alerts") ?? "{}");
    } catch {
      return {};
    }
  });
  const setThreshold = (key: string, value: number | null) => {
    setThresholds((prev) => {
      const next = { ...prev };
      if (value == null || value <= 0) delete next[key];
      else next[key] = value;
      try {
        localStorage.setItem("aroma-alerts", JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  const { status, detail, history } = dataset[slug] ?? { status: {}, detail: {}, history: {} };

  const filterFn = (prov: string): boolean => {
    if (filter !== "semua" && status[prov] !== filter) return false;
    if (q && !prov.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  };

  const selKey = sel ? Object.keys(detail).find((k) => k.toLowerCase() === sel.toLowerCase()) : undefined;
  const d = selKey ? detail[selKey] : undefined;

  const names = Object.keys(status);
  const visibleCount = names.filter(filterFn).length;
  const stabilCount = names.filter((p) => status[p] === "stabil").length;
  const waspadaCount = names.filter((p) => status[p] === "waspada").length;
  const tinggiCount = names.filter((p) => status[p] === "tinggi").length;
  // ringkasan nasional utk panel default
  const details = Object.values(detail).filter((item): item is ProvDetail => item.harga != null);
  const nationalAvg = details.length
    ? Math.round(details.reduce((s, d) => s + d.harga!, 0) / details.length)
    : 0;
  const firstSatuan = details[0]?.satuan ?? "kg";
  // rangking top 5 termahal & termurah dari detail (harga > 0)
  const ranked = Object.entries(detail)
    .filter(([, v]) => v?.harga != null && v.harga > 0)
    .sort((a, b) => b[1].harga! - a[1].harga!);
  const topMahal = ranked.slice(0, 5);
  const topMurah = [...ranked].reverse().slice(0, 5);
  const nationalStatus: Status =
    tinggiCount > waspadaCount && tinggiCount > stabilCount ? "tinggi"
    : waspadaCount > stabilCount ? "waspada"
    : "stabil";

  // tooltip dalam map = hanya saat hover (detail klik tampil di panel kanan)
  const tipKey = hover ? hover : null;
  const tipName = tipKey
    ? Object.keys(detail).find((k) => k.toLowerCase() === tipKey.toLowerCase())
    : undefined;
  const tipDetail = tipName ? detail[tipName] : undefined;

  // tooltip mengikuti kursor (fixed ke viewport), clamp agar tak keluar layar
  const tooltipStyle = hoverPos
    ? {
        left: `${Math.min(window.innerWidth - 260, hoverPos.clientX + 14)}px`,
        top: `${Math.max(8, hoverPos.clientY - 10)}px`,
      }
    : undefined;

  const onMapHover = (name: string | null, pos?: { clientX: number; clientY: number }) => {
    setHover(name);
    setHoverPos(pos ?? null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
      {/* LEFT: MAP */}
      <div className="flex flex-col gap-5 min-w-0">
      {/* TOOLBAR FILTER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Package className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
            <select
              aria-label="Komoditas"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSel(null); setHover(null); }}
              className="appearance-none rounded-xl border border-border bg-surface py-2.5 pl-9 pr-9 text-sm font-semibold text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {komoditas.map((k) => (
                <option key={k.slug} value={k.slug}>{k.nama}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          </div>

          {/* filter status */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
            {(["semua", "stabil", "waspada", "tinggi"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f
                    ? f === "semua"
                      ? "bg-primary text-white"
                      : f === "stabil"
                        ? "bg-teal-500 text-white"
                        : f === "waspada"
                          ? "bg-amber-500 text-white"
                          : "bg-red-500 text-white"
                    : "text-secondary hover:bg-muted"
                }`}
              >
                {f === "semua" ? `Semua ${visibleCount}` : STATUS_LABEL[f]}
              </button>
            ))}
          </div>

          {/* search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari provinsi..."
              className="w-48 rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-primary placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

      </div>

      {/* MAP HERO */}
      <div className="relative rounded-2xl border border-border bg-surface p-3">
        <div
          className="relative overflow-hidden rounded-xl bg-muted/60 w-full max-h-[72vh]"
          style={{ aspectRatio: "1200 / 680" }}
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.6}
            maxScale={10}
            centerOnInit
            limitToBounds={false}
            wheel={{ step: 0.12 }}
            panning={{ velocityDisabled: true }}
            doubleClick={{ disabled: true }}
            zoomAnimation={{ animationTime: 0.4, animationType: "easeOut" }}
          >
            {({ resetTransform, zoomIn, zoomOut }) => (
              <>
                <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
                  <button
                    onClick={() => zoomIn()}
                    aria-label="Perbesar"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm hover:bg-muted"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    aria-label="Perkecil"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm hover:bg-muted"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    aria-label="Atur ulang zoom"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm hover:bg-muted"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <TransformComponent
                  wrapperClass="!w-full !h-full"
                  contentClass="!w-full !h-full !flex !items-center !justify-center"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <IndonesiaMap
                      status={status}
                      paths={paths}
                      centroids={centroids}
                      selected={sel ?? undefined}
                      hover={hover}
                      filter={filter}
                      onHover={onMapHover}
                      onSelect={(p) => setSel(p === sel ? null : p)}
                      className="w-full h-full"
                    />
                  </div>
                </TransformComponent>

                {/* TOOLTIP DALAM MAP (info simple) */}
                {tipDetail && tipName && tooltipStyle && filterFn(tipName) && (
                  <div
                    className="pointer-events-none fixed z-50 w-max max-w-[240px] rounded-xl border border-border bg-surface/95 p-3 shadow-xl backdrop-blur"
                    style={tooltipStyle}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-primary leading-snug">{tipName}</div>
                      <RiskBadge status={tipDetail.status} />
                    </div>
                    <div className="mt-1.5 text-lg font-bold text-primary tnum">
                      {tipDetail.harga == null ? "Data belum tersedia" : `Rp ${Math.round(tipDetail.harga).toLocaleString("id-ID")}`}
                    </div>
                    <div className="text-[10px] text-secondary">per {tipDetail.satuan}</div>
                  </div>
                )}
              </>
            )}
          </TransformWrapper>
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-secondary">
          <span>
            {visibleCount} dari {names.length} Provinsi
            {filter !== "semua" && ` · ${STATUS_LABEL[filter]}`}
            {q && ` · "${q}"`}
          </span>
          <span className="hidden sm:inline">Geser · Scroll · Klik</span>
        </div>
      </div>
      </div>

      {/* RIGHT: DETAIL PANEL (sticky saat scroll) */}
      <aside className="xl:sticky xl:top-24">
        {d ? (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-primary leading-tight">{selKey}</h3>
                  <div className="text-[11px] text-secondary">Provinsi · {slug}</div>
                </div>
                </div>
              <div className="flex items-center gap-2">
                <RiskBadge status={d.status} />
                <button
                  onClick={() => setSel(null)}
                  aria-label="Tutup"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-secondary hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="text-xs text-secondary">Harga Saat Ini</div>
                <div className="text-2xl font-bold text-primary tnum mt-1">
                  {d.harga == null ? "Data belum tersedia" : `Rp ${Math.round(d.harga).toLocaleString("id-ID")}`}
                </div>
                <div className="text-[11px] text-secondary">per {d.satuan}</div>
              </div>
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="text-xs text-secondary flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-coral" /> Perkiraan 14 Hari
                </div>
                <div className="text-2xl font-bold text-primary tnum mt-1">
                  {d.forecast == null ? "Data belum tersedia" : `Rp ${Math.round(Number(d.forecast)).toLocaleString("id-ID")}`}
                </div>
                <div className="text-[11px] text-secondary">Akhir perkiraan</div>
              </div>
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="text-xs text-secondary flex items-center gap-1">
                  <CloudSun className="h-3 w-3 text-accent" /> Pengaruh Cuaca
                </div>
                <div className="text-2xl font-bold text-primary tnum mt-1">
                  {d.rCuaca != null
                    ? `${Math.abs(d.rCuaca) >= 0.5 ? "Kuat" : Math.abs(d.rCuaca) >= 0.3 ? "Sedang" : "Lemah"}`
                    : "—"}
                </div>
                <div className="text-[11px] text-secondary">
                  {d.rCuaca != null
                    ? `hujan ${d.rCuaca > 0 ? "mendorong" : "menurunkan"} harga`
                    : "tidak ada data cuaca"}
                </div>
              </div>

              {/* ALERT AMBANG HARGA */}
              {d.harga != null && <div className="rounded-xl bg-muted/60 p-4">
                <div className="text-xs text-secondary flex items-center gap-1 mb-2">
                  <BellRing className="h-3 w-3 text-accent" /> Ambang Harga Browser
                </div>
                <AlertControl
                  current={d.harga}
                  satuan={d.satuan}
                  threshold={thresholds[`${slug}:${selKey}`]}
                  onSet={(v) => setThreshold(`${slug}:${selKey}`, v)}
                />
              </div>}

              {/* TREN HARGA 30 HARI */}
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="mb-2 text-xs font-medium text-secondary">Tren Harga · 30 hari</div>
                <TrendChart data={history[selKey!] ?? []} satuan={d.satuan} />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-semibold text-primary">Ringkasan Nasional</h3>
                <div className="text-[11px] text-secondary">Semua provinsi · {slug}</div>
              </div>
              <RiskBadge status={nationalStatus} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="text-xs text-secondary">Harga Rata-rata</div>
                <div className="text-xl font-bold text-primary tnum mt-1">
                  Rp {nationalAvg.toLocaleString("id-ID")}
                </div>
                <div className="text-[11px] text-secondary">per {firstSatuan}</div>
              </div>
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="text-xs text-secondary">Provinsi Dipantau</div>
                <div className="text-xl font-bold text-primary tnum mt-1">{names.length}</div>
              </div>
              <div className="rounded-xl bg-muted/60 p-4 col-span-2">
                <div className="text-xs text-secondary mb-2">Status Provinsi</div>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1.5"><span className="font-semibold text-primary">{stabilCount}</span><span className="text-secondary">Stabil</span></span>
                  <span className="flex items-center gap-1.5"><span className="font-semibold text-primary">{waspadaCount}</span><span className="text-secondary">Waspada</span></span>
                  <span className="flex items-center gap-1.5"><span className="font-semibold text-primary">{tinggiCount}</span><span className="text-secondary">Tinggi</span></span>
                </div>
              </div>
            </div>

            {/* RANGKING TOP 5 */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { title: "Termahal", items: topMahal },
                { title: "Termurah", items: topMurah },
                ].map(({ title, items }) => (
                <div key={title} className="rounded-xl bg-muted/60 p-4">
                  <div className="text-xs text-secondary mb-2">{title}</div>
                  {items.length === 0 ? (
                    <div className="text-[11px] text-secondary">Tidak ada data.</div>
                  ) : (
                    <ol className="space-y-1.5">
                      {items.map(([prov, v], i) => {
                        const rank = i + 1;
                        const rankCls =
                          rank === 1
                            ? "bg-amber-400 text-white"
                            : rank === 2
                              ? "bg-slate-300 text-white"
                              : rank === 3
                                ? "bg-orange-300 text-white"
                                : "bg-transparent text-secondary";
                        return (
                          <li key={prov} className="flex items-center justify-between gap-1 text-[11px]">
                            <span className="flex min-w-0 items-center gap-1.5">
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${rankCls}`}
                              >
                                {rank}
                              </span>
                              <span className="truncate text-primary" title={prov}>{prov}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-1">
                              <span className="tnum font-semibold text-primary">
                                {v.harga == null ? "—" : v.harga.toLocaleString("id-ID")}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-secondary">
              Pilih provinsi di peta untuk melihat detail harga dan perkiraan.
            </p>

            <div className="mt-3 rounded-xl bg-muted/60 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <BellRing className="h-4 w-4 text-accent" /> Ambang Harga Browser
              </div>
              <p className="mt-1 text-xs leading-relaxed text-secondary">
                Pilih provinsi di peta untuk menetapkan ambang pada browser ini.
              </p>
            </div>

            {/* PERBANDINGAN PROVINSI */}
            <div className="mt-3 rounded-xl bg-muted/60 p-4">
              <div className="text-xs text-secondary font-medium mb-2">Perbandingan Provinsi</div>
              <select
                value=""
                onChange={(e) => {
                  const p = e.target.value;
                  if (p && !compare.includes(p) && compare.length < 3) {
                    setCompare([...compare, p]);
                  }
                  e.target.value = "";
                }}
                className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="" disabled>
                  {compare.length >= 3 ? "Maksimal 3 provinsi" : "Pilih provinsi (maks 3)..."}
                </option>
                {names
                  .filter((n) => !compare.includes(n))
                  .sort()
                  .map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
              </select>
              {compare.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {compare.map((p, i) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                      style={{ color: COMPARE_COLORS[i % 3], borderColor: COMPARE_COLORS[i % 3] + "55" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: COMPARE_COLORS[i % 3] }} />
                      {p}
                      <button
                        onClick={() => setCompare(compare.filter((x) => x !== p))}
                        aria-label={`Hapus ${p}`}
                        className="ml-0.5 text-secondary hover:text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2">
                <CompareChart
                  series={compare
                    .map((p) => ({ prov: p, data: history[p] ?? [] }))
                    .filter((s) => s.data.length >= 2)}
                  satuan={firstSatuan}
                />
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
