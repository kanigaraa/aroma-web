"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

/** navigasi bawah utk mobile (<lg) — sidebar disembunyikan di layar kecil */
export default function BottomNav() {
  const pathname = usePathname();
  const activeRoot = pathname.split("/")[1]; // "/komoditas/beras" → "komoditas"

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur lg:hidden"
    >
      {NAV.map((item) => {
        const href = item.href;
        const active = pathname === href || activeRoot === href.slice(1);
        const Icon = item.icon;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              active ? "text-accent-strong" : "text-secondary"
            }`}
          >
            <span
              className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                active ? "bg-accent/10" : ""
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
