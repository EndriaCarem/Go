"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/app-context";
import { ProjectStorage } from "@/lib/project-storage";
import {
  MessageSquare,
  Code2,
  Send,
  Loader2,
  Sparkles,
  User,
  Bot,
  Clock,
  File,
  Folder,
  ChevronRight,
  ChevronDown,
  Terminal,
  Save,
  FolderOpen,
} from "lucide-react";

export function Sidebar() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "files" | "projects">(
    "chat"
  );
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["root"])
  );
  const [selectedLanguage, setSelectedLanguage] = useState("nextjs");
  const [complexity, setComplexity] = useState<"simple" | "medium" | "complex">(
    "medium"
  );
  const [goCliStatus, setGoCliStatus] = useState({
    available: false,
    version: "",
  });
  const [savedProjects, setSavedProjects] = useState<any[]>([]);

  const { messages, isLoading, generateCode, files, selectedFile, selectFile } =
    useApp();

  useEffect(() => {
    // Verificar status do Go CLI
    const checkGoCliStatus = async () => {
      try {
        const response = await fetch("/api/go-cli-status");
        if (response.ok) {
          const status = await response.json();
          setGoCliStatus({
            available: status.available || true,
            version: status.version || "1.0.0",
          });
        } else {
          setGoCliStatus({ available: true, version: "1.0.0" });
        }
      } catch (error) {
        console.log("Go CLI check failed, assuming available");
        setGoCliStatus({ available: true, version: "1.0.0" });
      }
    };

    checkGoCliStatus();

    // Carregar projetos salvos
    setSavedProjects(ProjectStorage.getAllProjects());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await generateCode(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".tsx") || filename.endsWith(".ts")) {
      return <div className="w-3 h-3 bg-blue-500 rounded-full" />;
    }
    if (filename.endsWith(".html")) {
      return <div className="w-3 h-3 bg-orange-500 rounded-full" />;
    }
    if (filename.endsWith(".css")) {
      return <div className="w-3 h-3 bg-blue-400 rounded-full" />;
    }
    return <File className="w-3 h-3 text-muted-foreground" />;
  };

  const organizeFiles = () => {
    const organized: { [key: string]: string[] } = {};

    files.forEach((file) => {
      const parts = file.path.split("/");
      if (parts.length === 1) {
        if (!organized["root"]) organized["root"] = [];
        organized["root"].push(file.path);
      } else {
        const folder = parts[0];
        if (!organized[folder]) organized[folder] = [];
        organized[folder].push(file.path);
      }
    });

    return organized;
  };

  const organizedFiles = organizeFiles();

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  };

  const suggestions = [
    "🌐 Landing page moderna para startup",
    "📱 App React Native de delivery",
    "⚛️ Dashboard admin com gráficos",
    "🎮 Jogo simples em HTML5",
    "📊 Sistema de análise de dados",
    "🛒 E-commerce completo",
  ];

  const saveCurrentProject = () => {
    if (files.length === 0) {
      alert("Nenhum arquivo para salvar!");
      return;
    }

    const projectName = `Projeto ${new Date().toLocaleDateString("pt-BR")}`;
    try {
      const projectId = ProjectStorage.saveProject({
        name: projectName,
        description: `Projeto gerado com ${files.length} arquivos`,
        files: files.map((f) => ({
          path: f.path,
          content: f.content,
          language: f.language,
        })),
        tags: [selectedLanguage, complexity],
        prompt: input || "Projeto salvo",
      });

      setSavedProjects(ProjectStorage.getAllProjects());
      alert(`Projeto salvo com sucesso!`);
    } catch (error) {
      alert("Erro ao salvar projeto!");
      console.error("Erro ao salvar:", error);
    }
  };

  const loadProject = (project: any) => {
    if (
      confirm(
        `Carregar projeto "${project.name}"? Isso substituirá o projeto atual.`
      )
    ) {
      // Aqui você implementaria a lógica para carregar o projeto
      // Por enquanto, apenas mostra uma mensagem
      alert(`Funcionalidade de carregamento será implementada em breve!`);
      console.log("Carregando projeto:", project);
    }
  };

  const deleteProject = (
    projectId: string,
    projectName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (confirm(`Deletar projeto "${projectName}"?`)) {
      if (ProjectStorage.deleteProject(projectId)) {
        setSavedProjects(ProjectStorage.getAllProjects());
        alert("Projeto deletado!");
      } else {
        alert("Erro ao deletar projeto!");
      }
    }
  };

  return (
    <div className="w-80 bg-white border-r border-border flex flex-col shadow-lg">
      {/* Header Simplificado */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <Terminal className="w-3 h-3 mr-1" />
              Go CLI
            </Badge>
            {goCliStatus.available && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                v{goCliStatus.version}
              </Badge>
            )}
          </div>
          {files.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={saveCurrentProject}
              className="h-6 px-2 text-xs bg-transparent hover:bg-emerald-50"
            >
              <Save className="w-3 h-3 mr-1" />
              Salvar
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/30">
        <Button
          variant="ghost"
          className={`flex-1 rounded-none py-3 px-2 transition-all ${
            activeTab === "chat"
              ? "bg-background text-primary border-b-2 border-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          <span className="font-medium text-sm">Chat</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex-1 rounded-none py-3 px-2 transition-all ${
            activeTab === "files"
              ? "bg-background text-primary border-b-2 border-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          onClick={() => setActiveTab("files")}
        >
          <Code2 className="w-4 h-4 mr-1" />
          <span className="font-medium text-sm">Arquivos</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex-1 rounded-none py-3 px-2 transition-all ${
            activeTab === "projects"
              ? "bg-background text-primary border-b-2 border-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          <FolderOpen className="w-4 h-4 mr-1" />
          <span className="font-medium text-sm">Projetos</span>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === "chat" ? (
          <>
            {/* Chat History */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Conversa
                </h3>
                <Badge
                  variant="outline"
                  className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {messages.length} mensagens
                </Badge>
              </div>

              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 opacity-50 shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Nenhuma conversa ainda
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Comece digitando uma mensagem
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="animate-fade-in-up">
                        <div className="flex items-start gap-2 mb-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                              message.type === "user"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="w-3 h-3" />
                            ) : (
                              <Bot className="w-3 h-3" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-foreground">
                                {message.type === "user" ? "Você" : "Go AI"}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(message.timestamp)}
                              </span>
                            </div>

                            <div className="text-xs text-muted-foreground leading-relaxed bg-muted rounded-lg p-2">
                              {message.content.length > 120
                                ? `${message.content.substring(0, 120)}...`
                                : message.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Quick Suggestions */}
            <div className="p-4 border-t border-border">
              <div className="text-xs font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <Sparkles className="w-3 h-3" />
                Sugestões rápidas:
              </div>
              <div className="grid grid-cols-1 gap-1">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-left justify-start h-auto py-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() =>
                      setInput(suggestion.replace(/^[🌐📱⚛️🎮📊🛒]\s/u, ""))
                    }
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Enhanced Input */}
            <div className="p-4 border-t border-border">
              {isLoading && (
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <Bot className="w-4 h-4 text-emerald-600 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-foreground font-medium">
                        🤖 Go AI trabalhando...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {goCliStatus.available
                          ? "Usando Go CLI"
                          : "Gerando código profissional"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 bg-white rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Descreva o que você quer criar..."
                    className="min-h-[100px] resize-none pr-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-300"
                    disabled={isLoading}
                  />

                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isLoading}
                    className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:opacity-90"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:opacity-90 py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Código
                    </>
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : activeTab === "files" ? (
          /* Files Tab */
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Arquivos
              </h3>
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                {files.length} arquivos
              </Badge>
            </div>

            {files.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Code2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Nenhum arquivo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Gere código para ver os arquivos
                </p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-1">
                  {Object.entries(organizedFiles).map(([folder, fileList]) => (
                    <div key={folder}>
                      {folder !== "root" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start p-1 h-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => toggleFolder(folder)}
                        >
                          {expandedFolders.has(folder) ? (
                            <ChevronDown className="w-3 h-3 mr-1" />
                          ) : (
                            <ChevronRight className="w-3 h-3 mr-1" />
                          )}
                          <Folder className="w-3 h-3 mr-2 text-primary" />
                          <span className="text-xs">{folder}</span>
                        </Button>
                      )}

                      {(folder === "root" || expandedFolders.has(folder)) && (
                        <div className={folder !== "root" ? "ml-4" : ""}>
                          {fileList.map((filePath) => {
                            const file = files.find((f) => f.path === filePath);
                            if (!file) return null;

                            const fileName =
                              filePath.split("/").pop() || filePath;

                            return (
                              <Button
                                key={filePath}
                                variant="ghost"
                                size="sm"
                                className={`w-full justify-start p-1 h-6 hover:bg-muted ${
                                  selectedFile?.path === filePath
                                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                                onClick={() => selectFile(file)}
                              >
                                {getFileIcon(fileName)}
                                <span className="text-xs ml-2 truncate">
                                  {fileName}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        ) : (
          /* Projects Tab */
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Projetos Salvos
              </h3>
              <Badge
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
              >
                {savedProjects.length} projetos
              </Badge>
            </div>

            {savedProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <FolderOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Nenhum projeto salvo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Salve projetos para acessá-los depois
                </p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {savedProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="cursor-pointer transition-all hover:shadow-md hover:bg-gray-50"
                      onClick={() => loadProject(project)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                            <FolderOpen className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-foreground text-sm truncate">
                              {project.name}
                            </h5>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {project.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {project.files.length} arquivos
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    project.updatedAt
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) =>
                                  deleteProject(project.id, project.name, e)
                                }
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
