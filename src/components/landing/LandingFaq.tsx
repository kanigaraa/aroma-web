import styles from "@/app/landing.module.css";

type Props = { commodityCount: number; provinceCount: number };

export default function LandingFaq({ commodityCount, provinceCount }: Props) {
  const questions = [
    {
      question: "Apa saja yang bisa dipantau di AROMA?",
      answer: `AROMA menyediakan data ${commodityCount} komoditas pangan di ${provinceCount} provinsi. Kamu bisa melihat riwayat harga, prediksi, dan perbandingan harga antarprovinsi melalui dashboard, halaman komoditas, serta peta.`,
    },
    {
      question: "Apakah harga yang ditampilkan selalu harga hari ini?",
      answer: "Harga mengikuti arsip PIHPS yang tersedia di AROMA. Periksa tanggal pada grafik atau detail harga untuk mengetahui periode datanya. Tanggal terakhir dalam arsip bisa berbeda dari hari ini.",
    },
    {
      question: "Bagaimana membaca prediksi harga 14 hari?",
      answer: "Pilih komoditas dan provinsi untuk melihat prediksi setelah periode data historis. Rentang 14 hari mengikuti tanggal pada grafik. Gunakan prediksi untuk memahami kemungkinan arah harga; harga yang terjadi bisa berbeda dari perkiraan.",
    },
    {
      question: "Apa yang bisa saya lakukan di peta risiko?",
      answer: "Kamu bisa memilih komoditas, mencari provinsi, dan menyaring wilayah berdasarkan status Stabil, Waspada, atau Tinggi. Pilih wilayah untuk melihat harga, riwayat, dan prediksinya, lalu bandingkan dengan provinsi lain.",
    },
    {
      question: "Bagaimana AROMA menghubungkan cuaca dan harga?",
      answer: "Halaman detail komoditas menampilkan korelasi curah hujan dan suhu dengan harga pada wilayah yang memiliki data. Korelasi menunjukkan kecenderungan hubungan dalam data, bukan kepastian bahwa cuaca menyebabkan perubahan harga.",
    },
    {
      question: "Apa yang bisa ditanyakan kepada asisten AI?",
      answer: "Tanyakan ringkasan harga pangan, arah prediksi, atau hubungan cuaca dengan harga. Asisten menggunakan konteks data AROMA untuk membantu menjelaskan angkanya. Untuk rincian tiap wilayah dan periode, cocokkan jawaban dengan grafik serta tabel komoditas.",
    },
  ];

  return (
    <section id="faq" className={`${styles.container} ${styles.faq}`} aria-labelledby="faq-heading">
      <div className={styles.faqHeading}>
        <h2 id="faq-heading">Kenali AROMA<br /><em>lebih dekat.</em></h2>
        <p>Jawaban untuk pertanyaan seputar data dan cara menggunakan AROMA.</p>
      </div>
      <div className={styles.faqList}>
        {questions.map(({ question, answer }) => (
          <details key={question} name="aroma-faq" className={styles.faqItem}>
            <summary>{question}<span className={styles.faqToggle} aria-hidden="true" /></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
