import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iron Bridge Banking | Premium Enterprise Digital Banking",
  description: "Premier digital banking, private wealth management, commercial lending, and flexible personal accounts.",
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
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
