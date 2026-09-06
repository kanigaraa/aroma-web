# AROMA

**Analisis Risiko Optimasi Masa Depan Agrikultur** — aplikasi web untuk membaca harga pangan, risiko wilayah, dan prediksi harga 14 hari berbasis arsip PIHPS.

## Demo

Video demo belum tersedia di repository. Simpan rekaman sebagai `public/demo.mp4`, lalu unggah salinannya ke GitHub Release atau YouTube dan tambahkan tautannya di bagian ini. GitHub README tidak memutar MP4 lokal secara inline.

## Fitur

- Peta risiko harga antarwilayah dengan status data yang jujur.
- Riwayat harga dan prediksi 14 hari.
- Dashboard wilayah utama, perbandingan komoditas, dan ekspor CSV.
- Alert ambang harga per akun.
- Asisten AI terbatas pada data pangan AROMA, dengan batas input, origin check, dan rate limit.
- Autentikasi email OTP dan Google OAuth.

## Sumber data dan batasan

Harga berasal dari arsip PIHPS. Tanggal sumber selalu ditampilkan di aplikasi. Prediksi bersifat estimasi, bukan jaminan harga pasar. Detail: [/metodologi](https://aroma.my.id/metodologi).

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Validasi

```bash
npm run test:chat
npx tsc --noEmit
npm run build
```

## Deploy

Deploy dilakukan melalui GitHub Actions saat merge ke `main`. Secrets Cloudflare, Better Auth, Google OAuth, Resend, dan Groq hanya disimpan server-side.
