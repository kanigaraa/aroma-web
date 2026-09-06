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
              <p>Dengan mengakses dan menggunakan AROMA, Anda bersedia terikat dengan ketentuan layanan ini. Jika tidak setuju dengan salah satu ketentuan, segera hentikan penggunaan aplikasi.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">2. Tentang AROMA</h2>
              <p>AROMA adalah aplikasi web yang menyediakan informasi dan prediksi harga pangan di Indonesia. Data harga berasal dari sumber resmi PIHPS (Pusat Informasi Harga Pangan Swalayan). Informasi yang disajikan bertujuan untuk edukasi dan analisis, bukan nasihat finansial atau perdagangan.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">3. Akun Pengguna</h2>
              <p>Anda harus berusia minimal 17 tahun untuk membuat akun AROMA. Anda bertanggung jawab menjaga kerahasiaan akun dan aktivitas yang terjadi di bawah akun Anda.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">4. Penggunaan yang Dilarang</h2>
              <p>Anda tidak diperkenankan:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>Menggunakan AROMA untuk tujuan komersial tanpa izin tertulis dari kami.</li>
                <li>Mengambil atau mencuri data secara sistematis (web scraping).</li>
                <li>Menggunakan bot atau alat otomatis untuk mengakses layanan.</li>
                <li>Melanggar hukum yang berlaku di Indonesia.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">5. Ketidakpastian dan Keterbatasan</h2>
              <p>Data harga pangan disediakan apa adanya tanpa jaminan akurasi atau ketersediaan penuh. Prediksi harga bersifat estimasi dan tidak menjamin nilai aktual di pasar. AROMA tidak bertanggung jawab atas kerugian yang timbul dari penggunaan informasi di aplikasi ini.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">6. Perubahan Ketentuan</h2>
              <p>Ketentuan layanan dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Penggunaan berkelanjutan terhadap AROMA berarti Anda menerima ketentuan yang berlaku.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">7. Hukum yang Berlaku</h2>
              <p>Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan secara musyawarah terlebih dahulu.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">8. Hubungi Kami</h2>
              <p>Pertanyaan? Kirim email ke <a href="mailto:kanigaraa@gmail.com" className="text-accent hover:underline">kanigaraa@gmail.com</a>.</p>
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