export interface SavedProject {
  id: string
  name: string
  description: string
  prompt: string // Adicionar esta linha
  files: Array<{
    path: string
    content: string
    language: string
  }>
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export class ProjectStorage {
  private static readonly STORAGE_KEY = "go-assistant-projects"

  static saveProject(project: Omit<SavedProject, "id" | "createdAt" | "updatedAt">): string {
    const projects = this.getAllProjects()
    const id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newProject: SavedProject = {
      ...project,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    projects.push(newProject)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))

    return id
  }

  static getAllProjects(): SavedProject[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []

      const projects = JSON.parse(stored)
      return projects.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }))
    } catch {
      return []
    }
  }

  static getProject(id: string): SavedProject | null {
    const projects = this.getAllProjects()
    return projects.find((p) => p.id === id) || null
  }

  static deleteProject(id: string): boolean {
    const projects = this.getAllProjects()
    const filtered = projects.filter((p) => p.id !== id)

    if (filtered.length !== projects.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
      return true
    }
    return false
  }

  static updateProject(id: string, updates: Partial<SavedProject>): boolean {
    const projects = this.getAllProjects()
    const index = projects.findIndex((p) => p.id === id)

    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date(),
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
      return true
    }
    return false
  }

  static exportProjects(): string {
    const projects = this.getAllProjects()
    return JSON.stringify(projects, null, 2)
  }

  static importProjects(jsonData: string): { success: boolean; imported: number; errors: string[] } {
    try {
      const importedProjects = JSON.parse(jsonData)
      const currentProjects = this.getAllProjects()
      const errors: string[] = []
      let imported = 0

      for (const project of importedProjects) {
        try {
          if (project.id && project.name && project.files) {
            // Evitar duplicatas
            if (!currentProjects.find((p) => p.id === project.id)) {
              currentProjects.push({
                ...project,
                createdAt: new Date(project.createdAt),
                updatedAt: new Date(project.updatedAt),
              })
              imported++
            }
          }
        } catch (error) {
          errors.push(`Erro ao importar projeto ${project.name || "sem nome"}`)
        }
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentProjects))
      return { success: true, imported, errors }
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: ["Formato de arquivo inválido"],
      }
    }
  }
}
