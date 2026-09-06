import { LayoutDashboard, Map, Package, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** menu navigasi utama dashboard — dipakai Sidebar (desktop) & BottomNav (mobile) */
export const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/peta", label: "Peta Risiko", icon: Map },
  { href: "/komoditas", label: "Komoditas", icon: Package },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];
