// Tipe data AROMA — kontrak dari JSON di data/

export type KomoditasMeta = {
  id: string;
  nama: string;
  slug: string;
  satuan: string;
};

export type Meta = {
  komoditas: KomoditasMeta[];
  tipe_harga: { id: number; nama: string }[];
  provinsi: string[];
};

export type Status = "stabil" | "waspada" | "tinggi";

export type HargaHarItem = {
  harga: number;
  avg: number;
  stddev: number;
  kelompok: number;
  zscore: number;
  status: Status;
};

// processed/{slug}.json
export type ProcessedKomoditas = {
  komoditas_id: string;
  nama: string;
  komoditas: string;
  tipe_harga: number;
  provinsi: string[];
  seri: {
    tanggal: string;
    data: Record<string, HargaHarItem>;
  }[];
};

export type ForecastPoint = {
  tanggal: string;
  harga: number | null;
  forecast: number;
  lower: number;
  upper: number;
  is_future: boolean;
};

// forecast/{slug}.json
export type ForecastKomoditas = {
  komoditas: string;
  tipe_harga: number;
  horizon_days: number;
  provinsi: Record<
    string,
    { horizon: number; last_date: string; seri: ForecastPoint[] }
  >;
};

// insight/cuaca.json
export type InsightProvinsi = {
  provinsi: string;
  n_hari: number;
  r_hujan_harian: number | null;
  r_suhu_harian: number | null;
  r_hujan_mingguan: number | null;
  r_suhu_mingguan: number | null;
  kekuatan: string;
};

export type InsightKomoditas = {
  komoditas: string;
  nama: string;
  provinsi: InsightProvinsi[];
};
