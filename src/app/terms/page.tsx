import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AROMA | Ketentuann Layanan",
  description: "Ketentuan layanan AROMA — aturan penggunaan aplikasi.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <svg height="32" width="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="2" y="14" width="6" height="16" rx="1" fill="#10B981"/>
            <rect x="10" y="8" width="6" height="22" rx="1" fill="#059669"/>
            <rect x="18" y="2" width="6" height="28" rx="1" fill="#047857"/>
            <rect x="26" y="5" width="4" height="25" rx="1" fill="#10B981" opacity="0.7"/>
          </svg>
          <Link href="/" className="font-bold text-primary tracking-tight text-xl">AROMA</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-primary">Ketentuan Layanan</h1>
        <p className="mb-8 text-sm text-secondary">Terakhir diperbarui: September 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-primary">
          <section>
            <h2 className="text-lg font-semibold">1. Penerimaan Syarat</h2>
            <p className="mt-2 text-secondary">
              Dengan mengakses dan menggunakan AROMA di{" "}
              <a href="https://aroma.my.id" className="text-accent hover:underline">aroma.my.id</a>, Anda menyatakan telah membaca, memahami, dan setuju untuk terikat dengan Ketentuan Layanan ini. Jika Anda tidak setuju dengan salah satu ketentuan, segera hentikan penggunaan aplikasi.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Tentang AROMA</h2>
            <p className="mt-2 text-secondary">
              AROMA adalah aplikasi web yang menyediakan informasi dan prediksi harga pangan di Indonesia. AROMA mengumpulkan, mengolah, dan menampilkan data harga 10 jenis komoditas pertanian (Beras, Cabai Rawit, Cabai Merah, Bawang Merah, Daging Sapi, Telur Ayam, Minyak Goreng, Gula Pasir, Tepung Terigu, Jagung) dari sumber resmi PIHPS dan menyajikan prediksi harga 14 hari ke depan per provinsi.
            </p>
            <p className="mt-2 text-secondary">
              Informasi yang disajikan bertujuan untuk edukasi, referensi analisis, dan mendukung pengambilan keputusan berbasis data. Informasi ini bukan nasihat finansial, investasi, atau perdagangan. AROMA tidak bertanggung jawab atas keputusan yang diambil berdasarkan informasi di aplikasi ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Akun Pengguna</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
              <li>Anda harus berusia minimal 17 tahun untuk membuat akun AROMA.</li>
              <li>Anda bertanggung jawab menjaga kerahasiaan kredensial akun (email dan kata sandi).</li>
              <li>Semua aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab pemilik akun.</li>
              <li>Anda wajib segera memberi tahu kami jika ada akses tidak sah ke akun Anda di{" "}
                <a href="mailto:support@aroma.my.id" className="text-accent hover:underline">support@aroma.my.id</a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Penggunaan yang Dilarang</h2>
            <p className="mt-2 text-secondary">Anda tidak diperkenankan:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
              <li>Menggunakan AROMA atau datanya untuk tujuan komersial tanpa izin tertulis dari kami.</li>
              <li>Mengambil, menyalin, atau mengekstrak data secara sistematis melalui scraping, crawling, atau cara otomatis lainnya.</li>
              <li>Menggunakan bot, script, atau alat otomatis untuk mengakses atau mengganggu layanan AROMA.</li>
              <li>Mengubah, merusak, atau men-deface bagian mana pun dari aplikasi AROMA.</li>
              <li>Melanggar hukum yang berlaku di Republik Indonesia.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Properti Intelektual</h2>
            <p className="mt-2 text-secondary">
              Seluruh konten, desain, logo, kode, dan material lain di AROMA adalah milik AROMA atau pemberi lisensinya dan dilindungi oleh hak cipta Indonesia serta internasional. Anda tidak diperkenankan menggunakan materi tersebut di luar penggunaan pribadi dan non-komersial.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Ketidakpastian dan Keterbatasan</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
              <li>Data harga pangan disediakan apa adanya ("as is") tanpa jaminan akurasi, kelengkapan, atau ketersediaan penuh.</li>
              <li>Prediksi harga bersifat estimasi berbasis model statistik dan machine learning — bukan jaminan nilai actual di pasar.</li>
              <li>AROMA tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan informasi di aplikasi ini.</li>
              <li>Kami tidak menjamin layanan akan selalu tersedia tanpa gangguan. Downtime untuk pemeliharaan dapat terjadi.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Interaksi dengan AI Assistant</h2>
            <p className="mt-2 text-secondary">
              AROMA menyediakan AI Assistant berbasis LLM (Large Language Model) untuk menjawab pertanyaan seputar data harga pangan. Responses dari AI Assistant bersifat informatif, tidak menggantikan nasihat profesional, dan mungkin mengandung inaccuracies. Jangan gunakan outputs AI Assistant sebagai dasar keputusan finansial.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Perubahan Ketentuan</h2>
            <p className="mt-2 text-secondary">
              Ketentuan Layanan ini dapat berubah sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui banner di aplikasi atau email yang terdaftar. Penggunaan berkelanjutan terhadap AROMA setelah perubahan berarti Anda menerima ketentuan yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. Pengakhiran Layanan</h2>
            <p className="mt-2 text-secondary">
              Kami berhak menangguhkan atau mengakhiri akses akun Anda jika ditemukan pelanggaran terhadap Ketentuan Layanan ini, tanpa notice terlebih dahulu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">10. Hukum yang Berlaku</h2>
            <p className="mt-2 text-secondary">
              Ketentuan Layanan ini diatur oleh hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan secara musyawarah terlebih dahulu. Jika musyawarah tidak mencapai kesepakatan, para pihak sepakat menyelesaikan sengketa di Pengadilan Negeri Jakarta Selatan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">11. Hubungi Kami</h2>
            <p className="mt-2 text-secondary">
              Pertanyaan, keberatan, atau laporan pelanggaran Ketentuan Layanan? Kirim email ke{" "}
              <a href="mailto:support@aroma.my.id" className="text-accent hover:underline">support@aroma.my.id</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}