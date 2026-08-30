// Avatar bulat gradient ala contoh (icon komoditas & avatar pengguna)
const GRADS = [
  "from-teal-400 to-teal-600",
  "from-orange-400 to-orange-600",
  "from-blue-400 to-blue-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-emerald-400 to-emerald-600",
  "from-violet-400 to-violet-600",
  "from-cyan-400 to-cyan-600",
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
  const g = GRADS[Math.abs(seed) % GRADS.length];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br ${g} text-white shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {children}
    </span>
  );
}
