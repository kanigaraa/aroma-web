import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import FloatingChat from "@/components/FloatingChat";
import BottomNav from "@/components/BottomNav";
import { getPriceNotifications } from "@/lib/data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const notifications = getPriceNotifications();
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-14 lg:pb-0">
        <Topbar notifications={notifications} />
        {children}
      </div>
      <FloatingChat />
      <BottomNav />
    </div>
  );
}
