import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "AROMA | Metodologi & Sumber Data", description: "Sumber data dan batasan prediksi AROMA." };

export default function MethodologyPage() {
  return <LegalPage title="Metodologi & Sumber Data">
    <section><h2 className="text-lg font-semibold">Sumber dan pembaruan</h2><p className="mt-2 text-secondary">Harga berasal dari arsip PIHPS. AROMA menampilkan tanggal sumber pada grafik dan peta. Cakupan mengikuti provinsi serta komoditas yang memiliki observasi pada tanggal tersebut; data kosong tidak ditafsirkan sebagai harga Rp0.</p></section>
    <section><h2 className="text-lg font-semibold">Prediksi 14 hari</h2><p className="mt-2 text-secondary">Prediksi adalah estimasi 14 hari setelah tanggal observasi terakhir. Nilainya membantu membaca arah kemungkinan harga, bukan jaminan harga pasar.</p></section>
    <section><h2 className="text-lg font-semibold">Status risiko</h2><p className="mt-2 text-secondary">Status Stabil, Waspada, dan Tinggi diturunkan dari data harga yang tersedia. Gunakan bersama harga, tren, prediksi, dan konteks cuaca pada detail wilayah.</p></section>
    <section><h2 className="text-lg font-semibold">Batasan</h2><p className="mt-2 text-secondary">Ketersediaan dan tanggal arsip dapat berbeda antarwilayah. Korelasi cuaca menunjukkan hubungan dalam data, bukan bukti sebab-akibat. Selalu cocokkan dengan tanggal sumber sebelum mengambil keputusan.</p></section>
  </LegalPage>;
}
