"""Analisis korelasi cuaca (Open-Meteo) vs harga pangan (PIHPS) per provinsi.

Output: data/insight/cuaca.json
  per komoditas: { komoditas, provinsi: [ { provinsi, r_hujan, r_suhu,
    n, kekuatan } ] }

Metodologi:
- Korelasi Pearson antara cuaca harian (hujan mm, suhu C) dan harga komoditas.
- Diuji pada agregasi harian & mingguan (mingguan umumnya lebih stabil).
- Nilai r lemah (< 0.3) TIDAK dianggap kegagalan — ini temuan jujur:
  harga harian dipengaruhi banyak faktor; cuaca satu faktor saja.
- Kekuatan: lemah/sedang/kuat berdasarkan |r| (0-0.3 / 0.3-0.6 / 0.6-1).
"""
import json, os, glob, math
from collections import defaultdict
from datetime import date

PROC = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
WEA = os.path.join(os.path.dirname(__file__), "..", "data", "weather")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "insight")


def pearson(x, y):
    n = len(x)
    if n < 5:
        return None
    mx, my = sum(x) / n, sum(y) / n
    num = sum((a - mx) * (b - my) for a, b in zip(x, y))
    den = math.sqrt(sum((a - mx) ** 2 for a in x) * sum((b - my) ** 2 for b in y))
    return num / den if den else 0.0


def strength(r):
    a = abs(r)
    return "kuat" if a >= 0.6 else ("sedang" if a >= 0.3 else "lemah")


def iso_week(iso):
    y, m, d = map(int, iso.split("-"))
    return date(y, m, d).isocalendar()[:2]


def weekly(series):
    """series: [(iso_date, value)] -> {week: [values]}"""
    wk = defaultdict(list)
    for t, v in series:
        wk[iso_week(t)].append(v)
    keys = sorted(wk)
    return [sum(wk[k]) / len(wk[k]) for k in keys]  # rata-rata per minggu


def load_weather(prov):
    fp = os.path.join(WEA, f"{prov}.json")
    if not os.path.exists(fp):
        return None
    d = json.load(open(fp, encoding="utf-8"))
    return {row["tanggal"]: row for row in d["harian"]}


def main():
    os.makedirs(OUT, exist_ok=True)
    files = [f for f in glob.glob(os.path.join(PROC, "*.json")) if os.path.basename(f) != "meta.json"]
    all_insight = []
    for fp in sorted(files):
        d = json.load(open(fp, encoding="utf-8"))
        kom = d["komoditas"]
        result = {"komoditas": kom, "nama": d.get("nama", kom), "provinsi": []}
        for prov in d["provinsi"]:
            wm = load_weather(prov)
            if not wm:
                continue
            hujan_s, suhu_s, harga_s = [], [], []
            for day in d["seri"]:
                v = day["data"].get(prov)
                wd = wm.get(day["tanggal"])
                if v and v.get("harga") and wd:
                    hujan_s.append((day["tanggal"], wd["hujan_mm"]))
                    suhu_s.append((day["tanggal"], wd["tmax_c"]))
                    harga_s.append((day["tanggal"], v["harga"]))
            # sejajarkan per tanggal
            by_date = {t: (h, tmx) for (t, h), (_, tmx) in zip(hujan_s, suhu_s)}
            hx, sx, y = [], [], []
            for t, h in hujan_s:
                if t in by_date and t in {a for a, _ in harga_s}:
                    # harga di tanggal tsb
                    hv = dict(harga_s)[t]
                    hx.append(h); sx.append(by_date[t][1]); y.append(hv)
            rh = pearson(hx, y)
            rs = pearson(sx, y)
            # versi mingguan
            hw = weekly(hujan_s); sw = weekly(suhu_s); yw = weekly(harga_s)
            n = min(len(hw), len(sw), len(yw))
            rhw = pearson(hw[:n], yw[:n])
            rsw = pearson(sw[:n], yw[:n])
            result["provinsi"].append({
                "provinsi": prov,
                "n_hari": len(y),
                "r_hujan_harian": round(rh, 3) if rh is not None else None,
                "r_suhu_harian": round(rs, 3) if rs is not None else None,
                "r_hujan_mingguan": round(rhw, 3) if rhw is not None else None,
                "r_suhu_mingguan": round(rsw, 3) if rsw is not None else None,
                "kekuatan": strength(rh) if rh is not None else "n/a",
            })
        all_insight.append(result)
        print(f"[ok] {kom}: {len(result['provinsi'])} provinsi dianalisis")
    opath = os.path.join(OUT, "cuaca.json")
    with open(opath, "w", encoding="utf-8") as f:
        json.dump(all_insight, f, ensure_ascii=False, indent=1)
    print(f"\nSelesai. Output di {os.path.relpath(opath)}")


if __name__ == "__main__":
    main()
