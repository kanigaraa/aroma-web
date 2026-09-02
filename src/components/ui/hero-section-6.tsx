"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export default function HeroSection6() {
  const textVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.2, duration: 1 },
    },
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 pb-0 pt-20 text-center">
      <AnimatedGroup
        className="max-w-[1100px] mx-auto flex flex-col items-center"
        variants={{
          container: { visible: { transition: { staggerChildren: 0.08 } } },
          item: textVariants,
        }}
      >
        {/* Line 1 */}
        <h1 className="text-[60px] font-[750] leading-[1.02] tracking-[-0.04em] text-[#0d1b2a]">
          Harga pangan bakal naik{" "}
          <span className="inline-flex h-8 w-8 translate-y-0.5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 align-middle">
            <TrendingUp className="h-3.5 w-3.5 text-white" />
          </span>
          {" "}atau turun?{" "}
          <span className="inline-flex h-8 w-8 translate-y-0.5 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 align-middle">
            <TrendingDown className="h-3.5 w-3.5 text-white" />
          </span>
        </h1>

        {/* Line 2 */}
        <p className="mt-2 text-[48px] font-[650] leading-[1.04] tracking-[-0.04em] text-[#0d1b2a]/75">
          Kami bantu memprediksinya
        </p>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-[680px] text-[17px] leading-relaxed text-[#475569]">
          AROMA memprediksi harga 10 komoditas di 34 provinsi hingga 14 hari ke depan.
        </p>

        {/* CTA */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-[#0d1b2a] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            Mulai Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#cara-kerja"
            className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-6 py-2.5 text-sm font-semibold text-[#0d1b2a] transition-colors hover:bg-[#f8fafc]"
          >
            Lihat Cara Kerja
          </Link>
        </div>
      </AnimatedGroup>

      {/* Dashboard screenshot with entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="relative mt-16 w-full max-w-[1240px]"
      >
        <Image
          src="/dashboard-preview.png"
          alt="Dashboard AROMA"
          width={1240}
          height={780}
          className="w-full rounded-[18px] border border-[#e2e8f0] shadow-[0_2px_24px_-4px_rgba(13,27,42,0.07)]"
          priority
        />
        {/* soft bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 rounded-b-[18px] bg-gradient-to-t from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
}
