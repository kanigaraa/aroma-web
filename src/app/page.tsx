"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import {
  ArrowRight,
  TrendingUp,
  Globe2,
  CalendarDays,
  TrendingDown,
  Coins,
  LineChart,
  Search,
  Map as MapIcon,
  Check,
  Plus,
  ChevronDown,
  Users,
  Building2,
} from "lucide-react";
export default function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-[#e8edf2] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-13 max-w-5xl items-center gap-8 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-lg font-bold tracking-tight text-primary">AROMA</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {/* Analisis dropdown (Use Cases) */}
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#0d1b2a] transition-colors hover:bg-[#f5f7fa]"
              >
                Analisis
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-border bg-surface p-2 shadow-lg">
                  <DropdownItem href="/login" icon={<MapIcon className="h-4 w-4" />} title="Peta Risiko" desc="Risiko harga per provinsi" />
                  <DropdownItem href="/login" icon={<LineChart className="h-4 w-4" />} title="Prediksi Harga" desc="Perkiraan 14 hari ke depan" />
                  <DropdownItem href="/login" icon={<Coins className="h-4 w-4" />} title="Harga Komoditas" desc="Pantau 10 komoditas utama" />
                </div>
              )}
            </div>
            <Link href="#cara-kerja" className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#0d1b2a] transition-colors hover:bg-[#f5f7fa]">
              Cara Kerja
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#0d1b2a]/70 transition-colors hover:text-[#0d1b2a]"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#0d1b2a] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              Coba Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center px-6 pb-0 pt-20 text-center">
        <div className="max-w-[900px]">
          {/* Line 1 — larger */}
          <h1 className="text-[64px] font-[750] leading-[1.02] tracking-[-0.045em] text-[#0d1b2a]">
            Harga pangan bakal naik{" "}
            <BubbleIcon
              colorA="#fb923c" colorB="#f97316"
              glyph={<TrendingUp className="h-4 w-4 text-white sm:h-5 sm:w-5" />}
              className="mx-0.5 inline-block h-9 w-9 translate-y-0.5 align-middle"
            />
            {" "}atau turun?{" "}
            <BubbleIcon
              colorA="#0ea5e9" colorB="#0369a1"
              glyph={<TrendingDown className="h-4 w-4 text-white sm:h-5 sm:w-5" />}
              className="mx-0.5 inline-block h-9 w-9 translate-y-0.5 align-middle"
            />
          </h1>

          {/* Line 2 — slightly smaller */}
          <p className="mt-1 text-[56px] font-bold leading-[1.04] tracking-[-0.045em] text-[#0d1b2a]">
            Kami bantu memprediksinya
          </p>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-[700px] text-[18px] leading-relaxed text-[#64748b]">
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
        </div>

        {/* Dashboard screenshot */}
        <div className="mt-16 w-full max-w-[1120px]">
          <img
            src="/dashboard-preview.png"
            alt="Dashboard AROMA"
            className="w-full rounded-2xl border border-[#e2e8f0] shadow-[0_4px_32px_-4px_rgba(13,27,42,0.08)]"
          />
        </div>
      </section>

      {/* FITUR — layout 3 kartu */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Semua yang Anda butuhkan untuk membaca harga
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-secondary">
          Pantau, prediksi, dan putuskan dengan data harga pangan yang akurat dan ter-update.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <FeatureList
              items={[
                { tint: "bg-orange-100 text-orange-600", icon: <Coins className="h-4 w-4" />, label: "10 komoditas" },
                { tint: "bg-teal-100 text-teal-600", icon: <MapIcon className="h-4 w-4" />, label: "Peta 34 provinsi" },
                { tint: "bg-blue-100 text-blue-600", icon: <LineChart className="h-4 w-4" />, label: "Tren harian" },
                { tint: "bg-pink-100 text-pink-600", icon: <CalendarDays className="h-4 w-4" />, label: "Prediksi 14 hari" },
              ]}
            />
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <Gauge value={82} label="akurasi prediksi" />
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <MiniBarChart />
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {[
            { title: "Berbasis manfaat", desc: "Lihat nilai yang Anda peroleh dari memantau harga pangan secara rutin." },
            { title: "Berorientasi aksi", desc: "Dapatkan gambaran cepat untuk memutuskan kapan membeli atau menjual." },
            { title: "Berfokus dampak", desc: "Data dan proyeksi yang membantu Anda mengantisipasi kenaikan harga." },
          ].map((b) => (
            <div key={b.title} className="text-center">
              <h3 className="font-semibold text-primary">{b.title}</h3>
              <p className="mt-1 text-sm text-secondary">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 max-w-xl">
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-primary">
              Kami bantu Anda memprediksi harga pangan lebih awal
            </h2>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Dark feature card */}
            <div className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <Globe2 className="h-5 w-5" />
              </span>
              <div className="mt-8">
                <div className="text-3xl font-bold">34 provinsi</div>
                <div className="mt-2 text-sm text-white/70">
                  Cakupan nasional dengan data representatif di seluruh Indonesia.
                </div>
              </div>
            </div>

            <StatCard
              icon={<Coins className="h-5 w-5" />}
              tint="bg-teal-50 text-teal-600"
              value="10"
              label="komoditas dipantau"
              desc="Beras, cabai, bawang, minyak, dan lainnya dipantau harian."
            />
            <StatCard
              icon={<LineChart className="h-5 w-5" />}
              tint="bg-orange-50 text-orange-600"
              value="14 hari"
              label="prediksi ke depan"
              desc="Proyeksi berbasis data untuk antisipasi lebih awal."
            />
          </div>
        </div>
      </section>

      {/* BUILT FOR */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 max-w-xl">
          <div className="text-sm font-semibold text-accent-strong">Dibuat untuk semua</div>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-primary">
            Siapa yang terbantu oleh AROMA
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <UseCaseCard
            tint="bg-teal-50"
            icon={<Users className="h-5 w-5 text-teal-600" />}
            title="Petani & Pedagang"
            points={[
              "Pantau harga jual di wilayah Anda",
              "Antisipasi lonjakan atau penurunan harga",
              "Keputusan jual-beli lebih tepat waktu",
            ]}
          />
          <UseCaseCard
            tint="bg-blue-50"
            icon={<Building2 className="h-5 w-5 text-blue-600" />}
            title="Badan & Departemen"
            points={[
              "Peta risiko harga per provinsi",
              "Prediksi 14 hari untuk kebijakan stok",
              "Data terkini untuk laporan dan analisis",
            ]}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="cara-kerja" className="border-y border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <div className="text-sm font-semibold text-accent-strong">Cara kerja</div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-primary">
              Dari data menjadi keputusan
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <StepCard n="1" icon={<Search className="h-5 w-5" />} title="Pilih komoditas" desc="Pilih komoditas yang ingin dipantau dari 10 pilihan." />
            <StepCard n="2" icon={<MapIcon className="h-5 w-5" />} title="Lihat peta risiko" desc="Warna provinsi menunjukkan status risiko harga saat ini." />
            <StepCard n="3" icon={<TrendingUp className="h-5 w-5" />} title="Prediksi 14 hari" desc="Antisipasi pergerakan harga dengan proyeksi berbasis data." />
            </div>
          </div>
        </section>



      {/* BOTTOM CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight text-white">
            Siap memantau harga pangan Anda?
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-sm text-white/70">
            Akses peta risiko dan prediksi harga 10 komoditas dari 34 provinsi — gratis.
          </p>
          <div className="relative mt-6 flex justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
            >
              Buat Akun Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function DropdownItem({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link href={href} className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">{icon}</span>
      <span>
        <span className="block text-sm font-medium text-primary">{title}</span>
        <span className="block text-xs text-secondary">{desc}</span>
      </span>
    </Link>
  );
}

function StatCard({ icon, tint, value, label, desc }: { icon: React.ReactNode; tint: string; value: string; label: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>{icon}</span>
      <div className="text-3xl font-bold text-primary tnum">{value}</div>
      <div className="mt-1 text-sm font-medium text-primary">{label}</div>
      <div className="mt-1 text-xs text-secondary">{desc}</div>
    </div>
  );
}

function UseCaseCard({ tint, icon, title, points }: { tint: string; icon: React.ReactNode; title: string; points: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>{icon}</span>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-secondary">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({ n, icon, title, desc }: { n: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl border border-border bg-background p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent-strong">{icon}</span>
        <span className="text-4xl font-bold text-muted">{n}</span>
      </div>
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <p className="mt-1 text-sm text-secondary">{desc}</p>
    </div>
  );
}

// Gelembung chat dengan ekor lancip kiri-bawah menyatu (gaya ikon chat)
function BubbleIcon({
  colorA,
  colorB,
  glyph,
  className,
}: {
  colorA: string;
  colorB: string;
  glyph?: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className ?? ""}`}>
      <svg viewBox="0 0 48 44" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`bg-${colorB}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorA} />
            <stop offset="100%" stopColor={colorB} />
          </linearGradient>
        </defs>
        {/* Badan rounded + ekor kiri-bawah menyatu */}
        <path
          d="M34 4c7 0 12 5 12 12v10c0 7-5 12-12 12H20l-8 6 1-8c-6-2-10-6-10-10V16C3 9 8 4 15 4h19z"
          fill={`url(#bg-${colorB})`}
        />
      </svg>
      {glyph ? (
        <span className="absolute inset-0 flex items-center justify-center pb-1.5">{glyph}</span>
      ) : null}
    </span>
  );
}

function FeatureList({
  items,
}: {
  items: { tint: string; icon: React.ReactNode; label: string }[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-primary">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${it.tint}`}>
              {it.icon}
            </span>
            {it.label}
          </span>
          <Plus className="h-4 w-4 text-secondary" />
        </li>
      ))}
    </ul>
  );
}

function Gauge({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="h-28 w-40" aria-hidden>
        <path
          d="M10 60 A50 50 0 0 1 110 60"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M10 60 A50 50 0 0 1 92 21"
          fill="none"
          stroke="#f97316"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>
      <div className="-mt-8 text-4xl font-bold text-primary">{value}</div>
      <div className="mt-1 text-xs text-secondary">{label}</div>
    </div>
  );
}

function MiniBarChart() {
  const bars = [35, 55, 42, 70, 58, 82];
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-28 items-end gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-6 rounded-t bg-teal-400/70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-primary">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white">
          <Check className="h-3 w-3" />
        </span>
        Bisa dipantau tiap hari
      </div>
    </div>
  );
}
