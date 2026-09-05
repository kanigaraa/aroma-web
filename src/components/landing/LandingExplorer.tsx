"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/app/landing.module.css";

type Point = { date: string; value: number };
type CommodityPreview = { slug: string; name: string; province: string; history: Point[]; forecast: Point[] };
const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString("id-ID")}`;
const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("id-ID", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
});

function PricePlot({ history, forecast, name, compact = false }: { history: Point[]; forecast: Point[]; name: string; compact?: boolean }) {
  const points = [...history, ...forecast];
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.35, max * 0.006, 1);
  const low = min - padding;
  const high = max + padding;
  const left = compact ? 64 : 75;
  const right = compact ? 380 : 700;
  const top = 32;
  const bottom = compact ? 140 : 232;
  const firstDay = Date.parse(points[0].date);
  const span = Math.max(Date.parse(points.at(-1)!.date) - firstDay, 86400000);
  const x = (point: Point) => left + ((Date.parse(point.date) - firstDay) / span) * (right - left);
  const y = (value: number) => bottom - ((value - low) / (high - low)) * (bottom - top);
  const path = (series: Point[]) => series.map((point, index) => `${index ? "L" : "M"}${x(point)},${y(point.value)}`).join(" ");
  const last = history.at(-1)!;
  const split = x(last);
  return (
    <svg className={`${styles.pricePlot} ${compact ? styles.compactPlot : styles.widePlot}`} viewBox={compact ? "0 0 400 178" : "0 0 724 282"} role="img" aria-label={`Grafik riwayat dan prediksi harga ${name}. Garis utuh adalah historis, garis putus-putus adalah prediksi.`}>
      <rect x={split} y={top} width={right - split} height={bottom - top} fill="var(--muted)" />
      {[0, 0.5, 1].map((fraction) => {
        const value = low + fraction * (high - low);
        return <g key={fraction}><line x1={left} x2={right} y1={y(value)} y2={y(value)} stroke="var(--border)" /><text x={left - 12} y={y(value) + 4} textAnchor="end">{Math.round(value).toLocaleString("id-ID")}</text></g>;
      })}
      <path d={`${path(history)} L${split},${bottom} L${left},${bottom} Z`} fill="var(--accent)" fillOpacity="0.07" />
      <line x1={split} x2={split} y1={top} y2={bottom} stroke="var(--secondary)" strokeDasharray="3 5" />
      <path d={path(history)} fill="none" stroke="var(--accent-strong)" strokeWidth="3" strokeLinejoin="round" />
      {forecast.length > 0 && <path d={path([last, ...forecast])} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="6 5" strokeLinejoin="round" />}
      <circle cx={split} cy={y(last.value)} r="5" fill="var(--accent-strong)" stroke="white" strokeWidth="2" />
      <text x={left} y={bottom + (compact ? 26 : 35)}>{dateLabel(history[0].date)}</text><text x={right} y={bottom + (compact ? 26 : 35)} textAnchor="end">{dateLabel(points.at(-1)!.date)}</text>
    </svg>
  );
}

export default function LandingExplorer({ commodities }: { commodities: CommodityPreview[] }) {
  const [selected, setSelected] = useState(commodities[0]?.slug);
  const commodity = commodities.find((item) => item.slug === selected);
  if (!commodity || commodity.history.length === 0) {
    return <div className={styles.explorerEmpty}><h2>Preview harga belum tersedia.</h2><p>Buka dashboard untuk memeriksa data komoditas yang tersedia.</p><Link href="/login" className={styles.textLink}>Buka dashboard</Link></div>;
  }
  const latest = commodity.history.at(-1)!;
  const prediction = commodity.forecast.at(-1);
  const change = prediction && latest.value > 0 ? (prediction.value - latest.value) / latest.value * 100 : null;
  const direction = change === null ? null : Math.abs(change) < 0.05 ? "relatif tetap" : change > 0 ? "lebih tinggi" : "lebih rendah";
  return (
    <div className={styles.explorer}>
      <div className={styles.explorerToolbar}>
        <h2>Harga dalam perspektif</h2>
        <div className={styles.commodityPicker} role="group" aria-label="Pilih komoditas untuk preview">
          {commodities.map((item) => <button key={item.slug} type="button" aria-pressed={selected === item.slug} onClick={() => setSelected(item.slug)}>{item.name}</button>)}
        </div>
      </div>
      <div className={styles.explorerBody}>
        <div className={styles.chartPanel}>
          <div className={styles.chartHeading}><div><h3>{commodity.name}</h3><p>{commodity.province} · per kg</p></div><div className={styles.chartLegend}><span>Historis</span><span>Prediksi</span></div></div>
          <div className={styles.latestPrice} aria-live="polite"><strong>{rupiah(latest.value)}</strong><span>Harga tercatat, {dateLabel(latest.date)}</span></div>
          <PricePlot history={commodity.history} forecast={commodity.forecast} name={commodity.name} />
          <PricePlot history={commodity.history} forecast={commodity.forecast} name={commodity.name} compact />
        </div>
        <aside className={styles.forecastPanel} aria-live="polite" aria-atomic="true">
          <div><h3>Ke mana harga bergerak?</h3><p>Perkiraan pada {prediction ? dateLabel(prediction.date) : "periode berikutnya"}</p></div>
          {prediction ? <><strong className={styles.predictionPrice}>{rupiah(prediction.value)}<span>/ kg</span></strong><p className={styles.forecastExplanation}>Harga {commodity.name.toLowerCase()} di {commodity.province} diperkirakan {change !== null && Math.abs(change) >= 0.05 ? `${Math.abs(change).toLocaleString("id-ID", { maximumFractionDigits: 1 })}% ` : ""}{direction} dibanding harga terakhir.</p></> : <p className={styles.forecastExplanation}>Prediksi belum tersedia untuk komoditas ini. Anda tetap dapat memeriksa riwayat harganya.</p>}
          <Link href="/login" className={styles.forecastLink}>Lihat analisis lengkap <span aria-hidden="true">↗</span></Link>
          <p className={styles.forecastNote}>Estimasi dapat berbeda dari harga aktual.</p>
        </aside>
      </div>
      <div className={styles.explorerCaption}>Preview data arsip AROMA · Sumber harga: PIHPS</div>
    </div>
  );
}
