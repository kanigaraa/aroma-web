"""Scrape data cuaca historis harian (Open-Meteo) per provinsi Indonesia.

Endpoint: archive-api.open-meteo.com (gratis, tanpa API key).
Output  : data/weather/{provinsi}.json -> { provinsi, lat, lon, harian: [ {
              tanggal, hujan_mm, tmax_c, tmin_c } ] }
Period  : dari tanggal awal data harga (2024-01-01) s/d hari ini, biar nyambung
          dgn seri harga PIHPS utk korelasi/forecast.

Koordinat = ibukota tiap provinsi (referensi representatif).
"""
import json, os, urllib.request, urllib.parse, datetime, time

OUT = os.path.join(os.path.dirname(__file__), "..", "data", "weather")
START = "2024-01-01"
END = datetime.date.today().isoformat()
DELAY = 0.3

# 34 provinsi -> (lat, lon) ibukota
PROV = {
    "Aceh": (5.55, 95.32),
    "Sumatera Utara": (3.59, 98.67),
    "Sumatera Barat": (-0.95, 100.35),
    "Riau": (0.51, 101.45),
    "Jambi": (-1.59, 103.61),
    "Sumatera Selatan": (-2.99, 104.76),
    "Bengkulu": (-3.80, 102.26),
    "Lampung": (-5.45, 105.26),
    "Kepulauan Bangka Belitung": (-2.13, 106.11),
    "Kepulauan Riau": (1.05, 104.03),
    "DKI Jakarta": (-6.20, 106.85),
    "Jawa Barat": (-6.91, 107.61),
    "Jawa Tengah": (-6.97, 110.42),
    "DI Yogyakarta": (-7.80, 110.36),
    "Jawa Timur": (-7.25, 112.75),
    "Banten": (-6.12, 106.15),
    "Bali": (-8.65, 115.22),
    "Nusa Tenggara Barat": (-8.58, 116.12),
    "Nusa Tenggara Timur": (-10.18, 123.60),
    "Kalimantan Barat": (-0.03, 109.34),
    "Kalimantan Tengah": (-2.21, 113.91),
    "Kalimantan Selatan": (-3.32, 114.59),
    "Kalimantan Timur": (-0.50, 117.15),
    "Kalimantan Utara": (3.07, 116.04),
    "Sulawesi Utara": (1.47, 124.84),
    "Sulawesi Tengah": (-0.90, 119.85),
    "Sulawesi Selatan": (-5.13, 119.41),
    "Sulawesi Tenggara": (-3.97, 122.51),
    "Gorontalo": (0.54, 123.06),
    "Sulawesi Barat": (-2.68, 118.89),
    "Maluku": (-3.65, 128.19),
    "Maluku Utara": (0.62, 127.49),
    "Papua": (-2.54, 140.72),
    "Papua Barat": (-0.87, 131.25),
}


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def fetch_province(name, lat, lon):
    q = urllib.parse.urlencode({
        "latitude": lat, "longitude": lon,
        "start_date": START, "end_date": END,
        "daily": "precipitation_sum,temperature_2m_max,temperature_2m_min",
        "timezone": "Asia/Jakarta",
    })
    url = f"https://archive-api.open-meteo.com/v1/archive?{q}"
    d = get(url)
    days = d["daily"]
    rows = []
    for i, t in enumerate(days["time"]):
        rows.append({
            "tanggal": t,
            "hujan_mm": days["precipitation_sum"][i],
            "tmax_c": days["temperature_2m_max"][i],
            "tmin_c": days["temperature_2m_min"][i],
        })
    return {"provinsi": name, "lat": lat, "lon": lon, "harian": rows}


def main():
    os.makedirs(OUT, exist_ok=True)
    done = 0
    for name, (lat, lon) in sorted(PROV.items()):
        opath = os.path.join(OUT, f"{name}.json")
        if os.path.exists(opath):
            print(f"[skip] {name} (sudah ada)")
            continue
        try:
            data = fetch_province(name, lat, lon)
            with open(opath, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False)
            n = len(data["harian"])
            print(f"[ok] {name}: {n} hari ({START} s/d {END}) -> {os.path.relpath(opath)}")
            done += 1
            time.sleep(DELAY)
        except Exception as e:
            print(f"[GAGAL] {name}: {e}")
    print(f"\nSelesai. {done} provinsi baru. Output di data/weather/")


if __name__ == "__main__":
    main()
