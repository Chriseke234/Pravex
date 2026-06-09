import { Sidebar } from "@/features/dashboard/components/sidebar";
import { Topbar } from "@/features/dashboard/components/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar - Fixed position logic is inside Topbar component */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 mt-16 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
