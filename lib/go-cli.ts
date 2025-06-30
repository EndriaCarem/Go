export interface GoCliStatus {
  available: boolean
  version?: string
  lastCheck: Date
}

export class GoCli {
  private static instance: GoCli
  private status: GoCliStatus = {
    available: false,
    lastCheck: new Date(),
  }

  static getInstance(): GoCli {
    if (!GoCli.instance) {
      GoCli.instance = new GoCli()
    }
    return GoCli.instance
  }

  async checkStatus(): Promise<GoCliStatus> {
    try {
      // Simula verificação do Go CLI
      const response = await fetch("/api/go-cli-status")
      if (response.ok) {
        const data = await response.json()
        this.status = {
          available: data.available || true,
          version: data.version || "1.0.0",
          lastCheck: new Date(),
        }
      }
    } catch (error) {
      console.log("Go CLI check failed, using fallback")
      this.status = {
        available: true, // Assumir disponível por padrão
        version: "1.0.0",
        lastCheck: new Date(),
      }
    }
    return this.status
  }

  async generateCode(
    prompt: string,
    options: {
      language?: string
      complexity?: string
    } = {},
  ): Promise<{ success: boolean; files?: any[]; error?: string }> {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          useGoCli: this.status.available,
          ...options,
        }),
      })

      if (!response.ok) {
        throw new Error("Generation failed")
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  getStatus(): GoCliStatus {
    return this.status
  }
}

export const goCli = GoCli.getInstance()
