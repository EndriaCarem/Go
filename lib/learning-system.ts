export interface CodeExample {
  id: string
  prompt: string
  language: string
  complexity: string
  code: string
  quality: number // 1-10
  feedback: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface LearningData {
  examples: CodeExample[]
  patterns: PatternData[]
  improvements: ImprovementSuggestion[]
}

export interface PatternData {
  pattern: string
  frequency: number
  successRate: number
  examples: string[]
  bestPractices: string[]
}

export interface ImprovementSuggestion {
  area: string
  description: string
  priority: number
  examples: string[]
}

export class LearningSystem {
  private examples: CodeExample[] = []
  private patterns: Map<string, PatternData> = new Map()

  // Adicionar exemplo de código de alta qualidade
  addExample(example: Omit<CodeExample, "id" | "createdAt" | "updatedAt">): void {
    const newExample: CodeExample = {
      ...example,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.examples.push(newExample)
    this.analyzePatterns(newExample)
    this.saveToStorage()
  }

  // Analisar padrões nos exemplos
  private analyzePatterns(example: CodeExample): void {
    // Extrair padrões do código
    const codePatterns = this.extractCodePatterns(example.code)
    const promptPatterns = this.extractPromptPatterns(example.prompt)

    const allPatterns = [...codePatterns, ...promptPatterns]

    allPatterns.forEach((pattern) => {
      const existing = this.patterns.get(pattern)
      if (existing) {
        existing.frequency++
        existing.examples.push(example.id)
      } else {
        this.patterns.set(pattern, {
          pattern,
          frequency: 1,
          successRate: example.quality / 10,
          examples: [example.id],
          bestPractices: [],
        })
      }
    })

    this.analyzeAdvancedPatterns(example)
  }

  private analyzeAdvancedPatterns(example: CodeExample): void {
    // Análise de estrutura de código
    const structurePatterns = this.extractStructurePatterns(example.code)
    const designPatterns = this.extractDesignPatterns(example.code)
    const performancePatterns = this.extractPerformancePatterns(example.code)

    const allAdvancedPatterns = [...structurePatterns, ...designPatterns, ...performancePatterns]

    allAdvancedPatterns.forEach((pattern) => {
      this.updatePatternData(pattern, example.quality)
    })
  }

  private extractStructurePatterns(code: string): string[] {
    const patterns: string[] = []

    // Padrões de estrutura
    if (code.includes("useState") && code.includes("useEffect")) patterns.push("react:hooks-pattern")
    if (code.includes("interface") && code.includes("Props")) patterns.push("typescript:props-interface")
    if (code.includes("className=") && code.includes("flex")) patterns.push("css:flexbox-layout")
    if (code.includes("grid-cols")) patterns.push("css:grid-layout")
    if (code.includes("bg-gradient")) patterns.push("css:gradient-design")

    return patterns
  }

  private extractDesignPatterns(code: string): string[] {
    const patterns: string[] = []

    // Padrões de design
    if (code.includes("rounded-") && code.includes("shadow-")) patterns.push("design:modern-card")
    if (code.includes("animate-") || code.includes("transition-")) patterns.push("design:animations")
    if (code.includes("hover:") && code.includes("focus:")) patterns.push("design:interactive")

    return patterns
  }

  private extractPerformancePatterns(code: string): string[] {
    const patterns: string[] = []

    // Padrões de performance
    if (code.includes("useMemo") || code.includes("useCallback")) patterns.push("performance:optimization")
    if (code.includes("lazy") || code.includes("Suspense")) patterns.push("performance:lazy-loading")

    return patterns
  }

  private updatePatternData(pattern: string, quality: number): void {
    const existing = this.patterns.get(pattern)
    if (existing) {
      existing.frequency++
      existing.successRate = (existing.successRate + quality / 10) / 2
    } else {
      this.patterns.set(pattern, {
        pattern,
        frequency: 1,
        successRate: quality / 10,
        examples: [],
        bestPractices: this.getBestPracticesForPattern(pattern),
      })
    }
  }

  private getBestPracticesForPattern(pattern: string): string[] {
    const practices: { [key: string]: string[] } = {
      "react:hooks-pattern": ["Use useState para estado local", "Use useEffect para side effects"],
      "css:flexbox-layout": ["Use justify-center para centralizar", "Use items-center para alinhamento vertical"],
      "design:modern-card": ["Combine rounded-lg com shadow-md", "Use padding consistente"],
      "performance:optimization": ["Memoize funções pesadas", "Evite re-renders desnecessários"],
    }

    return practices[pattern] || []
  }

  // Extrair padrões do código
  private extractCodePatterns(code: string): string[] {
    const patterns: string[] = []

    // Padrões CSS
    if (code.includes("flexbox")) patterns.push("css:flexbox")
    if (code.includes("grid")) patterns.push("css:grid")
    if (code.includes("linear-gradient")) patterns.push("css:gradients")
    if (code.includes("@media")) patterns.push("css:responsive")
    if (code.includes("transition")) patterns.push("css:animations")

    // Padrões HTML
    if (code.includes("semantic")) patterns.push("html:semantic")
    if (code.includes("aria-")) patterns.push("html:accessibility")

    // Padrões JavaScript
    if (code.includes("addEventListener")) patterns.push("js:events")
    if (code.includes("fetch(")) patterns.push("js:api")
    if (code.includes("async/await")) patterns.push("js:async")

    return patterns
  }

  // Extrair padrões do prompt
  private extractPromptPatterns(prompt: string): string[] {
    const patterns: string[] = []
    const lower = prompt.toLowerCase()

    if (lower.includes("landing")) patterns.push("prompt:landing")
    if (lower.includes("dashboard")) patterns.push("prompt:dashboard")
    if (lower.includes("responsivo")) patterns.push("prompt:responsive")
    if (lower.includes("moderno")) patterns.push("prompt:modern")

    return patterns
  }

  // Buscar exemplos similares
  findSimilarExamples(prompt: string, language: string, limit = 5): CodeExample[] {
    return this.examples
      .filter((ex) => ex.language === language)
      .filter((ex) => this.calculateSimilarity(prompt, ex.prompt) > 0.3)
      .sort((a, b) => b.quality - a.quality)
      .slice(0, limit)
  }

  // Calcular similaridade entre prompts
  private calculateSimilarity(prompt1: string, prompt2: string): number {
    const words1 = prompt1.toLowerCase().split(" ")
    const words2 = prompt2.toLowerCase().split(" ")

    const intersection = words1.filter((word) => words2.includes(word))
    const union = [...new Set([...words1, ...words2])]

    return intersection.length / union.length
  }

  // Gerar prompt melhorado baseado em exemplos
  generateImprovedPrompt(originalPrompt: string, language: string): string {
    const similarExamples = this.findSimilarExamples(originalPrompt, language, 3)
    const bestPractices = this.getBestPracticesForLanguage(language)

    let improvedPrompt = originalPrompt

    // Adicionar contexto dos melhores exemplos
    if (similarExamples.length > 0) {
      const successfulPatterns = similarExamples
        .flatMap((ex) => ex.tags)
        .filter((tag, index, arr) => arr.indexOf(tag) === index)

      improvedPrompt += `\n\nCONTEXTO DOS MELHORES EXEMPLOS:\n${successfulPatterns.map((pattern) => `- ${pattern}`).join("\n")}`
    }

    // Adicionar melhores práticas
    improvedPrompt += `\n\nMELHORES PRÁTICAS IDENTIFICADAS:\n${bestPractices.join("\n")}`

    return improvedPrompt
  }

  generateIntelligentCode(prompt: string, language: string): string {
    const relevantPatterns = this.getRelevantPatterns(prompt, language)

    let enhancedPrompt = prompt

    // Aplicar padrões de sucesso
    if (relevantPatterns.length > 0) {
      enhancedPrompt += `\n\nAPLICAR PADRÕES DE SUCESSO:\n${relevantPatterns.map((p) => `- ${p.pattern} (${Math.round(p.successRate * 100)}% sucesso)`).join("\n")}`
    }

    return enhancedPrompt
  }

  private getRelevantPatterns(prompt: string, language: string): PatternData[] {
    return Array.from(this.patterns.values())
      .filter((pattern) => pattern.successRate > 0.7)
      .filter((pattern) => this.isPatternRelevant(pattern.pattern, prompt, language))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5)
  }

  private isPatternRelevant(pattern: string, prompt: string, language: string): boolean {
    const promptLower = prompt.toLowerCase()

    if (pattern.includes("react") && (language === "react" || language === "nextjs")) return true
    if (pattern.includes("css") && promptLower.includes("design")) return true
    if (pattern.includes("performance") && promptLower.includes("rápido")) return true

    return false
  }

  // Obter melhores práticas para uma linguagem
  private getBestPracticesForLanguage(language: string): string[] {
    const practices: { [key: string]: string[] } = {
      html: [
        "- Use HTML5 semântico (header, main, section, article)",
        "- Implemente acessibilidade (ARIA labels, alt text)",
        "- Design responsivo com mobile-first",
        "- CSS Grid e Flexbox para layouts",
        "- Animações CSS suaves e performáticas",
        "- Gradientes e sombras modernas",
        "- Tipografia hierárquica clara",
      ],
      react: [
        "- Componentes funcionais com hooks",
        "- TypeScript para type safety",
        "- Props bem tipadas",
        "- Custom hooks para lógica reutilizável",
        "- Context API para estado global",
        "- Lazy loading e code splitting",
        "- Error boundaries",
      ],
      nextjs: [
        "- App Router (Next.js 13+)",
        "- Server Components quando apropriado",
        "- API Routes para backend",
        "- Otimizações de imagem automáticas",
        "- SEO otimizado",
        "- Performance metrics",
      ],
    }

    return practices[language] || practices.html
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "v0-learning-data",
        JSON.stringify({
          examples: this.examples,
          patterns: Array.from(this.patterns.entries()),
        }),
      )
    }
  }

  loadFromStorage(): void {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("v0-learning-data")
      if (data) {
        const parsed = JSON.parse(data)
        this.examples = parsed.examples || []
        this.patterns = new Map(parsed.patterns || [])
      }
    }
  }
}

// Instância global do sistema de aprendizado
export const learningSystem = new LearningSystem()
