"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import styles from "../app/landing.module.css";

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`${styles.container} ${styles.navbar}`}>
        <button
          className={styles.hamburger}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <Link href="/" className={styles.brand} aria-label="AROMA, beranda">
          <Logo size={34} /><span>AROMA</span>
        </Link>
        <nav aria-label="Navigasi utama" className={styles.desktopNav}>
          <a href="#analisis">Analisis</a>
          <a href="#fitur">Fitur</a>
          <a href="#cakupan">Cakupan data</a>
        </nav>
        <div className={styles.accountNav}>
          <Link href="/login" className={styles.navCta}>Masuk</Link>
        </div>
      </div>

      {open && (
        <div className={styles.mobileMenu}>
          <nav aria-label="Menu navigasi">
            <a href="#analisis" className={styles.mobileLink} onClick={() => setOpen(false)}>Analisis</a>
            <a href="#fitur" className={styles.mobileLink} onClick={() => setOpen(false)}>Fitur</a>
            <a href="#cakupan" className={styles.mobileLink} onClick={() => setOpen(false)}>Cakupan data</a>
          </nav>
          <Link href="/login" className={styles.mobileLogin} onClick={() => setOpen(false)}>Masuk</Link>
        </div>
      )}
    </>
  );
}