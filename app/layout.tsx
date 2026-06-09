import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ironbridgemarket.vercel.app"),
  title: {
    default: "Ironbridgemarket Institutional | Digital Asset Brokerage",
    template: "%s | Ironbridgemarket Institutional",
  },
  description: "Institutional-grade digital asset trading infrastructure. Access premium liquidity, secure custody, and real-time analytics trusted by 2,500+ institutions in 120+ countries.",
  keywords: ["institutional brokerage", "digital assets", "crypto custody", "MPC-CMP", "institutional trading", "Bitcoin", "Ethereum"],
  openGraph: {
    type: "website",
    siteName: "Ironbridgemarket Institutional",
    locale: "en_US",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Ironbridgemarket Institutional",
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
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
