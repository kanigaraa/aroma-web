import { Egg, Beef, Drumstick, Carrot } from "lucide-react";
import Avatar from "./Avatar";

// lucide punya icon pangan utk sebagian komoditas; sisanya pakai custom SVG
// (lucide versi ini tak punya Onion/Garlic/Chili/Beras/Minyak/Gula).
const LUCIDE: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>> = {
  "daging-ayam": Drumstick,
  "daging-sapi": Beef,
  "telur-ayam": Egg,
  "bawang-merah": Carrot,
};

const CUSTOM: Record<string, string> = {
  beras: "M4 8c0-2.2 3.6-4 8-4s8 1.8 8 4v8c0 2.2-3.6 4-8 4s-8-1.8-8-4V8zm0 0c0 2.2 3.6 4 8 4s8-1.8 8-4M12 12v8M4 12c0 2.2 3.6 4 8 4s8-1.8 8-4",
  "bawang-putih": "M12 3c-2.5.8-4 3.5-4 6.5 0 2.5.8 4.5 1.5 6.5.5 1.5 2 1.5 2.5 0 .7-2 1.5-4 1.5-6.5 0-3-1.5-5.8-4-6.5zM9 15c-1.5 1-2 3-2 4.5.7.8 1.8.8 2.5 0 .5-.8.5-3-.5-4.5z",
  "cabai-merah": "M12 4c-3.5 1-6 4-6 8 0 3 2 5.5 4 6.5.8.4 1.8-.1 1.8-1 0-1.3-.6-2.6-.6-4 0-1.8 1.3-2.8 2.8-2.8S16 12 16 13.5c0 1.4-.6 2.7-.6 4 0 .9 1 1.4 1.8 1 2-1 4-3.5 4-6.5 0-4-2.5-7-6-8z",
  "cabai-rawit": "M11 4c-2.5 1-4.5 3.5-4.5 6.5 0 2.6 1.4 4.7 3.5 5.8.9.5 1.9-.1 1.9-1.1 0-1.3-.8-2.4-.8-3.7 0-1.7 1.2-2.7 2.5-2.7s2.5 1 2.5 2.7c0 1.3-.8 2.4-.8 3.7 0 1 1 1.6 1.9 1.1 2.1-1.1 3.5-3.2 3.5-5.8C19.7 7.5 17.7 5 15.2 4c-.9.7-1.5 1.8-1.7 3-.2-.2-.4-.3-.7-.5.3-.4.5-.9.7-1.4-.9-.6-1.9-1-2.5-1.1z",
  "minyak-goreng": "M6 4h12v4H6zM8 8l-1.2 12h10.4L16 8h-8zm2 6h2m0 0h2m-2 0v2",
  "gula-pasir": "M5 8l1.5 13h11L19 8H5zm1.5-4h11v2.5h-11V4zm4 8l1.5 2 1.5-2m-3 3l1.5 2 1.5-2",
};

export default function CommodityIcon({
  slug,
  seed = 0,
  size = 40,
}: {
  slug: string;
  seed?: number;
  size?: number;
}) {
  const Lucide = LUCIDE[slug];
  if (Lucide) {
    return (
      <Avatar seed={seed} size={size}>
        <Lucide className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2} />
      </Avatar>
    );
  }
  const d = CUSTOM[slug] ?? "M12 3l2 5 5 1-3.5 3.5L16 18l-4-2-4 2 1.5-5.5L6 9l5-1z";
  return (
    <Avatar seed={seed} size={size}>
      <svg
        viewBox="0 0 24 24"
        width={size * 0.5}
        height={size * 0.5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={d} />
      </svg>
    </Avatar>
  );
}
