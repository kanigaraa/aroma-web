import MapTimeline from "./MapTimeline";
import { getKomoditasProcessedSlim, getMeta } from "@/lib/data";
import { getMapData } from "@/lib/mapData";
import type { Status } from "@/lib/types";

// ambil status per tanggal utk 30 hari terakhir (terbaru di akhir)
export default function MapTimelineSection({
  slug,
  nama,
}: {
  slug: string;
  nama: string;
}) {
  const meta = getMeta();
  const p = getKomoditasProcessedSlim(slug, 30);
  const { paths, centroids } = getMapData();
  const last30 = p.seri.slice(-30);

  const days = last30.map((seri) => {
    const status: Record<string, Status> = {};
    meta.provinsi.forEach((prov) => {
      status[prov] = seri.data[prov]?.status ?? "stabil";
    });
    return { tanggal: seri.tanggal, status };
  });

  return (
    <MapTimeline slug={slug} nama={nama} paths={paths} centroids={centroids} days={days} />
  );
}
