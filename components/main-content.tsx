"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/app-context";
import {
  Eye,
  Code,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
  Share2,
  Rocket,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";

export function MainContent() {
  const { files, selectedFile } = useApp();
  const [activeTab, setActiveTab] = useState("preview");
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  const currentFile = selectedFile || (files.length > 0 ? files[0] : null);

  const copyCode = () => {
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.content);
      alert("Código copiado!");
    }
  };

  const downloadFile = () => {
    if (currentFile) {
      const blob = new Blob([currentFile.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentFile.path.split("/").pop() || "component.tsx";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const shareProject = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "Projeto Go AI",
        text: "Confira este projeto criado com Go AI!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  const deployProject = () => {
    alert(
      "🚀 Deploy em desenvolvimento! Em breve você poderá fazer deploy direto para Vercel."
    );
  };

  const openInNewTab = () => {
    if (files.length > 0) {
      const htmlFile = files.find((f) => f.type === "html");
      if (htmlFile) {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(htmlFile.content);
          newWindow.document.close();
        }
      }
    }
  };

  const submitFeedback = () => {
    const feedbackData = {
      rating,
      feedback,
      timestamp: new Date().toISOString(),
    };
    console.log("Feedback enviado:", feedbackData);
    setShowFeedback(false);
    setRating(0);
    setFeedback("");
    alert("Obrigado pelo feedback!");
  };

  const PreviewIframe = () => {
    const htmlFile = files.find(
      (f) => f.path === "index.html" || f.type === "html"
    );

    if (!htmlFile) {
      return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="text-6xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Preview Interativo
            </h3>
            <p className="text-gray-500">Gere código HTML para ver o preview</p>
          </div>
        </div>
      );
    }

    return (
      <iframe
        srcDoc={htmlFile.content}
        className="w-full h-full border-0 rounded-lg"
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Top Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          {currentFile && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">
                {currentFile.path}
              </span>
              <Badge
                variant="outline"
                className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Pronto
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={shareProject}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Compartilhar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={openInNewTab}
            disabled={!files.some((f) => f.type === "html")}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Abrir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deployProject}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 hover:opacity-90"
          >
            <Rocket className="w-4 h-4 mr-1" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {files.length === 0 ? (
          // Enhanced Empty State
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-lg">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Crie Qualquer Interface
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Descreva o que você quer criar e nossa IA irá gerar código
                profissional instantaneamente.
              </p>

              <div className="bg-white p-8 rounded-3xl shadow-xl text-left border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <Code className="w-5 h-5 text-emerald-500" />
                  Exemplos para começar:
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="font-medium">
                      "Landing page para minha startup de IA"
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">
                      "Dashboard admin com gráficos"
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">
                      "App React Native para delivery"
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Enhanced Code Viewer
          <div className="h-full flex flex-col">
            {/* Project Header */}
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Projeto Gerado
                    </h1>
                    {currentFile && (
                      <p className="text-gray-500 flex items-center gap-2">
                        <span>{currentFile.path}</span>
                        <span className="text-emerald-500">●</span>
                        <span>Pronto</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCode}
                    disabled={!currentFile}
                    className="bg-white hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadFile}
                    disabled={!currentFile}
                    className="bg-white hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeedback(!showFeedback)}
                    className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Avaliar
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl h-12">
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg"
                  >
                    <Code className="w-4 h-4" />
                    Código
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="h-[calc(100%-80px)]">
                  <Card className="h-full border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                    <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-blue-50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="w-5 h-5 text-emerald-500" />
                        Preview Interativo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-80px)] p-0">
                      <div className="h-full">
                        <PreviewIframe />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="code" className="h-[calc(100%-80px)]">
                  <Card className="h-full border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                    <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-slate-50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="w-5 h-5 text-emerald-500" />
                        {currentFile?.path || "Código Fonte"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-80px)] p-0">
                      <div className="h-full bg-slate-900 p-6 overflow-auto">
                        <pre className="text-emerald-400 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                          {currentFile?.content ||
                            "// Selecione um arquivo na sidebar"}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Enhanced Feedback System */}
            {showFeedback && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      Avalie a Qualidade do Código
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Rating Stars */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Qual nota você daria? (1-10)
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                          <button
                            key={value}
                            onClick={() => setRating(value)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              value <= rating
                                ? "bg-yellow-400 border-yellow-400 text-white"
                                : "border-gray-300 hover:border-yellow-400"
                            }`}
                          >
                            {value <= rating ? (
                              <Star className="w-4 h-4 fill-current mx-auto" />
                            ) : (
                              <span className="text-xs">{value}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRating(8)}
                        className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Muito Bom
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRating(5)}
                        className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                      >
                        <Star className="w-4 h-4" />
                        Pode Melhorar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRating(3)}
                        className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Precisa Melhorar
                      </Button>
                    </div>

                    {/* Feedback Text */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Comentários (opcional):
                      </label>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="O que poderia ser melhorado? O que você gostou?"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={submitFeedback}
                        disabled={rating === 0}
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:opacity-90"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enviar Feedback
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowFeedback(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
