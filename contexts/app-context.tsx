"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FileData {
  path: string;
  content: string;
  type: string;
  language: string;
}

interface AppContextType {
  // Chat
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;
  setIsLoading: (loading: boolean) => void;

  // Files
  files: FileData[];
  selectedFile: FileData | null;
  selectFile: (file: FileData) => void;
  setFiles: (files: FileData[]) => void;

  // Generation
  generateCode: (prompt: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const selectFile = (file: FileData) => {
    setSelectedFile(file);
  };

  const generateCode = async (prompt: string) => {
    setIsLoading(true);

    addMessage({
      type: "user",
      content: prompt,
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.files && Array.isArray(data.files)) {
        setFiles(data.files);
        setSelectedFile(data.files[0] || null);

        addMessage({
          type: "assistant",
          content: `🎉 Projeto gerado com sucesso! ${data.files.length} arquivos criados.`,
        });
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (error) {
      console.error("Erro ao gerar código:", error);
      addMessage({
        type: "assistant",
        content: "❌ Erro ao gerar projeto. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        isLoading,
        addMessage,
        clearMessages,
        setIsLoading,
        files,
        selectedFile,
        selectFile,
        setFiles,
        generateCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
