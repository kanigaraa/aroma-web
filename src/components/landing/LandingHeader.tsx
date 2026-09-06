import Link from "next/link";
import Logo from "@/components/Logo";
import styles from "@/app/landing.module.css";

export default function LandingHeader({ home = false }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  return (
    <header className={`${styles.landing} ${styles.header}`}>
      <div className={`${styles.container} ${styles.navbar}`}>
        <Link href="/" className={styles.brand} aria-label="AROMA, beranda"><Logo size={34} /><span>AROMA</span></Link>
        <nav aria-label="Navigasi utama" className={styles.desktopNav}>
          <a href={`${prefix}#analisis`}>Analisis</a><a href={`${prefix}#fitur`}>Fitur</a><a href={`${prefix}#cakupan`}>Cakupan data</a>
        </nav>
        <div className={styles.accountNav}><Link href="/login" className={styles.navCta}>Masuk</Link></div>
      </div>
    </header>
  );
}
