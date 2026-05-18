import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pravex.vercel.app"),
  title: {
    default: "Pavex Institutional | Digital Asset Brokerage",
    template: "%s | Pavex Institutional",
  },
  description: "Institutional-grade digital asset trading infrastructure. Access premium liquidity, secure custody, and real-time analytics trusted by 2,500+ institutions in 120+ countries.",
  keywords: ["institutional brokerage", "digital assets", "crypto custody", "MPC-CMP", "institutional trading", "Bitcoin", "Ethereum"],
  openGraph: {
    type: "website",
    siteName: "Pavex Institutional",
    locale: "en_US",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Pavex Institutional",
    }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ReactQueryProvider } from "@/lib/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
