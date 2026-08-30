// Avatar solid flat ala metric card (icon komoditas & avatar pengguna).
// Solid color, rounded-xl, tanpa gradient/lingkaran — gaya datar publik.
const SOLIDS = [
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
];

export default function Avatar({
  children,
  seed = 0,
  size = 40,
  className = "",
}: {
  children?: React.ReactNode;
  seed?: number;
  size?: number;
  className?: string;
}) {
  const c = SOLIDS[Math.abs(seed) % SOLIDS.length];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl ${c} shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {children}
    </span>
  );
}
