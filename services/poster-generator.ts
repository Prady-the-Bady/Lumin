export interface PosterGenerationOptions {
  title: string
  tagline?: string
  genre: string[]
  cast: string[]
  director: string
  releaseYear: string
  theme: "dark" | "light" | "vibrant" | "minimal"
  layout: "classic" | "modern" | "artistic"
}

export class PosterGenerator {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement("canvas")
    this.canvas.width = 1200
    this.canvas.height = 1600
    this.ctx = this.canvas.getContext("2d")!
  }

  private getThemeColors(theme: string) {
    const themes = {
      dark: {
        background: "#0a0a0a",
        primary: "#f59e0b",
        secondary: "#27272a",
        text: "#ffffff",
        accent: "#fbbf24",
      },
      light: {
        background: "#f5f5f5",
        primary: "#1e40af",
        secondary: "#e5e7eb",
        text: "#1f2937",
        accent: "#3b82f6",
      },
      vibrant: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        primary: "#ff6b6b",
        secondary: "#4ecdc4",
        text: "#ffffff",
        accent: "#ffe66d",
      },
      minimal: {
        background: "#ffffff",
        primary: "#000000",
        secondary: "#e5e5e5",
        text: "#000000",
        accent: "#666666",
      },
    }
    return themes[theme as keyof typeof themes] || themes.dark
  }

  async generatePoster(options: PosterGenerationOptions): Promise<string> {
    const colors = this.getThemeColors(options.theme)
    const { width, height } = this.canvas

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height)

    // Draw background
    if (colors.background.includes("gradient")) {
      const gradient = this.ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#667eea")
      gradient.addColorStop(1, "#764ba2")
      this.ctx.fillStyle = gradient
    } else {
      this.ctx.fillStyle = colors.background
    }
    this.ctx.fillRect(0, 0, width, height)

    // Add decorative elements based on layout
    this.drawLayoutElements(options.layout, colors)

    // Draw title
    this.drawTitle(options.title, colors, options.layout)

    // Draw tagline
    if (options.tagline) {
      this.drawTagline(options.tagline, colors)
    }

    // Draw genre badges
    this.drawGenres(options.genre, colors)

    // Draw cast
    this.drawCast(options.cast, colors)

    // Draw director and year
    this.drawCredits(options.director, options.releaseYear, colors)

    // Convert to data URL
    return this.canvas.toDataURL("image/jpeg", 0.95)
  }

  private drawLayoutElements(layout: string, colors: any) {
    const { width, height } = this.canvas

    if (layout === "classic") {
      // Classic film strip border
      this.ctx.strokeStyle = colors.primary
      this.ctx.lineWidth = 20
      this.ctx.strokeRect(40, 40, width - 80, height - 80)

      // Corner decorations
      this.ctx.fillStyle = colors.primary
      const cornerSize = 60
      this.ctx.fillRect(40, 40, cornerSize, 4)
      this.ctx.fillRect(40, 40, 4, cornerSize)
      this.ctx.fillRect(width - 40 - cornerSize, 40, cornerSize, 4)
      this.ctx.fillRect(width - 44, 40, 4, cornerSize)
      this.ctx.fillRect(40, height - 44, cornerSize, 4)
      this.ctx.fillRect(40, height - 40 - cornerSize, 4, cornerSize)
      this.ctx.fillRect(width - 40 - cornerSize, height - 44, cornerSize, 4)
      this.ctx.fillRect(width - 44, height - 40 - cornerSize, 4, cornerSize)
    } else if (layout === "modern") {
      // Modern geometric shapes
      this.ctx.globalAlpha = 0.1
      this.ctx.fillStyle = colors.accent
      this.ctx.beginPath()
      this.ctx.arc(width * 0.8, height * 0.2, 300, 0, Math.PI * 2)
      this.ctx.fill()

      this.ctx.beginPath()
      this.ctx.arc(width * 0.2, height * 0.8, 250, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.globalAlpha = 1
    } else if (layout === "artistic") {
      // Artistic brush strokes
      this.ctx.globalAlpha = 0.15
      this.ctx.strokeStyle = colors.primary
      this.ctx.lineWidth = 80
      this.ctx.lineCap = "round"

      this.ctx.beginPath()
      this.ctx.moveTo(0, height * 0.3)
      this.ctx.quadraticCurveTo(width * 0.5, height * 0.2, width, height * 0.4)
      this.ctx.stroke()

      this.ctx.beginPath()
      this.ctx.moveTo(0, height * 0.7)
      this.ctx.quadraticCurveTo(width * 0.5, height * 0.8, width, height * 0.6)
      this.ctx.stroke()
      this.ctx.globalAlpha = 1
    }
  }

  private drawTitle(title: string, colors: any, layout: string) {
    const { width } = this.canvas
    const yPosition = layout === "classic" ? 400 : 500

    // Title shadow for depth
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
    this.ctx.shadowBlur = 20
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 10

    // Draw title
    this.ctx.fillStyle = colors.text
    this.ctx.font = "bold 120px Arial, sans-serif"
    this.ctx.textAlign = "center"
    this.ctx.textBaseline = "middle"

    // Word wrap for long titles
    const words = title.split(" ")
    const lines: string[] = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + " " + words[i]
      const metrics = this.ctx.measureText(testLine)
      if (metrics.width > width - 200) {
        lines.push(currentLine)
        currentLine = words[i]
      } else {
        currentLine = testLine
      }
    }
    lines.push(currentLine)

    // Draw each line
    lines.forEach((line, index) => {
      this.ctx.fillText(line, width / 2, yPosition + index * 130)
    })

    // Reset shadow
    this.ctx.shadowColor = "transparent"
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
  }

  private drawTagline(tagline: string, colors: any) {
    const { width } = this.canvas

    this.ctx.fillStyle = colors.accent
    this.ctx.font = "italic 40px Georgia, serif"
    this.ctx.textAlign = "center"
    this.ctx.fillText(tagline, width / 2, 750)
  }

  private drawGenres(genres: string[], colors: any) {
    const { width } = this.canvas
    const startY = 850
    const badgeWidth = 180
    const badgeHeight = 50
    const spacing = 20
    const totalWidth = genres.length * badgeWidth + (genres.length - 1) * spacing
    let startX = (width - totalWidth) / 2

    genres.forEach((genre) => {
      // Draw badge background
      this.ctx.fillStyle = colors.secondary
      this.ctx.beginPath()
      this.ctx.roundRect(startX, startY, badgeWidth, badgeHeight, 25)
      this.ctx.fill()

      // Draw badge text
      this.ctx.fillStyle = colors.text
      this.ctx.font = "bold 28px Arial, sans-serif"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      this.ctx.fillText(genre, startX + badgeWidth / 2, startY + badgeHeight / 2)

      startX += badgeWidth + spacing
    })
  }

  private drawCast(cast: string[], colors: any) {
    if (cast.length === 0) return

    const { width } = this.canvas
    const startY = 980

    this.ctx.fillStyle = colors.text
    this.ctx.font = "32px Arial, sans-serif"
    this.ctx.textAlign = "center"
    this.ctx.fillText("STARRING", width / 2, startY)

    cast.forEach((member, index) => {
      this.ctx.font = "bold 38px Arial, sans-serif"
      this.ctx.fillText(member, width / 2, startY + 60 + index * 50)
    })
  }

  private drawCredits(director: string, year: string, colors: any) {
    const { width, height } = this.canvas

    this.ctx.fillStyle = colors.text
    this.ctx.font = "36px Arial, sans-serif"
    this.ctx.textAlign = "center"

    this.ctx.fillText(`Directed by ${director}`, width / 2, height - 180)

    this.ctx.font = "bold 48px Arial, sans-serif"
    this.ctx.fillStyle = colors.primary
    this.ctx.fillText(year, width / 2, height - 100)
  }

  async generateVariations(options: PosterGenerationOptions): Promise<string[]> {
    const variations: string[] = []
    const themes: Array<"dark" | "light" | "vibrant" | "minimal"> = ["light", "vibrant", "minimal"]
    const layouts: Array<"classic" | "modern" | "artistic"> = ["classic", "modern", "artistic"]

    for (let i = 0; i < 3; i++) {
      const variantOptions = {
        ...options,
        theme: themes[i % themes.length],
        layout: layouts[i % layouts.length],
      }
      const posterUrl = await this.generatePoster(variantOptions)
      variations.push(posterUrl)
    }

    return variations
  }
}

export const posterGenerator = new PosterGenerator()
