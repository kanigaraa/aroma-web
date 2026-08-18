"""Probe endpoint histori PIHPS. Cari kombinasi param yg return data time-series panjang."""
import urllib.request, urllib.parse, http.cookiejar, json, re

BASE = "https://www.bi.go.id"
cj = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
op.addheaders = [("User-Agent", "Mozilla/5.0")]

# 1. load homepage -> GUID + session cookie
html = op.open(BASE + "/hargapangan", timeout=20).read().decode()
m = re.search(r'id="temp_id" name="temp_id" type="hidden" value="([^"]+)"', html)
print("GUID:", m.group(1) if m else "NONE")
# coba juga temp_id2/3
for k in ["temp_id","temp_id2","temp_id3"]:
    mm = re.search(rf'id="{k}" name="{k}" type="hidden" value="([^"]+)"', html)
    print(f"  {k}: {mm.group(1) if mm else '-'}")

def get(path, params):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    try:
        r = op.open(url, timeout=20).read().decode()
        return json.loads(r)
    except Exception as e:
        return {"__err": str(e)}

# 2. Tes GetChartData (homepage, TERBUKTI jalan) - default 7 hari
d = get("/hargapangan/WebSite/Home/GetChartData", {"tempId": m.group(1), "comName": "Beras Kualitas Bawah I"})
print("\nGetChartData default:", len(d.get("data", [])), "titik")
if d.get("data"): print("  first:", d["data"][0].get("date"), "last:", d["data"][-1].get("date"))

# 3. GetChartData + coba param tanggal/range lain
for extra in [
    {"tanggal": "01 Jan 2026"}, {"tanggal": "1/1/2026"},
    {"jenis": "1", "periode": "1"}, {"hari": "90"}, {"days": "90"},
]:
    dd = get("/hargapangan/WebSite/Home/GetChartData", {"tempId": m.group(1), "comName": "Beras Kualitas Bawah I", **extra})
    n = len(dd.get("data", []))
    print(f"GetChartData +{extra}: n={n}", dd.get("data",[{}])[0].get("date") if n else "")

# 4. GetGridDataKomoditas - kombinasi format tanggal
formats = {
    "ISO": ("2026-08-01", "2026-08-18"),
    "US": ("8/1/2026", "8/18/2026"),
    "US+time": ("8/1/2026 12:00:00 AM", "8/18/2026 12:00:00 AM"),
    "ISO+T": ("2026-08-01T00:00:00", "2026-08-18T00:00:00"),
    "dd-MMM-yy": ("01-Aug-2026", "18-Aug-2026"),
}
print("\n--- GetGridDataKomoditas (TabelHarga) ---")
for name,(s,e) in formats.items():
    dd = get("/hargapangan/WebSite/TabelHarga/GetGridDataKomoditas", {
        "price_type_id":1, "comcat_id":"com_1", "province_id":"", "regency_id":"",
        "showKota":"false", "showPasar":"false", "tipe_laporan":"",
        "start_date":s, "end_date":e})
    n = len(dd.get("data", []))
    print(f"  {name}: n={n}", (dd["data"][0].keys() if n else "") if isinstance(dd,dict) else dd)

# 5. GetChartKomoditas - kombinasi format tanggal + periode/tanggal khas tahun lalu
print("\n--- GetChartKomoditas (TabelHarga) ---")
for name,(s,e) in formats.items():
    dd = get("/hargapangan/WebSite/TabelHarga/GetChartKomoditas", {
        "price_type_id":1, "comcat_id":"com_1", "province_id":"", "regency_id":"",
        "start_date":s, "end_date":e})
    n = len(dd.get("data", []))
    print(f"  {name}: n={n}", list(dd.get("data",[{}])[0].keys()) if n else "")

# 6. Coba tahun 2025 (lebih mungkin ada data historis) + variasi comcat/param
print("\n--- Coba range 2025 + variasi ---")
tests = [
    ("ISO", "2025-01-01", "2025-12-31"),
    ("US", "1/1/2025", "12/31/2025"),
]
for name, s, e in tests:
    for comcat in ["com_1", "cat_1"]:
        for ep in ["/hargapangan/WebSite/TabelHarga/GetGridDataKomoditas", "/hargapangan/WebSite/TabelHarga/GetChartKomoditas"]:
            dd = get(ep, {"price_type_id":1,"comcat_id":comcat,"province_id":"","regency_id":"","start_date":s,"end_date":e})
            n = len(dd.get("data", []))
            print(f"  {ep.split('/')[-1]} {name} comcat={comcat}: n={n}", (dd['data'][0].get('date') if n else ""))

# 7. GetGridDataKomoditas tanpa tanggal (default) & hanya comcat
print("\n--- GetGridDataKomoditas tanpa tanggal ---")
for params in [
    {"price_type_id":1,"comcat_id":"com_1"},
    {"price_type_id":1,"comcat_id":"com_1","province_id":1},
    {"price_type_id":1,"comcat_id":"cat_1","province_id":1},
    {"price_type_id":1,"comcat_id":"com_1","start_date":"2026-08-18","end_date":"2026-08-18"},
]:
    dd = get("/hargapangan/WebSite/TabelHarga/GetGridDataKomoditas", params)
    n = len(dd.get("data", []))
    print(f"  {params}: n={n}", (list(dd['data'][0].keys()) if n else ""))

