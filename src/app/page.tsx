import Link from "next/link";
import Logo from "@/components/Logo";
import LandingExplorer from "@/components/landing/LandingExplorer";
import LandingMotion from "@/components/landing/LandingMotion";
import TerraceBackdrop from "@/components/landing/TerraceBackdrop";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import CoverageShowcase from "@/components/landing/CoverageShowcase";
import LandingFaq from "@/components/landing/LandingFaq";
import { getKomoditasForecast, getKomoditasProcessed, getMeta } from "@/lib/data";
import { getMapData, MAP_H, MAP_W } from "@/lib/mapData";
import styles from "./landing.module.css";

export default function LandingPage() {
  const meta = getMeta();
  const { paths, centroids } = getMapData();
  const riceProcessed = getKomoditasProcessed("beras");
  const lastRice = riceProcessed.seri.at(-1);
  const regions = ["Sumatera Utara", "DKI Jakarta", "Sulawesi Selatan", "Papua"].flatMap((name) => {
    const point = lastRice?.data[name];
    const centroidKey = Object.keys(centroids).find((key) => key.toLowerCase() === name.toLowerCase());
    if (!lastRice || !point || !Number.isFinite(point.harga) || !centroidKey) return [];
    return [{ name, price: point.harga, date: lastRice.tanggal, ...centroids[centroidKey] }];
  });
  const previews = ["beras", "cabai-rawit", "bawang-merah"].map((slug) => {
    const processed = getKomoditasProcessed(slug);
    const forecast = getKomoditasForecast(slug);
    const province = "DKI Jakarta";
    const history = processed.seri
      .filter((point) => Number.isFinite(point.data[province]?.harga))
      .slice(-20)
      .map((point) => ({ date: point.tanggal, value: point.data[province].harga }));
    return {
      slug,
      name: meta.komoditas.find((item) => item.slug === slug)!.nama,
      province,
      history,
      forecast: (forecast.provinsi[province]?.seri ?? [])
        .filter((point) => point.is_future && Number.isFinite(point.forecast))
        .map((point) => ({ date: point.tanggal, value: point.forecast })),
    };
  });
  const featureProvince = "DKI Jakarta";
  const featureCommodities = ["beras", "cabai-rawit", "bawang-merah"].map((slug) => {
    const commodity = meta.komoditas.find((item) => item.slug === slug)!;
    const processed = getKomoditasProcessed(slug);
    return {
      slug,
      nama: commodity.nama,
      satuan: commodity.satuan,
      status: processed.seri.at(-1)?.data[featureProvince]?.status ?? "stabil" as const,
      data: getKomoditasForecast(slug).provinsi[featureProvince]?.seri ?? [],
    };
  });
  const featureRiskSnapshot = [...riceProcessed.seri].reverse().find((entry) => {
    const statuses = Object.values(entry.data).map((item) => item.status);
    return statuses.includes("waspada") && statuses.includes("tinggi");
  }) ?? lastRice;
  const featureRiskStatus = Object.fromEntries(meta.provinsi.map((province) => [province, featureRiskSnapshot?.data[province]?.status ?? "stabil"]));
  return (
    <LandingMotion>
      <a className={styles.skipLink} href="#konten">Langsung ke konten</a>
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.navbar}`}>
          <Link href="/" className={styles.brand} aria-label="AROMA, beranda"><Logo size={34} /><span>AROMA</span></Link>
          <nav aria-label="Navigasi utama" className={styles.desktopNav}>
            <a href="#analisis">Analisis</a><a href="#fitur">Fitur</a><a href="#cakupan">Cakupan data</a>
          </nav>
          <div className={styles.accountNav}><Link href="/login" className={styles.navCta}>Masuk</Link></div>
        </div>
      </header>
      <main id="konten">
        <section className={styles.hero} aria-labelledby="hero-heading" data-hero>
          <div className={styles.heroLandscape} data-landscape aria-hidden="true"><TerraceBackdrop /></div>
          <div className={`${styles.container} ${styles.heroContent}`}>
          <h1 id="hero-heading"><span data-hero-line>Baca harga pangan.</span><span data-hero-line>Selangkah <em>lebih siap.</em></span></h1>
          <div className={styles.heroIntro} data-hero-intro>
            <p>Kenali pergerakan harga dan prediksi 14 hari ke depan<br className={styles.desktopBreak} /> bersama asisten AI AROMA.</p>
            <div className={styles.heroActions}>
              <Link href="/register" className={styles.primaryButton}>Mulai pantau harga</Link>
              <a href="#analisis" className={styles.secondaryButton}>Lihat cara kerjanya</a>
            </div>
          </div>
          </div>
        </section>
        <section id="analisis" className={`${styles.container} ${styles.explorerSection}`} aria-label="Preview analisis harga AROMA" data-reveal><LandingExplorer commodities={previews} /></section>
        <FeatureShowcase commodities={featureCommodities} province={featureProvince} mapPaths={paths} mapCentroids={centroids} riskStatus={featureRiskStatus} riskDate={featureRiskSnapshot?.tanggal ?? ""} />
        <CoverageShowcase paths={paths} width={MAP_W} height={MAP_H} regions={regions} commodityCount={meta.komoditas.length} provinceCount={meta.provinsi.length} />
        <LandingFaq commodityCount={meta.komoditas.length} provinceCount={meta.provinsi.length} />
        <section className={styles.closing} aria-labelledby="closing-heading">
          <div className={styles.closingLandscape} aria-hidden="true"><TerraceBackdrop idPrefix="closing" /></div>
          <div className={`${styles.container} ${styles.closingContent}`} data-reveal>
            <h2 id="closing-heading">Besok<br />lebih siap.<br /><em>Mulai hari ini.</em></h2>
            <div className={styles.closingAction}>
              <p>Dari harga hari ini ke rencana berikutnya. Temukan konteks untuk komoditas dan wilayah pilihanmu.</p>
              <Link href="/register" className={styles.primaryButton}>Buat akun AROMA</Link>
              <Link href="/login" className={styles.closingLogin}>Sudah punya akun? <span>Masuk</span></Link>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footerSurface}>
        <div className={`${styles.container} ${styles.footer}`}>
        <Link href="/" className={styles.brand}><Logo size={28} /><span>AROMA</span></Link>
        <p>Analisis Risiko Optimasi Masa depan Agrikultur</p><a href="#konten" className={styles.backToTop}>Kembali ke atas <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </LandingMotion>
  );
}
