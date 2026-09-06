import { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "AROMA | Kebijakan Privasi",
  description: "Kebijakan privasi AROMA — bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Kebijakan Privasi">
      <section>
        <h2 className="text-lg font-semibold">1. Pendahuluan</h2>
        <p className="mt-2 text-secondary">
          AROMA (&quot;kami&quot;, &quot;layanan&quot;) berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami di{" "}
          <a href="https://aroma.my.id" className="text-accent hover:underline">aroma.my.id</a>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">2. Informasi yang Kami Kumpulkan</h2>
        <p className="mt-2 text-secondary">Kami mengumpulkan data berikut:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
          <li><strong className="text-primary">Data akun:</strong> Alamat email, nama, dan ID akun yang Anda berikan saat mendaftar.</li>
          <li><strong className="text-primary">Provinsi:</strong> Provinsi domisili yang Anda pilih saat registrasi, untuk menampilkan data harga lokal.</li>
          <li><strong className="text-primary">Data penggunaan:</strong> Komoditas yang Anda lihat, provinsi yang dipilih, dan interaksi dengan fitur prediksi — digunakan untuk meningkatkan pengalaman dan akurasi rekomendasi.</li>
          <li><strong className="text-primary">Data harga pangan:</strong> Data harga komoditas pertanian Indonesia (10 jenis: Beras, Cabai Rawit, Cabai Merah, Bawang Merah, Daging Sapi, Telur Ayam, Minyak Goreng, Gula Pasir, Tepung Terigu, Jagung) bersumber dari PIHPS untuk prediksi dan analisis.</li>
          <li><strong className="text-primary">Data teknis:</strong> Alamat IP, jenis browser, dan log server untuk keamanan dan debugging.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">3. Cara Kami Menggunakan Informasi</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
          <li>Menyediakan autentikasi, keamanan akun, dan pengelolaan sesi.</li>
          <li>Menampilkan data harga pangan dari arsip PIHPS beserta prediksi 14 hari per provinsi dan komoditas yang tersedia.</li>
          <li>Mengirim notifikasi terkait akun Anda (verifikasi email, reset kata sandi).</li>
          <li>Memperbaiki dan meningkatkan kualitas layanan serta akurasi prediksi.</li>
          <li>Menganalisis tren harga pangan untuk menyediakan insight berbasis AI.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">4. Dasar Hukum Pemrosesan</h2>
        <p className="mt-2 text-secondary">
          Kami memproses data Anda berdasarkan persetujuan yang Anda berikan saat mendaftar, serta berdasarkan kepentingan sah kami dalam menyediakan layanan prediksi harga pangan yang akurat.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">5. Pembagian dan Pengungkapan Data</h2>
        <p className="mt-2 text-secondary">Kami tidak menjual atau menyewakan data pribadi Anda. Data hanya dibagikan dalam kondisi berikut:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
          <li><strong className="text-primary">Penyedia layanan:</strong> Better Auth untuk autentikasi, Cloudflare untuk hosting dan keamanan, PIHPS sebagai sumber data harga. Semua terikat perjanjian kerahasiaan.</li>
          <li><strong className="text-primary">Kewajiban hukum:</strong> Jika diharuskan oleh peraturan perundang-undangan Indonesia.</li>
          <li><strong className="text-primary">Transfer bisnis:</strong> Jika AROMA digabungkan atau diakuisisi, data akan ditransfer sesuai kebijakan ini.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">6. Penyimpanan dan Keamanan Data</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
          <li>Data akun disimpan di database terenkripsi di Cloudflare D1 (SQLite terenkripsi).</li>
          <li>Kata sandi tidak pernah disimpan dalam bentuk teks biasa — menggunakan hashing bcrypt/argon2 via Better Auth.</li>
          <li>Semua komunikasi antara browser dan server dilindungi oleh TLS 1.2+.</li>
          <li>Data harga pangan bersifat publik dan tidak termasuk data pribadi.</li>
          <li>Kami tidak menyimpan data pembayaran — semua transaksi ditangani oleh pihak ketiga.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">7. Retensi Data</h2>
        <p className="mt-2 text-secondary">
          Akun Anda dan data terkait disimpan selama akun aktif. Untuk meminta penghapusan akun dan data pribadi, hubungi support@aroma.my.id. Data agregat tanpa identifier pribadi dapat disimpan tanpa batas.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">8. Hak Anda</h2>
        <p className="mt-2 text-secondary">Anda memiliki hak berikut terkait data pribadi:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
          <li><strong className="text-primary">Akses:</strong> Mengetahui data apa yang kami simpan tentang Anda.</li>
          <li><strong className="text-primary">Koreksi:</strong> Memperbaiki data yang tidak akurat.</li>
          <li><strong className="text-primary">Penghapusan:</strong> Menghapus akun dan data pribadi.</li>
          <li><strong className="text-primary">Portabilitas:</strong> Mendapatkan salinan data Anda dalam format terstruktur.</li>
          <li><strong className="text-primary">Keberatan:</strong> Menolak pemrosesan data untuk tujuan tertentu.</li>
        </ul>
        <p className="mt-2 text-secondary">
          Untuk menggunakan hak-hak di atas, silakan hubungi kami di{" "}
          <a href="mailto:support@aroma.my.id" className="text-accent hover:underline">support@aroma.my.id</a>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">9. Cookie dan Teknologi Serupa</h2>
        <p className="mt-2 text-secondary">Kami menggunakan:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-secondary">
          <li><strong className="text-primary">Cookie sesi:</strong> Untuk autentikasi dan menjaga sesi login Anda. Berlaku saat browser terbuka.</li>
          <li><strong className="text-primary">Cookie preferensi:</strong> Untuk mengingat provinsi pilihan dan pengaturan tampilan Anda.</li>
          <li>Kami tidak menggunakan cookie untuk pelacakan lintas-situs atau iklan.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">10. Cookie Pihak Ketiga</h2>
        <p className="mt-2 text-secondary">
          AROMA tidak menggunakan cookie pihak ketiga untuk iklan atau pelacakan. Kami hanya menggunakan layanan yang diperlukan untuk operasi aplikasi (autentikasi, hosting).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">11. Anak-anak</h2>
        <p className="mt-2 text-secondary">
          AROMA tidak secara sengaja mengumpulkan data dari anak-anak di bawah 17 tahun. Jika Anda mengetahui bahwa data anak di bawah 17 tahun telah diberikan, silakan hubungi kami dan kami akan segera menghapusnya.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">12. Perubahan Kebijakan Ini</h2>
        <p className="mt-2 text-secondary">
          Kebijakan Privasi ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui banner di aplikasi atau email. Penggunaan berkelanjutan terhadap AROMA setelah perubahan berarti Anda menyetujui kebijakan yang diperbarui.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">13. Hubungi Kami</h2>
        <p className="mt-2 text-secondary">
          Jika ada pertanyaan, keberatan, atau permintaan terkait Kebijakan Privasi ini, hubungi kami di{" "}
          <a href="mailto:support@aroma.my.id" className="text-accent hover:underline">support@aroma.my.id</a>.
        </p>
      </section>
    </LegalPage>
  );
}
