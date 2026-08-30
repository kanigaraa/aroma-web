"use client";

import { useState, useMemo } from "react";
import { MapPin, CloudSun, Droplets, Thermometer, ArrowUpDown } from "lucide-react";
import PriceChart from "./PriceChart";
import type { ForecastPoint, InsightProvinsi } from "@/lib/types";

type Props = {
  nama: string;
  satuan: string;
  provinsi: string[];
  chart: Record<string, ForecastPoint[]>;
  insight: InsightProvinsi[] | undefined;
};

type SortKey = "nama" | "harga" | "ubah" | "forecast";

// Bar korelasi cuaca — angka mentah → kata & visual
function CorrLine({
  icon,
  label,
  corr,
  nama,
}: {
  icon: React.ReactNode;
  label: string;
  corr: number | null | undefined;
  nama: string;
}) {
  if (corr == null) return null;
  const abs = Math.abs(corr);
  const pct = Math.min(abs * 100 * 3, 100); // scale r=0.33 → 100%
  const naik = corr > 0;
  const kuat = abs >= 0.3 ? "kuat" : abs >= 0.15 ? "sedang" : "lemah";
  const arah = naik
    ? `${label} tinggi → harga ${nama} cenderung naik`
    : `${label} tinggi → harga ${nama} cenderung turun`;
  const barColor =
    kuat === "kuat"
      ? naik ? "bg-red-400" : "bg-emerald-400"
      : kuat === "sedang"
      ? naik ? "bg-orange-300" : "bg-teal-300"
      : "bg-gray-300";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-secondary">{icon} {label}</span>
        <span className="font-medium text-primary">
          {kuat}{kuat !== "lemah" ? ` (${naik ? "+" : "-"}${abs.toFixed(2)})` : ""}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      {kuat !== "lemah" && (
        <p className="text-[11px] text-secondary">{arah}</p>
      )}
    </div>
  );
}

export default function CommodityDetail({
  nama,
  satuan,
  provinsi,
  chart,
  insight,
}: Props) {
  const [prov, setProv] = useState(provinsi[0] ?? "");
  const [sortKey, setSortKey] = useState<SortKey>("harga");
  const [asc, setAsc] = useState(false);

  const data = chart[prov] ?? [];
  const ins = insight?.find((i) => i.provinsi === prov);
  const last = data.filter((d) => !d.is_future).at(-1);
  const fc = data.filter((d) => d.is_future).at(-1);

  // tabel harga terakhir per provinsi
  const table = useMemo(() => {
    return provinsi
      .map((p) => {
        const s = chart[p] ?? [];
        const hist = s.filter((d) => !d.is_future);
        const l = hist.at(-1);
        const prev = hist.at(-2);
        const f = s.filter((d) => d.is_future).at(-1);
        const harga = l?.harga ?? null;
        const ubah =
          harga != null && prev?.harga != null ? harga - prev.harga : null;
        return { nama: p, harga, ubah, forecast: f?.forecast ?? null };
      })
      .sort((a, b) => {
        let r = 0;
        if (sortKey === "nama") r = a.nama.localeCompare(b.nama);
        else {
          const va = a[sortKey] ?? -Infinity;
          const vb = b[sortKey] ?? -Infinity;
          r = va === vb ? 0 : va > vb ? 1 : -1;
        }
        return asc ? r : -r;
      });
  }, [provinsi, chart, sortKey, asc]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setAsc((a) => !a);
    else {
      setSortKey(k);
      setAsc(true);
    }
  };

  const thCls =
    "cursor-pointer select-none px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-secondary hover:text-primary";

  return (
    <div className="space-y-5">
      {/* Selector provinsi */}
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
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Chart harga + forecast */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4">
          <h2 className="font-semibold text-primary">
            Harga {nama} · {prov}
          </h2>
          <p className="mt-0.5 text-xs text-secondary">
            Harga terbaru & perkiraan 14 hari
          </p>
        </div>
        <PriceChart data={data} satuan={satuan} height={340} />
      </section>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="text-xs text-secondary">Harga Terakhir</div>
          <div className="mt-1 text-2xl font-bold text-primary tnum">
            {last?.harga != null
              ? `Rp ${Math.round(last.harga).toLocaleString("id-ID")}`
              : "—"}
          </div>
          <div className="mt-0.5 text-[11px] text-secondary">
            {last?.tanggal} · {prov} · per {satuan}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="text-xs text-secondary">Perkiraan 14 Hari</div>
          <div className="mt-1 text-2xl font-bold text-coral tnum">
            {fc ? `Rp ${Math.round(fc.forecast).toLocaleString("id-ID")}` : "—"}
          </div>
          <div className="mt-0.5 text-[11px] text-secondary">Akhir perkiraan · per {satuan}</div>
        </div>
      </div>

      {/* Pengaruh cuaca — penyebab harga, tampil sebelum tabel */}
      {ins && (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <CloudSun className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-primary">
              Pengaruh Cuaca · {prov}
            </h3>
          </div>
          <div className="space-y-4">
            <CorrLine
              icon={<Droplets className="h-3.5 w-3.5" />}
              label="Hujan"
              corr={ins.r_hujan_harian}
              nama={nama}
            />
            <CorrLine
              icon={<Thermometer className="h-3.5 w-3.5" />}
              label="Suhu"
              corr={ins.r_suhu_harian}
              nama={nama}
            />
          </div>
          <p className="mt-3 text-[11px] text-secondary">
            Berdasarkan {ins.n_hari} hari data harga. Kekuatan pengaruh cuaca:{" "}
            <span className="font-semibold text-primary">{ins.kekuatan}</span>.
          </p>
        </section>
      )}

      {/* Tabel harga semua provinsi */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-primary">Harga per Provinsi</h3>
          <p className="mt-0.5 text-xs text-secondary">
            Klik kolom untuk mengurutkan · harga terakhir per provinsi
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className={thCls} onClick={() => toggleSort("nama")}>
                  Provinsi <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </th>
                <th className={thCls} onClick={() => toggleSort("harga")}>
                  Harga /{satuan} <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </th>
                <th className={thCls} onClick={() => toggleSort("ubah")}>
                  Perubahan <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </th>
                <th className={thCls} onClick={() => toggleSort("forecast")}>
                  Perkiraan 14 hari <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </th>
              </tr>
            </thead>
            <tbody>
              {table.map((r) => (
                <tr
                  key={r.nama}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-muted/40"
                  onClick={() => setProv(r.nama)}
                >
                  <td className="px-4 py-2.5 font-medium text-primary">{r.nama}</td>
                  <td className="px-4 py-2.5 tnum text-primary">
                    {r.harga != null
                      ? `Rp ${Math.round(r.harga).toLocaleString("id-ID")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 tnum">
                    {r.ubah == null ? (
                      <span className="text-secondary">—</span>
                    ) : r.ubah > 0 ? (
                      <span className="font-semibold text-red-500">
                        ▲ +{Math.round(r.ubah).toLocaleString("id-ID")}
                      </span>
                    ) : r.ubah < 0 ? (
                      <span className="font-semibold text-emerald-600">
                        ▼ {Math.round(r.ubah).toLocaleString("id-ID")}
                      </span>
                    ) : (
                      <span className="text-secondary">stabil</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 tnum text-primary">
                    {r.forecast != null
                      ? `Rp ${Math.round(r.forecast).toLocaleString("id-ID")}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
