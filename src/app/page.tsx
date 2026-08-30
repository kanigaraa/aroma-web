import Link from "next/link";
import { ArrowRight, LayoutDashboard, Map, ShoppingBasket, Bot, TrendingUp, CloudSun, ShieldAlert } from "lucide-react";

const cards = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    desc: "Ringkasan harga, perbandingan provinsi, dan risiko komoditas.",
    color: "bg-teal-600",
  },
  {
    href: "/peta",
    icon: Map,
    title: "Peta Risiko",
    desc: "Visualisasi status harga pangan seluruh provinsi Indonesia.",
    color: "bg-blue-600",
  },
  {
    href: "/komoditas",
    icon: ShoppingBasket,
    title: "Komoditas",
    desc: "Detail harga & prediksi 14 hari ke depan tiap komoditas.",
    color: "bg-orange-500",
  },
];

const features = [
  { icon: TrendingUp, title: "Prediksi 14 hari", desc: "Perkiraan harga berbasis data historis." },
  { icon: CloudSun, title: "Insight cuaca", desc: "Pengaruh cuaca terhadap pergerakan harga." },
  { icon: ShieldAlert, title: "Peringatan risiko", desc: "Status stabil, waspada, hingga tinggi per provinsi." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-primary">
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-secondary">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          Analisis harga pangan Indonesia
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Pantau &amp; prediksi harga pangan{" "}
          <span className="text-accent">akurat</span> per provinsi
        </h1>
        <p className="mt-5 max-w-xl text-lg text-secondary">
          AROMA memantau puluhan komoditas di seluruh provinsi, memberikan prediksi 14 hari ke depan, dan
          menandai risiko kenaikan harga akibat cuaca.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Buka Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/komoditas"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-muted"
          >
            Jelajahi Komoditas
          </Link>
        </div>
      </section>

      {/* Fitur */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface p-6">
              <f.icon className="mb-4 h-6 w-6 text-accent" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cards halaman */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${c.color} text-white`}>
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-secondary">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Buka <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* AI callout */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white">
              <Bot className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold">Tanya Asisten AROMA</h3>
              <p className="text-sm text-secondary">Tanya harga, prediksi, atau pengaruh cuaca — dijawab instan.</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="shrink-0 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-muted"
          >
            Coba di Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
