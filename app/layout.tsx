import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://ironbridgebanking.vercel.app"),
  title: {
    default: "Iron Bridge | Premium Enterprise Digital Banking",
    template: "%s | Iron Bridge",
  },
  description:
    "Iron Bridge — Modern enterprise banking, private wealth management, commercial financing, personal savings, and competitive loans.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: [
    "Iron Bridge",
    "digital banking",
    "personal accounts",
    "private banking",
    "business banking",
    "trade finance",
    "mortgage loans",
    "property loans",
    "fixed deposit",
  ],
  openGraph: {
    type: "website",
    siteName: "Iron Bridge",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Iron Bridge — Modern Digital Banking Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@IronBridgeBanking",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
