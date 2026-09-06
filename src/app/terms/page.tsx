import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/landing.module.css";

export const metadata: Metadata = { title: "AROMA | Ketentuan Layanan", description: "Ketentuan layanan AROMA." };

export default function TermsPage() {
  return (
    <div className={styles.landing}>
      <main className="min-h-screen bg-background px-6 py-16">
        <article className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-3xl font-bold text-primary">Ketentuan Layanan</h1>
          <p className="mb-8 text-sm text-secondary">Terakhir diperbarui: September 2026</p>

          <section className="space-y-8 text-sm text-copy">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">1. Penerimaan Syarat</h2>
              <p>Dengan mengakses dan menggunakan AROMA, Anda bersedia terikat dengan ketentuan ini. Jika tidak setuju, jangan gunakan layanan ini.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">2. Deskripsi Layanan</h2>
              <p>AROMA menyediakan informasi harga pangan dari sumber resmi (PIHPS) untuk tujuan edukasi dan analisis. Data disajikan apa adanya tanpa jaminan akurasi mutlak.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">3. Penggunaan yang Dilarang</h2>
              <p>Anda tidak boleh menggunakan AROMA untuk mencuri data secara sistematis, menggunakan untuk tujuan komersial tanpa izin, atau做任何 hal yang melanggar hukum yang berlaku di Indonesia.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">4. Tidak Ada Jaminan</h2>
              <p>Informasi harga pangan disediakan "apa adanya". Kami tidak menjamin data selalu akurat atau tersedia setiap saat.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">5. Batasan Tanggung Jawab</h2>
              <p>Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan data di AROMA. Gunakan informasi ini sebagai referensi, bukan nasihat finansial.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">6. Perubahan Ketentuan</h2>
              <p>Ketentuan dapat berubah sewaktu-waktu. Penggunaan berkelanjutan berarti penerimaan terhadap ketentuan yang berlaku.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">7. Kontak</h2>
              <p>Pertanyaan? Hubungi <a href="mailto:adlafayyaz@aroma.my.id" className="text-accent hover:underline">adlafayyaz@aroma.my.id</a></p>
            </div>
          </section>

          <div className="mt-10 border-t border-border pt-6">
            <Link href="/" className="text-sm text-accent hover:underline">← Kembali ke Beranda</Link>
          </div>
        </article>
      </main>
    </div>
  );
}