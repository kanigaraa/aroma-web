import Image from "next/image";
import Logo from "@/components/Logo";
import Link from "next/link";

type Props = {
  mode: "login" | "register";
  children?: React.ReactNode;
};

export default function AuthShell({ mode, children }: Props) {
  const isLogin = mode === "login";

  const illustration = (
    <div className="sticky top-0 hidden h-screen overflow-hidden bg-white lg:block lg:w-[58%]">
      <Image
        src={isLogin ? "/auth-login.webp" : "/auth-register.webp"}
        alt={isLogin ? "Lanjut lihat lebih jauh" : "Mulai lihat lebih jauh"}
        fill
        sizes="(min-width: 1024px) 58vw, 0px"
        className="object-cover object-left"
        priority
      />
    </div>
  );

  const form = (
    <div className="flex w-full flex-col items-center justify-center bg-[#f4f7f5] px-4 py-8 lg:w-[42%] lg:px-8">
      <div className="w-full max-w-[340px]">
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

        {children}
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
