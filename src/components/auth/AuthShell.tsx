import Link from "next/link";
import Logo from "@/components/Logo";

type Props = {
  mode: "login" | "register";
  children?: React.ReactNode;
};

export default function AuthShell({ mode, children }: Props) {
  const isLogin = mode === "login";

  return (
    <main className="flex min-h-screen bg-background">
      {/* LEFT: FORM */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-[48%] lg:px-12 xl:w-[46%]">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-8 flex items-center gap-2.5">
            <Logo size={36} />
            <span className="text-lg font-bold tracking-tight text-primary">AROMA</span>
          </div>

          <h1 className="text-[28px] font-bold tracking-tight text-primary">
            {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
          </h1>
          <p className="mt-1.5 text-sm text-secondary">
            {isLogin
              ? "Masuk untuk mengakses analisis risiko harga pangan."
              : "Daftar untuk memantau harga dan risiko komoditas."}
          </p>

          {children}
        </div>
      </div>

      {/* RIGHT: PREVIEW (placeholder) */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-accent via-teal-600 to-primary lg:flex">
        <div className="relative w-full max-w-lg -rotate-3 rounded-2xl border border-white/20 bg-white p-6 shadow-2xl transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]">
          <div className="mb-5 flex items-center gap-2">
            <Logo size={32} />
            <span className="text-base font-bold text-primary">AROMA</span>
            <span className="ml-auto rounded-full bg-muted px-3 py-1 text-xs font-medium text-secondary">
              Dashboard
            </span>
          </div>

          {/* Mock nav */}
          <div className="mb-5 space-y-1">
            {["Dashboard", "Peta Risiko", "Komoditas", "Pengaturan"].map((label, i) => (
              <div
                key={label}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  i === 0 ? "bg-accent/10 font-semibold text-accent-strong" : "text-secondary"
                }`}
              >
                {label}
                {label === "Dashboard" && <span className="text-[11px] text-accent-strong">•</span>}
              </div>
            ))}
          </div>

          {/* Mock stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[11px] text-secondary">Komoditas dipantau</div>
              <div className="mt-1 text-2xl font-bold text-primary tnum">10</div>
              <div className="mt-1 text-[11px] text-secondary/80">34 provinsi</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[11px] text-secondary">Rata-rata harga</div>
              <div className="mt-1 text-2xl font-bold text-primary tnum">Rp 46.402</div>
              <div className="mt-1 text-[11px] text-emerald-600">▲ stabil</div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 text-xs font-medium text-secondary">Overview risiko</div>
            <div className="flex h-24 items-end gap-2">
              {[35, 55, 40, 70, 50, 80, 62].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-accent/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-2 text-[11px] text-secondary">
              Prediksi 14 hari · risiko per komoditas
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
