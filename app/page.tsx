"use client";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-muted/30">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}
