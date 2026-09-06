import { getDashboardChart, getMeta } from "@/lib/data";
import { provinceToSlug } from "@/lib/province-slug";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getMeta().provinsi.map((province) => ({ province: provinceToSlug(province) }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ province: string }> }
) {
  const { province: provinceSlug } = await params;
  const province = getMeta().provinsi.find(
    (candidate) => provinceToSlug(candidate) === provinceSlug
  );
  if (!province) {
    return Response.json({ error: "Wilayah tidak ditemukan." }, { status: 404 });
  }
  return Response.json({ province, chart: getDashboardChart(province) });
}
