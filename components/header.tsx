"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoLogo } from "@/components/go-logo";
import {
  Settings,
  Bell,
  Github,
  Download,
  Rocket,
  Share2,
  Users,
} from "lucide-react";

export function Header() {
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: "Go - AI Code Generator",
        url: window.location.href,
      });
    } else {
      if (typeof window !== "undefined") {
        navigator.clipboard?.writeText(window.location.href);
        alert("URL copiada!");
      }
    }
  };

  const handleExport = () => {
    alert("Funcionalidade de exportação em desenvolvimento!");
  };

  const handleDeploy = () => {
    alert("Deploy em desenvolvimento!");
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 go-shadow">
      <div className="flex items-center gap-4">
        <GoLogo size="lg" className="animate-fade-in-up" />

        <Badge
          variant="outline"
          className="border-emerald-200 text-emerald-700 bg-emerald-50"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
          Online
        </Badge>

        <Badge
          variant="outline"
          className="border-blue-200 text-blue-700 bg-blue-50"
        >
          Go CLI v1.0.0
        </Badge>

        <span className="text-xs text-muted-foreground">
          Powered by Gemini AI
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Users className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-2"></div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-1" />
          Compartilhar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Github className="w-4 h-4 mr-1" />
          GitHub
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-accent bg-transparent"
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-1" />
          Exportar
        </Button>

        <Button
          size="sm"
          className="go-gradient text-white hover:opacity-90 go-shadow"
          onClick={handleDeploy}
        >
          <Rocket className="w-4 h-4 mr-1" />
          Deploy
        </Button>
      </div>
    </header>
  );
}
