import Logo from "@/components/Logo";
import TerraceBackdrop from "@/components/landing/TerraceBackdrop";
import Link from "next/link";

type Props = {
  mode: "login" | "register";
  children?: React.ReactNode;
};

export default function AuthShell({ mode, children }: Props) {
  const isLogin = mode === "login";
  const visualCopy = isLogin
    ? {
        title: "Harga terus bergerak. Yuk lihat apa yang berubah.",
        description:
          "Masuk untuk melanjutkan pemantauan dan melihat insight terbaru.",
      }
    : {
        title: "Kenali arahnya sebelum angkanya berubah.",
        description:
          "Buat akun untuk memantau harga, prediksi, dan risiko pangan dalam satu alur.",
      };

  const illustration = (
    <section
      aria-label="Gambaran fitur AROMA"
      className="sticky top-0 hidden h-screen overflow-hidden bg-[#f8faf9] lg:flex lg:w-[58%]"
    >
      <div className="pointer-events-none absolute -inset-[8%] [&>svg]:h-full [&>svg]:w-full">
        <TerraceBackdrop idPrefix={`auth-${mode}-desktop`} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,249,0.08)_0%,rgba(248,250,249,0.16)_50%,rgba(207,226,216,0.55)_100%)]" />

      <div className="relative z-10 flex w-full flex-col justify-between p-[clamp(48px,6vw,88px)]">
        <Link
          href="/"
          className="flex w-fit items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-4"
        >
        </Link>

        <div className="max-w-[620px]">
          <h2 className="max-w-[600px] text-[clamp(42px,4.7vw,68px)] font-medium leading-[1.08] tracking-[-0.055em] text-primary">
            {visualCopy.title}
          </h2>
          <p className="mt-6 max-w-[490px] text-base leading-8 text-[#405467]">
            {visualCopy.description}
          </p>

          <div className="mt-10 max-w-[540px] rounded-2xl border border-white/90 bg-white/85 p-5 shadow-[0_18px_55px_rgba(13,27,42,0.08)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-primary">Riwayat dan prediksi harga</h3>
              <span className="text-xs font-medium text-accent-strong">14 hari</span>
            </div>
            <svg
              viewBox="0 0 520 145"
              role="img"
              aria-label="Ilustrasi grafik riwayat dan prediksi harga"
              className="mt-3 block h-auto w-full"
            >
              <path d="M12 122H508M12 76H508M12 30H508" stroke="#dbe7e1" strokeWidth="1" />
              <path d="M12 112C65 109 85 96 126 99S190 73 234 78s68-27 112-18 60-18 88-15" fill="none" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
              <path d="M434 45c27 2 45 18 74 9" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeDasharray="7 8" />
              <circle cx="434" cy="45" r="6" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            </svg>
            <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#526578]">
              <span className="flex items-center gap-2"><i aria-hidden="true" className="h-0.5 w-5 bg-accent-strong" />Harga terbaru</span>
              <span className="flex items-center gap-2"><i aria-hidden="true" className="w-5 border-t-2 border-dashed border-coral" />Perkiraan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const form = (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#f4f7f5] px-4 py-8 lg:w-[42%] lg:px-8">
      <div className="pointer-events-none absolute -inset-[20%] opacity-45 lg:hidden [&>svg]:h-full [&>svg]:w-full">
        <TerraceBackdrop idPrefix={`auth-${mode}-mobile`} />
      </div>
      <div className="relative z-10 w-full max-w-[340px]">
        <Link
          href="/"
          aria-label="Kembali ke beranda AROMA"
          className="mb-8 flex w-fit items-center gap-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <Logo size={36} />
          <span className="text-lg font-bold tracking-tight text-primary">AROMA</span>
        </Link>

        <h1 className="text-[28px] font-bold tracking-tight text-primary">
          {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
        </h1>
        <p className="mt-1.5 text-sm text-secondary">
          {isLogin
            ? "Masuk untuk mengakses analisis risiko harga pangan."
            : "Daftar untuk memantau harga dan risiko komoditas."}
        </p>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen bg-background">
      {isLogin ? (
        <>{form}{illustration}</>
      ) : (
        <>{illustration}{form}</>
      )}
    </main>
  );
}
