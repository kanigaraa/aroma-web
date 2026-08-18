"""Preprocess data PIHPS -> JSON bersih + kalkulasi deteksi anomali (z-score).

Input : data/raw/pt{tipe}/{komoditas_id}.csv
Output: data/processed/{komoditas_slug}.json
  per komoditas: list { tanggal, provinsi: { name, harga, avg, stddev, kelompok, zscore, status } }

Status (z-score vs stddev dari API):
  |z| < 1.0              -> stabil
  1.0 <= |z| < 2.0       -> waspada
  |z| >= 2.0             -> tinggi

API sudah sediakan `avg` (rata2 historis) dan `stdDev` -> z-score = (harga - avg)/stddev.
Kalau stddev 0 / avg null, fallback ke status stabil (tak bisa dinilai).
"""
import os, csv, json, re, glob

RAW = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
PRICE_TYPE = 1  # Pasar Tradisional

# map komoditas id -> slug nama (dari GetCommoditiesTree leaf order)
COM_NAMES = {
    "1": "beras", "2": "daging-ayam", "3": "daging-sapi", "4": "telur-ayam",
    "5": "bawang-merah", "6": "bawang-putih", "7": "cabai-merah",
    "8": "cabai-rawit", "9": "minyak-goreng", "10": "gula-pasir",
}


def zscore_status(z):
    az = abs(z)
    if az < 1.0:
        return "stabil"
    if az < 2.0:
        return "waspada"
    return "tinggi"


def slug(cid):
    return COM_NAMES.get(cid, f"komoditas-{cid}")


def main():
    os.makedirs(OUT, exist_ok=True)
    files = glob.glob(os.path.join(RAW, f"pt{PRICE_TYPE}", "*.csv"))
    if not files:
        print(f"Tidak ada file CSV di {RAW}/pt{PRICE_TYPE}/. Jalankan scraper dulu.")
        return

    for fp in sorted(files):
        cid = os.path.splitext(os.path.basename(fp))[0]
        by_date = {}
        with open(fp, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                if row.get("show", "").lower() != "true":
                    continue
                harga = float(row["harga"]) if row["harga"] else None
                if harga is None or harga <= 0:
                    continue
                avg = float(row["avg"]) if row["avg"] else None
                std = float(row["stddev"]) if row["stddev"] else None
                z = None
                status = "stabil"
                if avg is not None and std and std > 0:
                    z = round((harga - avg) / std, 2)
                    status = zscore_status(z)
                by_date.setdefault(row["tanggal"], {})[row["provinsi"]] = {
                    "harga": harga, "avg": avg, "stddev": std,
                    "kelompok": row.get("kelompok", ""), "zscore": z, "status": status,
                }

        # urutkan tanggal, jaga nama provinsi
        dates = sorted(by_date)
        provinces = []
        for d in dates:
            provinces += [p for p in by_date[d]]
        provinces = sorted(set(provinces))

        out = {
            "komoditas_id": cid,
            "komoditas": slug(cid),
            "tipe_harga": PRICE_TYPE,
            "provinsi": provinces,
            "seri": [{"tanggal": d, "data": by_date[d]} for d in dates],
        }
        opath = os.path.join(OUT, f"{slug(cid)}.json")
        with open(opath, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=1)
        ndays = len(dates)
        print(f"[ok] {slug(cid)}: {ndays} hari x {len(provinces)} provinsi -> {os.path.relpath(opath)}")

    print("\nSelesai. Output di data/processed/")


if __name__ == "__main__":
    main()
