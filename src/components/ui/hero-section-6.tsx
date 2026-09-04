"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { ArrowRight } from "lucide-react";

function TrendBadge({ direction }: { direction: "up" | "down" }) {
  const up = direction === "up";
  const bg = up ? "#f97316" : "#0ea5e9";

  return (
    <span
      aria-label={up ? "naik" : "turun"}
      className="relative inline-block translate-y-[-0.06em] align-middle"
      style={{ width: 38, height: 34 }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 38 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 38, height: 34 }}
      >
        {/* bubble body */}
        <rect x="0" y="0" width="38" height="28" rx="9" fill={bg} />
        {/* tail notch bottom-left */}
        <path d="M8 28 L5 34 L14 28 Z" fill={bg} />
        {/* chart line */}
        {up ? (
          <polyline
            points="7,20 13,14 19,17 25,10 31,6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <polyline
            points="7,6 13,12 19,9 25,16 31,22"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {/* arrowhead */}
        {up ? (
          <polyline
            points="27,6 31,6 31,10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <polyline
            points="27,22 31,22 31,18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  );
}

const textVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 16 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { type: "spring", bounce: 0.15, duration: 0.9 },
  },
};

export default function HeroSection6() {
  return (
    <section className="flex flex-col items-center px-6 pb-0 pt-28 text-center">
      <AnimatedGroup
        className="flex max-w-[1120px] flex-col items-center"
        variants={{
          container: { visible: { transition: { staggerChildren: 0.07 } } },
          item: textVariants,
        }}
      >
        {/* Main headline */}
        <h1
          style={{
            letterSpacing: "-0.045em",
            fontSize: "clamp(48px, 4.2vw, 64px)",
            lineHeight: 1.02,
            fontWeight: 700,
          }}
          className="text-center text-[#0d1b2a]"
        >
          Harga pangan bakal naik{" "}
          <TrendBadge direction="up" />
          {" "}atau turun?{" "}
          <TrendBadge direction="down" />
        </h1>

        {/* Secondary headline */}
        <p
          style={{ letterSpacing: "-0.03em" }}
          className="mt-[13px] text-[42px] font-[600] leading-[1.05] text-[#475569]"
        >
          Kami bantu memprediksinya
        </p>

        {/* Subtitle */}
        <p className="mx-auto mt-[27px] max-w-[700px] text-[17px] leading-[1.6] text-[#64748b]">
          AROMA memprediksi harga 10 komoditas di 34 provinsi hingga 14 hari ke depan.
        </p>

        {/* CTA */}
        <div className="mt-[28px] flex flex-wrap items-center justify-center gap-[12px]">
          <Link
            href="/register"
            className="inline-flex h-[46px] items-center gap-2 rounded-[13px] bg-[#0d1b2a] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            Mulai Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#cara-kerja"
            className="inline-flex h-[46px] items-center gap-2 rounded-[13px] border border-[#e2e8f0] bg-white px-6 text-sm font-semibold text-[#0d1b2a] transition-colors hover:bg-[#f8fafc]"
          >
            Lihat Cara Kerja
          </Link>
        </div>
      </AnimatedGroup>

      {/* Dashboard screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
        className="relative mt-20 w-[calc(100%-80px)] max-w-[1200px]"
      >
        {/* subtle teal glow behind screenshot only */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400 opacity-[0.07] blur-[120px]"
        />
        <Image
          src="/dashboard-preview.png"
          alt="Dashboard AROMA"
          width={1200}
          height={750}
          priority
          className="relative w-full rounded-t-[18px] rounded-b-[18px] border border-[#e8edf2]"
          style={{
            boxShadow:
              "0 2px 4px rgba(15,23,42,0.03), 0 20px 60px rgba(15,23,42,0.07)",
          }}
        />
      </motion.div>
    </section>
  );
}
