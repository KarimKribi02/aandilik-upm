import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Equipment Catalog | Industrial Sophistication",
  description: "The premium construction equipment rental platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased bg-background text-foreground`}>
        <Navbar />
        <main className="min-h-screen pt-32">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
