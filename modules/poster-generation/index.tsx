"use client"

import { PosterForm } from "./poster-form"
import { PosterViewer } from "./poster-viewer"
import { usePosterStore } from "@/stores/poster-store"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function PosterGenerationModule() {
  const { currentPoster, reset } = usePosterStore()

  return (
    <div className="space-y-8">
      {currentPoster && (
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Generated Poster</h3>
          <Button
            onClick={reset}
            variant="outline"
            className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Poster
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Poster Details</h3>
          <PosterForm />
        </div>
        <div>
          <PosterViewer />
        </div>
      </div>
    </div>
  )
}
