import Image from "next/image";

export default function Logo({ size = 32, rounded = true }: { size?: number; rounded?: boolean }) {
  return (
    <Image
      src="/aroma-logo.png"
      alt="Logo AROMA"
      width={size}
      height={size}
      className={rounded ? "rounded-lg" : ""}
      style={{ objectFit: "contain" }}
      priority
    />
  );
}
