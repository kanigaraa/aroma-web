import Link from "next/link";
import Logo from "@/components/Logo";
import styles from "@/app/landing.module.css";

export default function LandingFooter() {
  return (
    <footer className={`${styles.landing} ${styles.footerSurface}`}>
      <div className={`${styles.container} ${styles.footer}`}>
        <Link href="/" className={styles.brand}><Logo size={28} /><span>AROMA</span></Link>
        <p>Analisis Risiko Optimasi Masa depan Agrikultur</p>
        <p>© 2026 AkaliDev. Semua hak dilindungi.</p>
        <div className={styles.footerLinks}>
          <a href="/privacy">Kebijakan Privasi</a>
          <a href="/terms">Ketentuan Layanan</a>
        </div>
      </div>
    </footer>
  );
}