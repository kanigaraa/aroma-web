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
              <h2 className="mb-2 text-lg font-semibold text-primary">1. Data yang Kami Kumpulkan</h2>
              <p>AROMA menyimpan data harga pangan dari sumber resmi (PIHPS) dan data akun pengguna (email) untuk keperluan autentikasi. Kami tidak menjual atau membagikan data pribadi kepada pihak ketiga.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">2. Penggunaan Data</h2>
              <p>Data email digunakan untuk login dan komunikasi terkait akun. Data harga pangan ditampilkan untuk keperluan informasi publik.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">3. Cookie</h2>
              <p>Kami menggunakan cookie sesi untuk autentikasi. Cookie tidak melacak aktivitas di luar aplikasi AROMA.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">4. Keamanan</h2>
              <p>Autentikasi dilindungi oleh Better Auth dengan enkripsi standar industri. Kata sandi tidak disimpan dalam bentuk plain text.</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-primary">5. Kontak</h2>
              <p>Hubungi kami di <a href="mailto:adlafayyaz@aroma.my.id" className="text-accent hover:underline">adlafayyaz@aroma.my.id</a> untuk pertanyaan terkait privasi.</p>
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