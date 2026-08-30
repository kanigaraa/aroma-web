"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Package, Settings, Sprout, ChevronRight } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/peta", label: "Peta Risiko", icon: Map },
  { href: "/komoditas", label: "Komoditas", icon: Package },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-surface sticky top-0 h-screen">
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
          <Sprout className="h-5 w-5" />
        </span>
        <div>
          <div className="text-base font-bold tracking-tight text-primary leading-none">AROMA</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-hidden px-3 py-2">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent/10 text-accent-strong"
                  : "text-secondary hover:bg-muted hover:text-primary"
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                active ? "bg-accent text-white" : "bg-muted text-secondary group-hover:bg-accent/10 group-hover:text-accent-strong"
              }`}>
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
              {active && <ChevronRight className="ml-auto h-4 w-4 text-accent" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
