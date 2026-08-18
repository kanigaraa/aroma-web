"""Scraper incremental data harga pangan PIHPS (Bank Indonesia).
Endpoint: GetVectorMapData -> harga per komoditas per tanggal, semua provinsi.
Resume otomatis: skip tanggal yang file-nya sudah ada di data/raw.
Throttle: 0.5s antara request utk hindari rate-limit.
Output: data/raw/{tipe_harga}/{komoditas_id}.csv
  kolom: tanggal, provinsi_id, provinsi, harga, avg, stddev, kelompok, persen, diff
"""
import urllib.request, urllib.parse, http.cookiejar, json, re, os, time, sys, csv, datetime

BASE = "https://www.bi.go.id"
RAW = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
PRICE_TYPES = [1]  # 1=Pasar Tradisional, 2=Modern, 3=Pedagang Besar, 4=Produsen
START_DATE = "2024-01-01"
DELAY = 0.3  # detik antar request
# komoditas utama utk MVP (bisa diperluas)
MAIN_COMMODITIES = ["Beras", "Daging Ayam", "Daging Sapi", "Telur Ayam", "Bawang Merah", "Bawang Putih", "Cabai Merah", "Cabai Rawit", "Minyak Goreng", "Gula Pasir"]


def make_session():
    cj = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")]
    html = op.open(BASE + "/hargapangan", timeout=30).read().decode()
    m = re.search(r'id="temp_id" name="temp_id" type="hidden" value="([^"]+)"', html)
    if not m:
        raise RuntimeError("Gagal ambil session GUID")
    return op, m.group(1)


def get_json(op, path, params):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    for attempt in range(3):
        try:
            r = op.open(url, timeout=30).read().decode()
            return json.loads(r)
        except Exception as e:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))


def date_range(start, end):
    d = datetime.date.fromisoformat(start)
    ed = datetime.date.fromisoformat(end)
    while d <= ed:
        yield d
        d += datetime.timedelta(days=1)


def fmt_tanggal(d):
    # format "1 Jan 2025" (yg dikenali endpoint)
    return d.strftime("%-d %b %Y") if os.name != "nt" else d.strftime("%d %b %Y")


def main():
    os.makedirs(RAW, exist_ok=True)
    op, guid = make_session()
    print(f"[init] session GUID ok: {guid[:8]}...")

    # daftar komoditas leaf, filter ke komoditas utama
    tree = get_json(op, "/hargapangan/WebSite/Home/GetCommoditiesTree", {})
    all_com = [(x["TreeID"], x["TreeName"]) for x in tree["data"] if x["HasCom"]]
    commodities = [(i, n) for i, n in all_com if n in MAIN_COMMODITIES]
    print(f"[init] {len(commodities)}/{len(all_com)} komoditas utama: {[c[1] for c in commodities]}")

    today = datetime.date.today()
    total_days = sum(1 for _ in date_range(START_DATE, today.isoformat()))
    total_skipped = 0
    total_fetched = 0

    for pt in PRICE_TYPES:
        pt_dir = os.path.join(RAW, f"pt{pt}")
        os.makedirs(pt_dir, exist_ok=True)
        for cid, cname in commodities:
            out = os.path.join(pt_dir, f"{cid}.csv")
            exists = set()
            if os.path.exists(out):
                with open(out, newline="", encoding="utf-8") as f:
                    for row in csv.DictReader(f):
                        exists.add(row["tanggal"])
            # tulis header jika baru
            new_file = not os.path.exists(out)
            fh = open(out, "a", newline="", encoding="utf-8")
            w = csv.DictWriter(fh, fieldnames=["tanggal", "provinsi_id", "provinsi", "harga", "avg", "stddev", "kelompok", "persen", "diff", "show"])
            if new_file:
                w.writeheader()
            day_count = 0
            for d in date_range(START_DATE, today.isoformat()):
                ds = d.isoformat()
                if ds in exists:
                    continue
                # pakai tanggal sebelumnya utk harga? endpoint butuh tanggal yg punya data.
                # lewati weekend-ish kosong dengan retry: kalau kosong, coba -1 hari.
                params = {"commodity": cid, "priceType": pt, "provId": 0, "tanggal": fmt_tanggal(d)}
                try:
                    data = get_json(op, "/hargapangan/WebSite/Home/GetVectorMapData", params)
                except Exception:
                    break  # rate-limit/block -> stop, resume nanti
                rows = data.get("data", [])
                any_show = False
                for x in rows:
                    v = x.get("Value", {})
                    w.writerow({
                        "tanggal": ds, "provinsi_id": v.get("id", ""),
                        "provinsi": v.get("name", ""), "harga": v.get("nilai", ""),
                        "avg": v.get("avg", ""), "stddev": v.get("stdDev", ""),
                        "kelompok": v.get("kelompok", ""), "persen": v.get("percentage", ""),
                        "diff": v.get("nilaiDiff", ""), "show": v.get("show", ""),
                    })
                    if v.get("show"):
                        any_show = True
                if any_show:
                    day_count += 1
                    total_fetched += 1
                fh.flush()
                time.sleep(DELAY)
            fh.close()
            total_skipped += len(exists)
            print(f"[done] pt{pt} {cname} (id={cid}): +{day_count} hari baru, {len(exists)} hari sudah ada -> {os.path.relpath(out)}")
        print(f"[done] tipe harga pt{pt} selesai")

    print(f"\n[summary] total hari baru: {total_fetched}, sudah ada: {total_skipped}")
    print("Selesai. Jalankan lagi kapan pun utk ambil data terbaru / lanjutkan scraping.")


if __name__ == "__main__":
    main()
