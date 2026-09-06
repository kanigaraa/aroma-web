"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Map, Package, Settings, ChevronRight, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/peta", label: "Peta Risiko", icon: Map },
  { href: "/komoditas", label: "Komoditas", icon: Package },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  const navItems = NAV.map((item) => {
    const active = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
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
  });

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface shadow-sm lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5 text-primary" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 bg-surface shadow-xl">
            <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Logo size={32} />
                <span className="text-base font-bold leading-none tracking-tight text-primary">AROMA</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
              {navItems}
            </nav>
            <div className="shrink-0 border-t border-border px-3 py-3">
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-red-100 group-hover:text-red-600">
                  <LogOut className="h-4 w-4" />
                </span>
                Keluar
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex ${className}`}>
        <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
          <Logo size={36} />
          <div className="text-base font-bold leading-none tracking-tight text-primary">AROMA</div>
        </div>
        <nav className="flex-1 space-y-1 overflow-hidden px-3 py-2">
          {navItems}
        </nav>
        <div className="shrink-0 border-t border-border px-3 py-3">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-red-100 group-hover:text-red-600">
              <LogOut className="h-4 w-4" />
            </span>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
