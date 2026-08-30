import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  getMeta,
  getKomoditasProcessed,
  getKomoditasForecast,
  getInsight,
} from "@/lib/data";
import CommodityDetail from "@/components/CommodityDetail";
import CommodityIcon from "@/components/CommodityIcon";
import type { ForecastPoint } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getMeta().komoditas.map((k) => ({ slug: k.slug }));
}

export default async function KomoditasDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getMeta();
  const k = meta.komoditas.find((x) => x.slug === slug);
  if (!k) notFound();

  const seed = meta.komoditas.findIndex((x) => x.slug === slug);
  const fc = getKomoditasForecast(slug);
  const chart: Record<string, ForecastPoint[]> = {};
  meta.provinsi.forEach((prov) => {
    chart[prov] = fc.provinsi[prov]?.seri ?? [];
  });
  const insight = getInsight().find((i) => i.komoditas === slug);

  return (
    <main className="flex-1 min-w-0 px-6 py-6 lg:px-8 max-w-[960px]">
        <Link href="/komoditas" className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary mb-4">
          <ChevronLeft className="h-4 w-4" /> Komoditas
        </Link>
        <div className="mb-6 flex items-center gap-3">
          <CommodityIcon slug={k.slug} seed={seed} size={48} />
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-primary">{k.nama}</h1>
            <p className="text-sm text-secondary mt-0.5">
              Perkiraan 14 hari · {meta.provinsi.length} provinsi
            </p>
          </div>
        </div>
        <CommodityDetail
          nama={k.nama}
          satuan={k.satuan}
          provinsi={meta.provinsi}
          chart={chart}
          insight={insight?.provinsi}
        />
    </main>
  );
}
