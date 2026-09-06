# Konfigurasi chatbot AROMA

Chatbot `/api/chat` dan ringkasan `/api/insight` memakai Groq melalui server. Tidak perlu dependency SDK tambahan.

## Environment lokal

Isi variabel berikut di `.env.local` (atau `.env` yang sudah ada):

```dotenv
GROQ_API_KEY=isi_api_key_groq
GROQ_MODEL=qwen/qwen3.8-27b
```

`GROQ_API_KEY` wajib. Buat key di https://console.groq.com/keys. `GROQ_MODEL` opsional; default adalah `qwen/qwen3.8-27b`. Model harus tersedia untuk akun Groq yang dipakai; daftar resmi: https://console.groq.com/docs/models.

Jangan memakai awalan `NEXT_PUBLIC_` untuk key. `.env.example` hanya template kosong; jangan menimpa env yang sudah berisi kredensial. Restart `npm run dev` setelah mengubah env.

## Cloudflare Workers

Model ditentukan di `[vars]` pada `wrangler.toml`. Simpan API key sebagai secret, bukan di file konfigurasi:

```sh
npx wrangler secret put GROQ_API_KEY
```

Untuk preview lokal Wrangler, isi `GROQ_API_KEY` di `.dev.vars` (diabaikan Git). Helper membaca env Node.js dan binding Cloudflare. Setelah konfigurasi, jalankan alur build/deploy proyek yang biasa digunakan.

## Konteks data dan pengecekan

`npm run chat:context` membuat `src/lib/generated/chat-context.json` dari data repository. Perintah ini berjalan otomatis sebelum `npm run dev` dan `npm run build`, termasuk build Next.js yang dijalankan OpenNext. Jalankan ulang setelah memperbarui dataset pada dev server aktif. Konteks diimpor ke bundle sehingga chatbot tidak membaca filesystem pada request Workers.

Snapshot mencakup tanggal, satuan, harga per provinsi, rata-rata, pembanding tepat tujuh hari sebelumnya jika tersedia, prediksi per provinsi, dan sampel korelasi cuaca. Server mengirim ringkasan semua komoditas, serta detail komoditas/provinsi yang disebut dalam pertanyaan terakhir untuk membatasi penggunaan token. Untuk pertanyaan lanjutan tentang detail, sebutkan kembali nama komoditas/provinsi. Riwayat dibatasi 20 pesan dan 8.000 karakter. Jawaban harus menyebut tanggal data; snapshot bukan data real-time.

Uji dengan pertanyaan “Berapa harga beras di Aceh berdasarkan data terakhir?” melalui tombol Asisten AI. Endpoint menerima `{ "messages": [{ "role": "user", "content": "Harga beras?" }] }` dan mengembalikan `{ "text": "..." }`.

Status error: `400` input tidak valid, `413` payload terlalu panjang, `429` batas Groq tercapai, `502` kegagalan provider, `503` key belum diisi, `504` timeout setelah 30 detik. Maksimal 2.000 karakter per pesan dan 20 pesan terakhir dikirim ke provider. Detail error provider dan key tidak dikirim ke browser.

Jalankan `npm run test:chat` untuk tes kontrak endpoint dan error provider tanpa memakai kuota Groq.
