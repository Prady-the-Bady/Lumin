"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, ZoomIn, X } from "lucide-react"
import { usePosterStore } from "@/stores/poster-store"
import { Progress } from "@/components/ui/progress"
import { LoadingSpinner } from "@/components/common/loading-spinner"

export function PosterViewer() {
  const { currentPoster, isGenerating, progress } = usePosterStore()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  if (isGenerating) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12">
        <div className="text-center space-y-6">
          <LoadingSpinner size="lg" />
          <div className="space-y-2">
            <p className="text-white font-medium">Generating your poster...</p>
            <p className="text-zinc-400 text-sm">This may take a few moments</p>
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-zinc-500 text-sm">{Math.round(progress)}% complete</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPoster) {
    return null
  }

  const displayImage = selectedImage || currentPoster.imageUrl

  return (
    <div className="space-y-6">
      {/* Main Poster Display */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
        <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[3/4] bg-zinc-950">
              <img
                src={displayImage || "/placeholder.svg"}
                alt={currentPoster.request.title}
                className="w-full h-full object-contain"
              />

              {/* Zoom overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  onClick={() => setIsZoomed(true)}
                  className="bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = displayImage
                    link.download = `${currentPoster.request.title}-poster.jpg`
                    link.click()
                  }}
                  className="bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm"
                >
                  <Download className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>

            {/* Poster Info */}
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold text-white">{currentPoster.request.title}</h3>
              {currentPoster.request.tagline && <p className="text-zinc-400 italic">{currentPoster.request.tagline}</p>}
              <div className="flex flex-wrap gap-2 text-sm text-zinc-500">
                <span>Directed by {currentPoster.request.director}</span>
                <span>•</span>
                <span>{currentPoster.request.releaseYear}</span>
                <span>•</span>
                <span>{currentPoster.request.genre.join(", ")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Variations */}
      {currentPoster.variations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Variations</h4>
          <div className="grid grid-cols-3 gap-4">
            {currentPoster.variations.map((variation, index) => (
              <motion.div
                key={variation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => setSelectedImage(variation.imageUrl)}
              >
                <Card
                  className={`overflow-hidden ${
                    selectedImage === variation.imageUrl ? "ring-2 ring-amber-500" : "border-zinc-800"
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] bg-zinc-950">
                      <img
                        src={variation.imageUrl || "/placeholder.svg"}
                        alt={`Variation ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setIsZoomed(false)}
          >
            <Button
              size="icon"
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-zinc-900/80 hover:bg-zinc-800"
            >
              <X className="w-5 h-5 text-white" />
            </Button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={displayImage}
              alt="Zoomed poster"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
