import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Webmaster Alpha | Professional Digital Utilities",
  description: "All-in-one suite for URL shortening, QR generation, Website screenshots, and SEO analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="py-12 px-6 border-t border-white/5 text-center text-muted-foreground">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm">© 2026 Webmaster Alpha. Engineered for Performance.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
