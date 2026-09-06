import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/landing.module.css";

export const metadata: Metadata = { title: "AROMA | Kebijakan Privasi", description: "Kebijakan privasi AROMA." };

export default function PrivacyPage() {
  return (
    <div className={styles.landing}>
      <main className="min-h-screen bg-background px-6 py-16">
        <article className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-3xl font-bold text-primary">Kebijakan Privasi</h1>
          <p className="mb-8 text-sm text-secondary">Terakhir diperbarui: September 2026</p>

          <section className="space-y-6 text-sm text-copy">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">1. Pendahuluan</h2>
              <p>Kebijakan Privasi ini menjelaskan bagaimana AROMA ("kami", "aplikasi") mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda ketika menggunakan layanan kami di aroma.my.id.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">2. Informasi yang Kami Kumpulkan</h2>
              <p>Kami mengumpulkan informasi berikut:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li><strong>Data akun:</strong> Alamat email dan nama yang Anda berikan saat mendaftar.</li>
                <li><strong>Data penggunaan:</strong> Informasi tentang bagaimana Anda menggunakan aplikasi AROMA.</li>
                <li><strong>Data harga pangan:</strong> Data harga komoditas pertanian dari sumber resmi PIHPS yang kami olah untuk prediksi dan analisis.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">3. Cara Kami Menggunakan Informasi</h2>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>Menyediakan layanan autentikasi dan akun pengguna.</li>
                <li>Menampilkan data dan prediksi harga pangan.</li>
                <li>Menghubungi Anda terkait akun dan layanan.</li>
                <li>Memperbaiki dan meningkatkan kualitas layanan.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">4. Pembagian dan Pengungkapan</h2>
              <p>Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan data jika diharuskan oleh hukum.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">5. Keamanan Data</h2>
              <p>Kami menggunakan standar enkripsi industri untuk melindungi data Anda. Autentikasi dikelola oleh Better Auth. Kata sandi tidak pernah disimpan dalam bentuk teks biasa.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">6. Hak Anda</h2>
              <p>Anda berhak mengakses, memperbaiki, atau menghapus data akun Anda kapan saja. Hubungi kami untuk permintaan terkait data pribadi Anda.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">7. Cookie</h2>
              <p>Kami menggunakan cookie sesi untuk autentikasi. Cookie tidak digunakan untuk melacak aktivitas Anda di luar aplikasi AROMA.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">8. Perubahan Kebijakan</h2>
              <p>Kebijakan Privasi ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui aplikasi.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">9. Hubungi Kami</h2>
              <p>Jika ada pertanyaan tentang Kebijakan Privasi ini, hubungi kami di <a href="mailto:kanigaraa@gmail.com" className="text-accent hover:underline">kanigaraa@gmail.com</a>.</p>
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