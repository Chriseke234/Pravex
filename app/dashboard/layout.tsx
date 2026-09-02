import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Topbar } from "@/features/dashboard/components/topbar";
import { MobileBottomNav } from "@/features/dashboard/components/mobile-bottom-nav";
import { SessionProvider } from "@/components/providers/session-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#050505]">
        {/* Sidebar - Fixed on desktop, slide drawer on mobile */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="pl-0 lg:pl-64 flex flex-col min-h-screen">
          {/* Topbar */}
          <Topbar />

          {/* Page Content */}
          <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            {children}
          </main>

          {/* Mobile Bottom Quick Bar */}
          <MobileBottomNav />
        </div>
      </div>
    </SessionProvider>
  );
}

