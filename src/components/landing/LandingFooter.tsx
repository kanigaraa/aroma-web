import Link from "next/link";
import Logo from "@/components/Logo";
import styles from "@/app/landing.module.css";

export default function LandingFooter() {
  return (
    <footer className={`${styles.landing} ${styles.footerSurface}`}>
      <div className={`${styles.container} ${styles.footer}`}>
        <div className={styles.footerIdentity}>
          <Link href="/" className={styles.brand}><Logo size={28} /><span>AROMA</span></Link>
          <p>Analisis Risiko Optimasi Masa Depan Agrikultur</p>
        </div>
        <div className={styles.footerMeta}>
          <nav className={styles.footerLinks} aria-label="Dokumen layanan">
            <Link href="/privacy">Kebijakan Privasi</Link>
            <Link href="/terms">Ketentuan Layanan</Link>
            <Link href="/metodologi">Metodologi Data</Link>
          </nav>
          <p>© 2026 AkaliDev. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
