import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { EmergencySos } from "@/components/layout/EmergencySos";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marine Safety & Navigation Portal",
  description: "Empowering small-scale fishermen with real-time oceanographic data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-wave-pattern min-h-screen pt-24 pb-12 overflow-x-hidden`}>
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              {children}
              <EmergencySos />
            </main>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
