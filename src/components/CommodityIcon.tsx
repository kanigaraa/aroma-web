import Image from "next/image";
import Avatar from "./Avatar";

// Warna per komoditas — sesuai karakter bahan pangan
const COLORS: Record<string, string> = {
  "beras":         "bg-amber-50  text-amber-700",
  "daging-ayam":   "bg-orange-100 text-orange-700",
  "daging-sapi":   "bg-red-100   text-red-700",
  "telur-ayam":    "bg-yellow-100 text-yellow-700",
  "bawang-merah":  "bg-rose-100  text-rose-700",
  "bawang-putih":  "bg-slate-100 text-slate-600",
  "cabai-merah":   "bg-red-100   text-red-600",
  "cabai-rawit":   "bg-orange-50 text-orange-600",
  "minyak-goreng": "bg-yellow-50 text-yellow-600",
  "gula-pasir":    "bg-stone-100 text-stone-600",
};

const ICON_SLUGS = Object.keys(COLORS);

export default function CommodityIcon({
  slug,
  seed = 0,
  size = 40,
}: {
  slug: string;
  seed?: number;
  size?: number;
}) {
  const hasIcon = ICON_SLUGS.includes(slug);
  const colorClass = COLORS[slug];
  const iconSize = Math.round(size * 0.75);

  return (
    <Avatar seed={seed} size={size} className={colorClass ?? ""}>
      {hasIcon ? (
        <Image
          src={`/icons/${slug}.svg`}
          alt={slug}
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            objectFit: "contain",
            display: "block",
            transform: "scale(1.1)",
          }}
          unoptimized
        />
      ) : (
        <svg
          viewBox="0 0 24 24"
          width={iconSize}
          height={iconSize}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l2 5 5 1-3.5 3.5L16 18l-4-2-4 2 1.5-5.5L6 9l5-1z" />
        </svg>
      )}
    </Avatar>
  );
}
