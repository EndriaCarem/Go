import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simular verificação do Go CLI
    const isAvailable = false // Por enquanto sempre false

    const message = isAvailable
      ? "Go CLI está disponível e funcionando"
      : "Go CLI não encontrado. Usando Gemini API como fallback."

    const features = isAvailable
      ? [
          "Projetos mais complexos",
          "Múltiplos arquivos organizados",
          "Arquitetura profissional",
          "Melhor qualidade de código",
        ]
      : []

    return NextResponse.json({
      isAvailable,
      message,
      features,
    })
  } catch (error) {
    console.error("Erro ao verificar Go CLI:", error)
    return NextResponse.json(
      {
        isAvailable: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
