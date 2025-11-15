import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grow Tracker - Cannabis Home Grow App",
  description: "Moderne PWA App zum Verfolgen von Cannabis Home Grows. Wachstumsphasen tracking, Gieß-Erinnerungen und Bildergalerie.",
  keywords: ["Grow Tracker", "Cannabis", "Home Grow", "PWA", "Wachstums-Tracking", "Gießen"],
  authors: [{ name: "Grow Tracker Team" }],
  icons: {
    icon: "/icon-1024x1024.png",
    apple: "/icon-1024x1024.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Grow Tracker - Cannabis Home Grow App",
    description: "Moderne PWA App zum Verfolgen von Cannabis Home Grows",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grow Tracker - Cannabis Home Grow App",
    description: "Moderne PWA App zum Verfolgen von Cannabis Home Grows",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Grow Tracker" />
        <link rel="apple-touch-icon" href="/icon-1024x1024.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Sonner />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
