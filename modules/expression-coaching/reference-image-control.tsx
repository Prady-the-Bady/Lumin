"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, Upload, X, Eye, EyeOff } from "lucide-react"
import { useCoachingStore } from "@/stores/coaching-store"
import { toast } from "sonner"

const PRESET_EXPRESSIONS = [
  { name: "Happy", url: "/happy-facial-expression.jpg" },
  { name: "Sad", url: "/sad-facial-expression.jpg" },
  { name: "Angry", url: "/angry-facial-expression.jpg" },
  { name: "Surprised", url: "/surprised-facial-expression.jpg" },
  { name: "Fearful", url: "/fearful-facial-expression.jpg" },
  { name: "Neutral", url: "/neutral-facial-expression.jpg" },
]

export function ReferenceImageControl() {
  const { referenceImage, showReference, referenceOpacity, setReferenceImage, toggleReference, setReferenceOpacity } =
    useCoachingStore()
  const [showPresets, setShowPresets] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setReferenceImage(imageUrl)
      toast.success("Reference image uploaded")
    }
    reader.readAsDataURL(file)
  }

  const handlePresetSelect = (url: string) => {
    setReferenceImage(url)
    setShowPresets(false)
    toast.success("Reference image selected")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Reference Image</h4>
        <div className="flex items-center gap-2">
          {referenceImage && (
            <>
              <Button
                onClick={toggleReference}
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-zinc-400 hover:text-white"
              >
                {showReference ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                onClick={() => setReferenceImage(null)}
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-zinc-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {!referenceImage ? (
        <div className="space-y-3">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full border-zinc-700 hover:border-amber-500 hover:bg-amber-500/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Reference Image
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

          <Button
            onClick={() => setShowPresets(!showPresets)}
            variant="outline"
            className="w-full border-zinc-700 hover:border-amber-500 hover:bg-amber-500/10"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose Preset Expression
          </Button>

          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-3 gap-2 overflow-hidden"
              >
                {PRESET_EXPRESSIONS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset.url)}
                    className="aspect-square rounded-lg border border-zinc-700 hover:border-amber-500 overflow-hidden transition-colors group"
                  >
                    <img
                      src={preset.url || "/placeholder.svg"}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="bg-zinc-900/90 py-1 text-xs text-zinc-400 group-hover:text-amber-500">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="aspect-square rounded-lg border border-zinc-700 overflow-hidden">
            <img
              src={referenceImage || "/placeholder.svg"}
              alt="Reference expression"
              className="w-full h-full object-cover"
            />
          </div>

          {showReference && (
            <div className="space-y-2">
              <label className="text-xs text-zinc-400">Overlay Opacity</label>
              <Slider
                value={[referenceOpacity * 100]}
                onValueChange={(value) => setReferenceOpacity(value[0] / 100)}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-zinc-500 text-right">{Math.round(referenceOpacity * 100)}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
