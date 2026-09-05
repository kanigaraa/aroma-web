import Link from "next/link";
import { TrendingUp, TrendingDown, ChevronRight, MapPin } from "lucide-react";
import { getMeta, getKomoditasProcessedSlim } from "@/lib/data";
import { RiskBadge, summarizeStatus } from "@/components/RiskBadge";
import CommodityIcon from "@/components/CommodityIcon";

export const dynamic = "force-static";

export default function KomoditasPage() {
  const meta = getMeta();
  const rows = meta.komoditas.map((k, i) => {
    const p = getKomoditasProcessedSlim(k.slug, 2);
    const last = p.seri[p.seri.length - 1];
    const vals = last ? Object.values(last.data).map((d) => d.harga) : [];
    const avg = vals.length
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : null;
    let dir: 0 | 1 | -1 = 0;
    let delta = 0;
    if (p.seri.length >= 2) {
      const a = Object.values(p.seri.at(-1)!.data).reduce((s, d) => s + d.harga, 0) / vals.length;
      const b = Object.values(p.seri.at(-2)!.data).reduce((s, d) => s + d.harga, 0) / vals.length;
      delta = a - b;
      dir = delta > 0 ? 1 : delta < 0 ? -1 : 0;
    }
    return { ...k, status: summarizeStatus(p.seri), avg, prov: p.provinsi.length, dir, delta, seed: i };
  });

  return (
    <main className="flex-1 min-w-0 px-6 py-6 lg:px-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-primary">Komoditas</h1>
            <p className="text-sm text-secondary mt-1">{rows.length} komoditas pangan yang dipantau · harga per {rows[0]?.satuan ?? "kg"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((k) => (
            <Link
              key={k.slug}
              href={`/komoditas/${k.slug}`}
              className="group rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between">
                <CommodityIcon slug={k.slug} seed={k.seed} size={44} />
                <RiskBadge status={k.status} />
              </div>
              <div className="mt-3 text-sm font-semibold text-primary">{k.nama}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xl font-bold text-primary tnum">
                  Rp {k.avg != null ? k.avg.toLocaleString("id-ID") : "—"}
                </span>
                <span className="text-xs text-secondary">/ {k.satuan}</span>
                {k.dir !== 0 && (
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${k.dir > 0 ? "text-red-500" : "text-teal-600"}`}>
                    {k.dir > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(k.delta).toFixed(0)}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] text-secondary">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {k.prov} provinsi</span>
                <ChevronRight className="h-3.5 w-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
    </main>
  );
}
