import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    console.log("🚀 Gerando código para:", prompt)

    // Análise do prompt
    const analysis = analyzePrompt(prompt)

    // Gerar código usando Gemini API
    const files = await generateWithGemini(prompt, analysis)

    return NextResponse.json({
      files,
      success: true,
      detectedLanguage: analysis.language,
      analysis: analysis.description,
      method: "gemini-api",
    })
  } catch (error) {
    console.error("❌ Erro ao gerar código:", error)
    return NextResponse.json({ error: "Erro ao gerar projeto" }, { status: 500 })
  }
}

async function generateWithGemini(prompt: string, analysis: any) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY

  if (!apiKey) {
    console.log("⚠️ API Key não encontrada, usando fallback")
    return createFallbackProject(prompt, analysis)
  }

  try {
    const enhancedPrompt = buildEnhancedPrompt(prompt, analysis)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enhancedPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error("Resposta vazia da API")
    }

    // Limpar e parsear resposta
    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    const parsed = JSON.parse(cleanText)
    return parsed.files || []
  } catch (error) {
    console.error("❌ Erro na API Gemini:", error)
    return createFallbackProject(prompt, analysis)
  }
}

function analyzePrompt(prompt: string) {
  const lower = prompt.toLowerCase()

  // Detectar linguagem/framework
  let language = "html"
  let description = "uma página web"

  if (lower.includes("react native") || lower.includes("app mobile")) {
    language = "react-native"
    description = "um aplicativo mobile"
  } else if (lower.includes("react") || lower.includes("jsx")) {
    language = "react"
    description = "uma aplicação React"
  } else if (lower.includes("vue")) {
    language = "vue"
    description = "uma aplicação Vue"
  } else if (lower.includes("next") || lower.includes("nextjs")) {
    language = "nextjs"
    description = "uma aplicação Next.js"
  } else if (lower.includes("dashboard") || lower.includes("admin")) {
    language = "react"
    description = "um dashboard administrativo"
  } else if (lower.includes("landing") || lower.includes("página")) {
    language = "html"
    description = "uma landing page"
  }

  // Detectar complexidade
  let complexity = "medium"
  if (lower.includes("simples") || lower.includes("básico")) {
    complexity = "simple"
  } else if (lower.includes("completo") || lower.includes("avançado") || lower.includes("complexo")) {
    complexity = "complex"
  }

  return {
    language,
    description,
    complexity,
    confidence: 85,
  }
}

function buildEnhancedPrompt(prompt: string, analysis: any) {
  const systemPrompts = {
    html: `Você é um DESIGNER WEB EXPERT. Crie uma página HTML COMPLETA e MODERNA.

REGRAS OBRIGATÓRIAS:
- HTML5 semântico e acessível
- CSS3 moderno com Flexbox/Grid
- JavaScript ES6+ para interatividade
- Design responsivo (mobile-first)
- Animações CSS suaves
- Paleta de cores moderna
- Tipografia elegante

RETORNE APENAS JSON:
{
  "files": [
    {
      "path": "index.html",
      "content": "HTML completo com CSS e JS inline",
      "type": "html",
      "language": "html"
    }
  ]
}`,

    react: `Você é um ARQUITETO REACT SÊNIOR. Crie uma aplicação React PROFISSIONAL.

TECNOLOGIAS OBRIGATÓRIAS:
- React 18+ com hooks modernos
- TypeScript para type safety
- Componentes funcionais reutilizáveis
- CSS Modules ou Styled Components
- Custom hooks para lógica compartilhada

RETORNE APENAS JSON com múltiplos arquivos organizados.`,

    "react-native": `Você é um DESENVOLVEDOR MOBILE EXPERT. Crie um app React Native COMPLETO.

RECURSOS OBRIGATÓRIOS:
- React Native com TypeScript
- Navegação entre telas
- Componentes nativos
- Estilização moderna
- Funcionalidades mobile

RETORNE APENAS JSON com estrutura de app mobile.`,
  }

  const basePrompt = systemPrompts[analysis.language as keyof typeof systemPrompts] || systemPrompts.html

  return `${basePrompt}

PROMPT DO USUÁRIO: "${prompt}"

IMPORTANTE: Crie um projeto ${analysis.complexity} e ${analysis.description} que seja VISUALMENTE IMPRESSIONANTE e FUNCIONALMENTE COMPLETO.`
}

function createFallbackProject(prompt: string, analysis: any) {
  const title = extractTitle(prompt)

  return [
    {
      path: "index.html",
      content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .container {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            text-align: center;
            max-width: 600px;
            width: 90%;
            animation: slideInUp 0.6s ease-out;
        }

        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h1 {
            color: #1f2937;
            margin-bottom: 1rem;
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            color: #6b7280;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .btn {
            background: linear-gradient(135deg, #10b981, #3b82f6);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 ${title}</h1>
        <p>Projeto criado com Go AI - Gerador de código inteligente</p>
        <button class="btn" onclick="alert('🎉 Funcionando!')">Testar</button>
    </div>
    
    <script>
        console.log('🚀 ${title} carregado com sucesso!');
    </script>
</body>
</html>`,
      type: "html",
      language: "html",
    },
  ]
}

function extractTitle(prompt: string): string {
  const titlePatterns = [
    /(?:landing page|página|site) (?:para|da|de) (.+?)(?:\s|$)/i,
    /(?:criar|faça|gere) (?:uma|um) (?:página|site|landing) (?:para|da|de) (.+?)(?:\s|$)/i,
    /(?:app|aplicativo) (?:para|da|de) (.+?)(?:\s|$)/i,
  ]

  for (const pattern of titlePatterns) {
    const match = prompt.match(pattern)
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1)
    }
  }

  return "Meu Projeto"
}
