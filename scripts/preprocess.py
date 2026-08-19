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

# map komoditas id -> (slug, nama asli tampilan)
COM_NAMES = {
    "1": ("beras", "Beras"),
    "2": ("daging-ayam", "Daging Ayam"),
    "3": ("daging-sapi", "Daging Sapi"),
    "4": ("telur-ayam", "Telur Ayam"),
    "5": ("bawang-merah", "Bawang Merah"),
    "6": ("bawang-putih", "Bawang Putih"),
    "7": ("cabai-merah", "Cabai Merah"),
    "8": ("cabai-rawit", "Cabai Rawit"),
    "9": ("minyak-goreng", "Minyak Goreng"),
    "10": ("gula-pasir", "Gula Pasir"),
}


def slug(cid):
    return COM_NAMES.get(cid, (f"komoditas-{cid}", "Komoditas"))[0]


def nama(cid):
    return COM_NAMES.get(cid, (f"komoditas-{cid}", "Komoditas"))[1]


def zscore_status(z):
    az = abs(z)
    if az < 1.0:
        return "stabil"
    if az < 2.0:
        return "waspada"
    return "tinggi"


def main():
    os.makedirs(OUT, exist_ok=True)
    files = glob.glob(os.path.join(RAW, f"pt{PRICE_TYPE}", "*.csv"))
    if not files:
        print(f"Tidak ada file CSV di {RAW}/pt{PRICE_TYPE}/. Jalankan scraper dulu.")
        return

    all_provinces = set()
    komoditas = []
    # mapping id -> nama asli (dari header komoditas/nama) pakai slug
    # nama asli diambil dari nama komoditas pertama di file
    for fp in sorted(files):
        cid = os.path.splitext(os.path.basename(fp))[0]
        s = slug(cid)
        # nama tampilan dari mapping; satuan default kg
        nm = nama(cid)
        satuan = "kg"
        with open(fp, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                if row.get("show", "").lower() == "true":
                    all_provinces.add(row["provinsi"])
        komoditas.append({"id": cid, "nama": nm, "slug": s, "satuan": satuan})

    meta = {
        "komoditas": sorted(komoditas, key=lambda k: int(k["id"])),
        "tipe_harga": [{"id": PRICE_TYPE, "nama": "Pasar Tradisional"}],
        "provinsi": sorted(all_provinces),
    }
    mpath = os.path.join(OUT, "meta.json")
    with open(mpath, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    print(f"[meta] {len(meta['komoditas'])} komoditas, {len(meta['provinsi'])} provinsi -> {os.path.relpath(mpath)}")

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
            "nama": nama(cid),
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
