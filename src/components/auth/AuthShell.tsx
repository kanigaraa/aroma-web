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
    <div className="relative hidden overflow-hidden lg:block lg:w-[42%] xl:w-[38%]">
      <Image
        src={isLogin ? "/auth-login.jpg" : "/auth-register.jpg"}
        alt={isLogin ? "Lanjut lihat lebih jauh" : "Mulai lihat lebih jauh"}
        fill
        className="object-cover object-center"
        priority
      />
    </div>
  );

  const form = (
    <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:flex-1 lg:px-12">
      <div className="w-full max-w-md">
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
