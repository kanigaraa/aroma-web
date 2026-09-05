import IndonesiaMap from "@/components/IndonesiaMap";
import CommodityIcon from "@/components/CommodityIcon";
import { RiskBadge } from "@/components/RiskBadge";
import type { MapProvince } from "@/lib/mapData";
import type { Status } from "@/lib/types";
import FeaturePriceCard, { type FeatureCommodity } from "./FeaturePriceCard";
import styles from "@/app/landing.module.css";

type Props = {
  commodities: FeatureCommodity[];
  province: string;
  mapPaths: MapProvince[];
  mapCentroids: Record<string, { x: number; y: number }>;
  riskStatus: Record<string, Status>;
  riskDate: string;
};

const rupiah = (value: number) => `Rp${Math.round(value).toLocaleString("id-ID")}`;
const shortDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function FeatureShowcase({ commodities, province, mapPaths, mapCentroids, riskStatus, riskDate }: Props) {
  const rice = commodities.find((item) => item.slug === "beras") ?? commodities[0];
  const latest = rice?.data.filter((point) => !point.is_future && point.harga !== null).at(-1);
  const prediction = rice?.data.filter((point) => point.is_future).at(-1);
  const direction = latest?.harga != null && prediction
    ? prediction.forecast > latest.harga ? "cenderung naik" : prediction.forecast < latest.harga ? "cenderung turun" : "relatif stabil"
    : "belum tersedia";
  return (
    <section id="fitur" className={`${styles.container} ${styles.planning}`} aria-labelledby="features-heading">
      <div className={styles.planningHeading} data-reveal>
        <h2 id="features-heading">Kenali harga.<br /><em>Pahami perubahannya.</em></h2>
        <p>Fitur AROMA untuk membaca data pangan<br />dari berbagai sisi.</p>
      </div>
      <div className={styles.featureGrid}>
        <article className={styles.featureItem}>
          <div className={`${styles.featureVisual} ${styles.featureVisualLive}`}>
            <FeaturePriceCard commodities={commodities} province={province} />
          </div>
          <div className={styles.featureCopy}><h3>Riwayat & prediksi harga</h3><p>Ikuti pergerakan harga komoditas di tiap provinsi dan lihat prediksi 14 hari setelah periode data historis.</p></div>
        </article>
        <article className={styles.featureItem}>
          <div className={`${styles.featureVisual} ${styles.featureVisualLive}`}>
            <div className={styles.featureMapPreview}>
              <div><h3>Peta Risiko</h3><p>Arsip beras{riskDate ? `, ${shortDate(riskDate)}` : ""}</p></div>
              <div className={styles.featureMapCanvas}><IndonesiaMap status={riskStatus} paths={mapPaths} centroids={mapCentroids} /></div>
              <div className={styles.featureMapLegend}><span>Stabil</span><span>Waspada</span><span>Tinggi</span></div>
            </div>
          </div>
          <div className={styles.featureCopy}><h3>Peta risiko pangan</h3><p>Telusuri harga antarwilayah, bandingkan provinsi, dan saring status Stabil, Waspada, atau Tinggi.</p></div>
        </article>
        <article className={styles.featureItem}>
          <div className={`${styles.featureVisual} ${styles.featureVisualLive}`}>
            <div className={styles.featureCommodityPreview}>
              <div><h3>Komoditas</h3><p>Harga terakhir di {province}</p></div>
              <ul>{commodities.map((item, index) => {
                const price = item.data.filter((point) => !point.is_future && point.harga !== null).at(-1)?.harga;
                return <li key={item.slug}><CommodityIcon slug={item.slug} seed={index} size={34} /><div><strong>{item.nama}</strong><span>{price != null ? `${rupiah(price)} / ${item.satuan}` : "Harga belum tersedia"}</span></div><RiskBadge status={item.status} /></li>;
              })}</ul>
            </div>
          </div>
          <div className={styles.featureCopy}><h3>Komoditas pangan</h3><p>Pilih komoditas untuk melihat harga terakhir, status risiko, riwayat, dan prediksi di berbagai provinsi.</p></div>
        </article>
        <article className={styles.featureItem}>
          <div className={`${styles.featureVisual} ${styles.featureVisualLive}`}>
            <div className={styles.featureChatPreview}>
              <div><h3>Asisten AROMA</h3><span>Berbasis data yang tersedia</span></div>
              <p className={styles.featureQuestion}>Bagaimana arah harga beras di {province}?</p>
              <p className={styles.featureAnswer}>{latest?.harga != null && prediction ? <>Harga terakhir {rupiah(latest.harga)} pada {shortDate(latest.tanggal)}. Prediksi {shortDate(prediction.tanggal)} sebesar {rupiah(prediction.forecast)}, sehingga arahnya {direction}.</> : <>Prediksi untuk wilayah ini belum tersedia.</>}</p>
            </div>
          </div>
          <div className={styles.featureCopy}><h3>Asisten AI AROMA</h3><p>Tanyakan ringkasan harga, arah prediksi, dan konteks cuaca melalui percakapan berbasis data AROMA.</p></div>
        </article>
      </div>
    </section>
  );
}
