import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Obralia - Conectando profesionales con clientes",
  description: "La plataforma líder para encontrar profesionales de la construcción y servicios de mantenimiento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
