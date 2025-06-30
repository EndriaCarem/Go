import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/app-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Go - AI Code Generator",
  description: "Gerador de código inteligente powered by AI",
  keywords: [
    "AI",
    "code generator",
    "React",
    "Next.js",
    "HTML",
    "CSS",
    "JavaScript",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
