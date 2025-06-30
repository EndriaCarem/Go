export interface QualityMetrics {
  accessibility: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  performance: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  seo: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  bestPractices: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  overall: number
}

export class CodeQuality {
  static analyzeCode(files: Array<{ path: string; content: string; language: string }>): QualityMetrics {
    const metrics: QualityMetrics = {
      accessibility: { score: 0, issues: [], suggestions: [] },
      performance: { score: 0, issues: [], suggestions: [] },
      seo: { score: 0, issues: [], suggestions: [] },
      bestPractices: { score: 0, issues: [], suggestions: [] },
      overall: 0,
    }

    files.forEach((file) => {
      if (file.language === "html" || file.path.endsWith(".html")) {
        this.analyzeHTML(file.content, metrics)
      } else if (file.language === "css" || file.path.endsWith(".css")) {
        this.analyzeCSS(file.content, metrics)
      } else if (file.language === "javascript" || file.path.endsWith(".js") || file.path.endsWith(".tsx")) {
        this.analyzeJavaScript(file.content, metrics)
      }
    })

    // Calcular score geral
    const scores = [
      metrics.accessibility.score,
      metrics.performance.score,
      metrics.seo.score,
      metrics.bestPractices.score,
    ]
    metrics.overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

    return metrics
  }

  private static analyzeHTML(content: string, metrics: QualityMetrics): void {
    let accessibilityScore = 100
    let seoScore = 100
    let performanceScore = 100

    // Verificações de Acessibilidade
    if (!content.includes("alt=")) {
      metrics.accessibility.issues.push("Imagens sem texto alternativo")
      metrics.accessibility.suggestions.push("Adicione atributos alt às imagens")
      accessibilityScore -= 20
    }

    if (!content.includes("aria-")) {
      metrics.accessibility.issues.push("Faltam atributos ARIA")
      metrics.accessibility.suggestions.push("Use atributos ARIA para melhor acessibilidade")
      accessibilityScore -= 15
    }

    if (!content.includes("<title>")) {
      metrics.seo.issues.push("Página sem título")
      metrics.seo.suggestions.push("Adicione um título descritivo à página")
      seoScore -= 30
    }

    if (!content.includes('meta name="description"')) {
      metrics.seo.issues.push("Meta description ausente")
      metrics.seo.suggestions.push("Adicione meta description para SEO")
      seoScore -= 20
    }

    // Verificações de Performance
    const imageCount = (content.match(/<img/g) || []).length
    if (imageCount > 10) {
      metrics.performance.issues.push("Muitas imagens na página")
      metrics.performance.suggestions.push("Considere lazy loading para imagens")
      performanceScore -= 15
    }

    metrics.accessibility.score = Math.max(0, accessibilityScore)
    metrics.seo.score = Math.max(0, seoScore)
    metrics.performance.score = Math.max(0, performanceScore)
  }

  private static analyzeCSS(content: string, metrics: QualityMetrics): void {
    let performanceScore = 100
    let bestPracticesScore = 100

    // Verificações de Performance CSS
    if (content.includes("!important")) {
      metrics.bestPractices.issues.push("Uso excessivo de !important")
      metrics.bestPractices.suggestions.push("Evite !important, use especificidade adequada")
      bestPracticesScore -= 10
    }

    if (content.includes("@import")) {
      metrics.performance.issues.push("Uso de @import pode afetar performance")
      metrics.performance.suggestions.push("Prefira <link> no HTML ao invés de @import")
      performanceScore -= 15
    }

    metrics.performance.score = Math.max(0, performanceScore)
    metrics.bestPractices.score = Math.max(0, bestPracticesScore)
  }

  private static analyzeJavaScript(content: string, metrics: QualityMetrics): void {
    let performanceScore = 100
    let bestPracticesScore = 100

    // Verificações de Best Practices
    if (content.includes("var ")) {
      metrics.bestPractices.issues.push("Uso de var ao invés de let/const")
      metrics.bestPractices.suggestions.push("Use let ou const ao invés de var")
      bestPracticesScore -= 10
    }

    if (content.includes("console.log")) {
      metrics.bestPractices.issues.push("Console.log encontrado no código")
      metrics.bestPractices.suggestions.push("Remova console.log antes do deploy")
      bestPracticesScore -= 5
    }

    // Verificações de Performance
    if (content.includes("document.write")) {
      metrics.performance.issues.push("Uso de document.write")
      metrics.performance.suggestions.push("Evite document.write, use DOM manipulation")
      performanceScore -= 20
    }

    metrics.performance.score = Math.max(0, performanceScore)
    metrics.bestPractices.score = Math.max(0, bestPracticesScore)
  }

  static generateReport(metrics: QualityMetrics): string {
    const getScoreColor = (score: number) => {
      if (score >= 90) return "🟢"
      if (score >= 70) return "🟡"
      return "🔴"
    }

    return `
# Relatório de Qualidade de Código

## Pontuação Geral: ${getScoreColor(metrics.overall)} ${metrics.overall}/100

### Acessibilidade: ${getScoreColor(metrics.accessibility.score)} ${metrics.accessibility.score}/100
${metrics.accessibility.issues.map((issue) => `- ❌ ${issue}`).join("\n")}
${metrics.accessibility.suggestions.map((suggestion) => `- 💡 ${suggestion}`).join("\n")}

### Performance: ${getScoreColor(metrics.performance.score)} ${metrics.performance.score}/100
${metrics.performance.issues.map((issue) => `- ❌ ${issue}`).join("\n")}
${metrics.performance.suggestions.map((suggestion) => `- 💡 ${suggestion}`).join("\n")}

### SEO: ${getScoreColor(metrics.seo.score)} ${metrics.seo.score}/100
${metrics.seo.issues.map((issue) => `- ❌ ${issue}`).join("\n")}
${metrics.seo.suggestions.map((suggestion) => `- 💡 ${suggestion}`).join("\n")}

### Boas Práticas: ${getScoreColor(metrics.bestPractices.score)} ${metrics.bestPractices.score}/100
${metrics.bestPractices.issues.map((issue) => `- ❌ ${issue}`).join("\n")}
${metrics.bestPractices.suggestions.map((suggestion) => `- 💡 ${suggestion}`).join("\n")}
    `.trim()
  }
}
