"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { MapProvince } from "@/lib/mapData";
import styles from "@/app/landing.module.css";

type Region = { name: string; price: number; date: string; x: number; y: number };
type Props = { paths: MapProvince[]; width: number; height: number; regions: Region[]; commodityCount: number; provinceCount: number };
const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function CoverageShowcase({ paths, width, height, regions, commodityCount, provinceCount }: Props) {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const marker = useRef<SVGGElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const active = useRef(false);
  const regionMotion = useRef<gsap.core.Timeline | null>(null);
  const region = regions[selected];
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let inViewport = false;
      const tour = gsap.timeline({ repeat: -1, paused: true });
      if (regions.length > 1) {
        tour.to({}, { duration: 4 }).call(() => setSelected((index) => (index + 1) % regions.length));
      }
      const syncPlayback = () => {
        active.current = inViewport && document.visibilityState === "visible";
        tour.paused(!active.current);
        regionMotion.current?.paused(!active.current);
      };
      const observer = new IntersectionObserver(([entry]) => {
        inViewport = entry.isIntersecting && entry.intersectionRatio > 0;
        syncPlayback();
      }, { threshold: 0 });
      observer.observe(section);
      document.addEventListener("visibilitychange", syncPlayback);
      return () => {
        active.current = false;
        observer.disconnect();
        document.removeEventListener("visibilitychange", syncPlayback);
      };
    });
    return () => media.revert();
  }, [regions.length]);
  useEffect(() => {
    if (!region) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const motion = gsap.timeline({ paused: true })
        .fromTo(detail.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, clearProps: "opacity,transform" }, 0)
        .fromTo(marker.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
        .fromTo(ring.current, { attr: { r: 8 }, opacity: 1 }, { attr: { r: 35 }, opacity: 0, duration: 1.4, repeat: 1 }, 0);
      regionMotion.current = motion;
      motion.paused(!active.current);
      return () => { regionMotion.current = null; };
    });
    return () => media.revert();
  }, [region]);
  if (!region) return null;
  return (
    <section ref={root} id="cakupan" className={styles.coverage}>
      <div className={styles.container}>
        <div className={styles.coverageHeading} data-reveal><h2>Seluruh perspektif.<br /><em>Satu Indonesia.</em></h2><p>{commodityCount} komoditas. {provinceCount} provinsi.<br />Lihat perbedaan harga dari satu wilayah ke wilayah lain.</p></div>
        <div className={styles.mapStage}>
          <svg viewBox={`-15 -20 ${width + 30} ${height + 40}`} role="img" aria-label={`Peta Indonesia, menyorot ${region.name}`}>
            {paths.map(({ name, path }) => <path key={name} d={path} className={name.toLowerCase() === region.name.toLowerCase() ? styles.activeProvince : styles.mapProvince} />)}
            <g ref={marker} transform={`translate(${region.x},${region.y})`}><circle ref={ring} r="20" fill="none" stroke="#087b71" strokeWidth="2" /><circle r="7" fill="#0d1b2a" stroke="white" strokeWidth="3" /></g>
          </svg>
          <div ref={detail} className={styles.regionDetail} aria-live="off">
            <h3>{region.name}</h3><p>Beras · per kg</p><strong>Rp{Math.round(region.price).toLocaleString("id-ID")}</strong><span>Harga tercatat {dateLabel(region.date)}</span><Link href="/login">Lihat analisis wilayah <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <p className={styles.mapSource}>Preview harga beras antarwilayah dari arsip PIHPS.</p>
      </div>
    </section>
  );
}
