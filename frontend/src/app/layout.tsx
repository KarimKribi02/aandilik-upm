import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Aandilik | Louez le matériel de construction lourd en toute confiance",
  description: "Plateforme de gestion et location d'engins performants et contrôlés.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

import { DataProvider } from "@/context/DataProvider";
import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className={`${outfit.variable} font-outfit antialiased bg-background text-foreground`}>
        <DataProvider>
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </DataProvider>
      </body>
    </html>
  );
}
