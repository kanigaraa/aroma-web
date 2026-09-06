import { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "AROMA | Ketentuan Layanan",
  description: "Ketentuan layanan AROMA — aturan penggunaan aplikasi.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Ketentuan Layanan">
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
          <li>Data harga pangan disediakan apa adanya (&quot;as is&quot;) tanpa jaminan akurasi, kelengkapan, atau ketersediaan penuh.</li>
          <li>Prediksi harga bersifat estimasi berbasis model statistik dan machine learning — bukan jaminan nilai aktual di pasar.</li>
          <li>AROMA tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan informasi di aplikasi ini.</li>
          <li>Kami tidak menjamin layanan akan selalu tersedia tanpa gangguan. Downtime untuk pemeliharaan dapat terjadi.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">7. Interaksi dengan AI Assistant</h2>
        <p className="mt-2 text-secondary">
          AROMA menyediakan AI Assistant berbasis LLM (Large Language Model) untuk menjawab pertanyaan seputar data harga pangan. Respons dari AI Assistant bersifat informatif, tidak menggantikan nasihat profesional, dan mungkin mengandung ketidakakuratan. Jangan gunakan keluaran AI Assistant sebagai dasar keputusan finansial.
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
          Kami berhak menangguhkan atau mengakhiri akses akun Anda jika ditemukan pelanggaran terhadap Ketentuan Layanan ini, tanpa pemberitahuan terlebih dahulu.
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
    </LegalPage>
  );
}
