"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { usePosterStore } from "@/stores/poster-store"
import { toast } from "sonner"
import type { PosterRequest } from "@/types"
import { posterGenerator } from "@/services/poster-generator"

const GENRES = ["Action", "Drama", "Comedy", "Horror", "Sci-Fi", "Romance", "Thriller", "Fantasy"]
const THEMES = ["dark", "light", "vibrant", "minimal"]
const LAYOUTS = ["classic", "modern", "artistic"]

export function PosterForm() {
  const [formData, setFormData] = useState<PosterRequest>({
    title: "",
    tagline: "",
    genre: [],
    cast: [],
    director: "",
    releaseYear: new Date().getFullYear().toString(),
    theme: "dark",
    layout: "modern",
  })
  const [castInput, setCastInput] = useState("")
  const { startGeneration, updateProgress, setCurrentPoster, setError } = usePosterStore()

  const handleAddCast = () => {
    if (castInput.trim() && formData.cast.length < 5) {
      setFormData({ ...formData, cast: [...formData.cast, castInput.trim()] })
      setCastInput("")
    }
  }

  const handleRemoveCast = (index: number) => {
    setFormData({ ...formData, cast: formData.cast.filter((_, i) => i !== index) })
  }

  const handleGenreToggle = (genre: string) => {
    if (formData.genre.includes(genre)) {
      setFormData({ ...formData, genre: formData.genre.filter((g) => g !== genre) })
    } else if (formData.genre.length < 3) {
      setFormData({ ...formData, genre: [...formData.genre, genre] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.director || formData.genre.length === 0) {
      toast.error("Please fill in all required fields")
      return
    }

    startGeneration(formData)

    try {
      console.log("[v0] Generating poster with Canvas API...")

      // Simulate progress
      updateProgress(20)

      // Generate main poster
      const mainPosterUrl = await posterGenerator.generatePoster(formData)
      updateProgress(60)

      // Generate variations
      const variationUrls = await posterGenerator.generateVariations(formData)
      updateProgress(90)

      // Create poster object
      const generatedPoster = {
        id: "poster-" + Date.now(),
        imageUrl: mainPosterUrl,
        thumbnailUrl: mainPosterUrl,
        createdAt: new Date().toISOString(),
        request: formData,
        variations: variationUrls.map((url, index) => ({
          id: `var-${index + 1}`,
          imageUrl: url,
          theme: ["light", "vibrant", "minimal"][index] as any,
          layout: ["classic", "modern", "artistic"][index] as any,
        })),
      }

      updateProgress(100)
      setCurrentPoster(generatedPoster)
      toast.success("Poster generated successfully!")

      console.log("[v0] Poster generated successfully")
    } catch (error) {
      console.error("[v0] Poster generation error:", error)
      setError("Failed to generate poster. Please try again.")
      toast.error("Failed to generate poster")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-zinc-300">
            Movie Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter movie title"
            className="bg-zinc-900 border-zinc-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="director" className="text-zinc-300">
            Director *
          </Label>
          <Input
            id="director"
            value={formData.director}
            onChange={(e) => setFormData({ ...formData, director: e.target.value })}
            placeholder="Director name"
            className="bg-zinc-900 border-zinc-800 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline" className="text-zinc-300">
          Tagline
        </Label>
        <Textarea
          id="tagline"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          placeholder="Enter a catchy tagline"
          className="bg-zinc-900 border-zinc-800 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">Genre * (Select up to 3)</Label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <Badge
              key={genre}
              variant={formData.genre.includes(genre) ? "default" : "outline"}
              className={`cursor-pointer ${
                formData.genre.includes(genre)
                  ? "bg-amber-500 text-zinc-950 hover:bg-amber-600"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
              onClick={() => handleGenreToggle(genre)}
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">Cast (Up to 5)</Label>
        <div className="flex gap-2">
          <Input
            value={castInput}
            onChange={(e) => setCastInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCast())}
            placeholder="Add cast member"
            className="bg-zinc-900 border-zinc-800 text-white"
            disabled={formData.cast.length >= 5}
          />
          <Button
            type="button"
            onClick={handleAddCast}
            disabled={!castInput.trim() || formData.cast.length >= 5}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.cast.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.cast.map((member, index) => (
              <Badge key={index} variant="secondary" className="bg-zinc-800 text-white">
                {member}
                <button type="button" onClick={() => handleRemoveCast(index)} className="ml-2 hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="releaseYear" className="text-zinc-300">
            Release Year
          </Label>
          <Input
            id="releaseYear"
            type="number"
            value={formData.releaseYear}
            onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
            className="bg-zinc-900 border-zinc-800 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme" className="text-zinc-300">
            Theme
          </Label>
          <Select value={formData.theme} onValueChange={(value: any) => setFormData({ ...formData, theme: value })}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((theme) => (
                <SelectItem key={theme} value={theme} className="capitalize">
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="layout" className="text-zinc-300">
            Layout
          </Label>
          <Select value={formData.layout} onValueChange={(value: any) => setFormData({ ...formData, layout: value })}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LAYOUTS.map((layout) => (
                <SelectItem key={layout} value={layout} className="capitalize">
                  {layout}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950">
        Generate Poster
      </Button>
    </form>
  )
}
