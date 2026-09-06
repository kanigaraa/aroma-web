import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import landing from "@/app/landing.module.css";
import styles from "./LegalPage.module.css";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={`${landing.landing} ${styles.page}`}>
      <a className={landing.skipLink} href="#konten">Langsung ke konten</a>
      <LandingHeader />
      <main id="konten" className={styles.main}>
        <Link href="/" className={`${landing.textLink} ${styles.back}`}>
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke beranda
        </Link>
        <header className={styles.heading}>
          <h1>{title}</h1>
          <p>Terakhir diperbarui: September 2026</p>
        </header>
        <nav className={styles.navigation} aria-label="Dokumen layanan">
          <Link href="/privacy" aria-current={title === "Kebijakan Privasi" ? "page" : undefined}>Kebijakan Privasi</Link>
          <Link href="/terms" aria-current={title === "Ketentuan Layanan" ? "page" : undefined}>Ketentuan Layanan</Link>
          <Link href="/metodologi" aria-current={title === "Metodologi & Sumber Data" ? "page" : undefined}>Metodologi Data</Link>
        </nav>
        <article className={styles.content}>{children}</article>
        <Link href="/" className={`${landing.secondaryButton} ${styles.bottomBack}`}>
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke beranda
        </Link>
      </main>
      <LandingFooter />
    </div>
  );
}
