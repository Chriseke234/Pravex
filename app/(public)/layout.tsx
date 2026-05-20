import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { RiskWarning } from "@/components/ui/RiskWarning";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutional Digital Asset Brokerage",
  description: "Secure, high-performance operating system for institutional digital assets.",
  alternates: {
    canonical: "/",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Compliance Overlays */}
      <CookieBanner />
      <RiskWarning />
    </div>
  );
}
