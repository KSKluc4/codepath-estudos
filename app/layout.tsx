import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "highlight.js/styles/atom-one-dark.css";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import BootstrapClient from "@/components/BootstrapClient";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getLessonSummaries } from "@/lib/lessons";
import { MESES } from "@/lib/months";
import { getChapterSummaries } from "@/lib/chapters";
import { TRILHAS } from "@/lib/tracks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodePath — Do Zero ao Excelente",
  description:
    "Plataforma de estudos de programação: da lógica binária ao projeto final, em 6 meses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lessons = getLessonSummaries();
  const chapters = getChapterSummaries();

  return (
    <html lang="pt-BR" data-bs-theme="dark" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppProviders lessons={lessons} meses={MESES} chapters={chapters} trilhas={TRILHAS}>
          <BootstrapClient />
          <Navbar />
          <div className="d-flex app-shell">
            <Sidebar />
            <main className="flex-grow-1 min-w-0">{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
