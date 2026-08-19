# Skema Data AI AROMA (kontrak antara pipeline AI ↔ web)

Web membaca JSON statis dari `data/` (precompute, bukan realtime). Tidak perlu tahu
cara scrape/forecast — cukup ikuti skema di bawah.

## 1. Master referensi

### `data/processed/meta.json` (referensi komoditas + provinsi + tipe harga)
```json
{
  "komoditas": [
    {"id": "1", "nama": "Beras", "slug": "beras", "satuan": "kg"},
    {"id": "7", "nama": "Cabai Merah", "slug": "cabai-merah", "satuan": "kg"}
  ],
  "tipe_harga": [
    {"id": 1, "nama": "Pasar Tradisional"}
  ],
  "provinsi": ["Aceh", "Sumatera Utara", "DKI Jakarta", "..."]
}
```
- Dipakai web utk dropdown/nav komoditas & provinsi.

## 2. Data riil + status anomali (z-score)

### `data/processed/{slug}.json` — per komoditas
```json
{
  "komoditas_id": "1",
  "nama": "Beras",
  "komoditas": "beras",
  "tipe_harga": 1,
  "provinsi": ["Aceh", "...", "34 total"],
  "seri": [
    {
      "tanggal": "2026-08-01",
      "data": {
        "DKI Jakarta": {
          "harga": 16850,
          "avg": 16500,
          "stddev": 300,
          "kelompok": 3,
          "zscore": 1.17,
          "status": "waspada"
        },
        "Jawa Barat": { "...": "..." }
      }
    }
  ]
}
```

**Field `status` (deteksi anomali, dari z-score):**
| status | kondisi | arti |
|---|---|---|
| `stabil` | \|z\| < 1.0 | harga normal |
| `waspada` | 1.0 ≤ \|z\| < 2.0 | harga mulai menyimpang |
| `tinggi` | \|z\| ≥ 2.0 | anomali / ekstrem |

**Field `kelompok`**: klasifikasi risiko PIHPS (0-7, dari API). Semakin tinggi = semakin
menyimpang dari rata-rata. (0/1 = rendah, dst.)

## 3. Forecast (Prophet)

### `data/forecast/{slug}.json` — per komoditas
```json
{
  "komoditas": "beras",
  "tipe_harga": 1,
  "horizon_days": 14,
  "provinsi": {
    "DKI Jakarta": {
      "last_date": "2026-08-16",
      "horizon": 14,
      "seri": [
        {
          "tanggal": "2026-08-16",
          "harga": 16850,
          "forecast": 16841,
          "lower": 16790,
          "upper": 16895,
          "is_future": false
        },
        {
          "tanggal": "2026-08-17",
          "harga": null,
          "forecast": 16827,
          "lower": 16772,
          "upper": 16882,
          "is_future": true
        }
      ]
    }
  }
}
```

**Cara baca utk chart:**
- `is_future=false` → data riil (pakai `harga`)
- `is_future=true` → hasil forecast (pakai `forecast`, band `lower`–`upper`)
- Gabungkan dua-duanya utk 1 chart garis: riil + proyeksi + confidence band.

## Ringkasan alur data
```
scrape_pihps.py → data/raw/{pt1}/{id}.csv      (mentah, per komoditas×tanggal×provinsi)
preprocess.py   → data/processed/{slug}.json   (+ z-score status, kelompompok)
forecast.py     → data/forecast/{slug}.json    (Prophet 14 hari + confidence)
meta            → data/processed/meta.json     (referensi)
```

## Catatan web
- Semua JSON di `data/` = commit ke repo (copy cadangan, juri lihat datanya).
- App baca via `fs`/`import` saat build (SSG) — bukan fetch runtime.
- Tambah `data/` ke API route atau import langsung di komponen.
