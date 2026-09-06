import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AROMA | Dashboard",
  description: "Dashboard prediksi harga pangan Indonesia.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}