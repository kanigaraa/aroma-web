# AROMA — AI Data Pipeline (PIHPS)

Bagian AI: scrape data harga pangan PIHPS (Bank Indonesia) → preprocess → deteksi anomali + forecasting.

## Status (18 Agu 2026)

- ✅ API PIHPS berhasil diakses programatik (session GUID + cookie)
- ✅ Endpoint `GetVectorMapData` mengembalikan harga per komoditas per tanggal, semua provinsi
- ✅ Data historis tersedia dari 2022 (34 provinsi), 2024 parsial (23)
- ✅ Struktur data kaya: `harga`, `avg`, `stddev`, `kelompok` (klasifikasi risiko), `percentage`, `diff`
- ✅ Scraper incremental jalan: `scripts/scrape_pihps.py`
- ⏳ Scraping 5 komoditas utama × 2024–2026 berjalan

## Endpoint PIHPS (terverifikasi)

| Endpoint | Fungsi |
|---|---|
| `Home/GetProvinceAll` | 38 provinsi |
| `Home/GetCommoditiesTree` | 10 komoditas strategis |
| `Home/GetType` | 4 tipe harga (Tradisional/Modern/Pedagang Besar/Produsen) |
| `Home/GetVectorMapData` | Harga per komoditas×tanggal×provinsi + avg + stddev + kelompok |
| `Home/GetChartData` | Time-series harian per komoditas (7 hari terakhir) |

## Cara akses (penting)

1. GET `/hargapangan` → ambil session cookie + hidden `temp_id` (GUID)
2. Pakai cookie + GUID utk panggil endpoint data
3. `GetVectorMapData` butuh param: `commodity`(TreeID), `priceType`, `provId`, `tanggal`(format `01 Jan 2025`)

## Komoditas utama (10)

Beras, Daging Ayam, Daging Sapi, Telur Ayam, Bawang Merah, Bawang Putih, Cabai Merah, Cabai Rawit, Minyak Goreng, Gula Pasir

## Catatan

- Data default 7-hari di dashboard; data historis via `GetVectorMapData` per tanggal (2022+)
- `avg` + `stddev` sudah disediakan API → bahan langsung utk z-score/deteksi anomali
- `kelompok` = klasifikasi risiko (0-7) sudah ada dari API

## Next steps (AI)

1. ✅ Scrape → `data/raw/pt{tipe}/komoditas_id.csv`
2. ⬜ Preprocess → JSON bersih per komoditas × provinsi
3. ⬜ Deteksi anomali (z-score) → status Stabil/Waspada/Tinggi
4. ⬜ Forecasting (Prophet) → proyeksi N hari
5. ⬜ (opsional) Gemini narasi peringatan
