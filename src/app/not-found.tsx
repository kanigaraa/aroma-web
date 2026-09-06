import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TerraceBackdrop from "@/components/landing/TerraceBackdrop";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeader from "@/components/landing/LandingHeader";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.landscape} aria-hidden="true">
        <TerraceBackdrop idPrefix="not-found" />
      </div>
      <LandingHeader />
      <main id="konten" className={styles.content}>
        <p className={styles.code} aria-label="Error 404">404</p>
        <h1>Tidak semua hal bisa diprediksi.<br /><em>Termasuk halaman ini.</em></h1>
        <p className={styles.description}>Halaman yang kamu cari tidak ditemukan.<br />Kembali ke beranda untuk melanjutkan.</p>
        <Link href="/" className={styles.button}>
          <ArrowLeft size={18} aria-hidden="true" /> Kembali ke beranda
        </Link>
      </main>
      <LandingFooter />
    </div>
  );
}
