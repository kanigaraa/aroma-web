import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import FloatingChat from "@/components/FloatingChat";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        {children}
      </div>
      <FloatingChat />
    </div>
  );
}
