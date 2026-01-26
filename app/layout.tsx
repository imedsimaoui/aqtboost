import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AQTBOOST - Professional Rank Boosting Services",
  description: "Boost your rank on League of Legends, Valorant, CS2 and more. Certified boosters, secure payment, guaranteed results.",
  keywords: ["aqtboost", "boosting", "league of legends", "valorant", "cs2", "dota 2", "elo boost", "rank boost"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
