"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useCoachingStore } from "@/stores/coaching-store"
import { api } from "@/services/api"
import { toast } from "sonner"

const SAMPLE_SCENES = [
  {
    title: "Dramatic Confrontation",
    text: "You betrayed me. After everything we've been through, you chose them over us. Look me in the eyes and tell me it was worth it.",
  },
  {
    title: "Joyful Reunion",
    text: "I can't believe you're here! I thought I'd never see you again. This is the happiest day of my life!",
  },
  {
    title: "Fearful Discovery",
    text: "What is that sound? Something's not right. We need to get out of here. Now!",
  },
]

export function SceneSelector() {
  const [customScene, setCustomScene] = useState("")
  const [selectedScene, setSelectedScene] = useState<string | null>(null)
  const { startSession } = useCoachingStore()

  const handleStartSession = async (sceneText: string) => {
    try {
      const response = await api.startCoachingSession(sceneText)

      if (response.success && response.data) {
        startSession(sceneText, response.data.sessionId)
        toast.success("Coaching session started!")
      }
    } catch (error) {
      console.log("[v0] Backend unavailable, starting demo session")
      const demoSessionId = "demo-" + Date.now()
      startSession(sceneText, demoSessionId)
      toast.success("Coaching session started (Demo Mode)")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Choose a Scene</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {SAMPLE_SCENES.map((scene) => (
            <motion.div key={scene.title} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={`cursor-pointer transition-colors ${
                  selectedScene === scene.text
                    ? "bg-amber-500/20 border-amber-500"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
                onClick={() => setSelectedScene(scene.text)}
              >
                <CardContent className="p-4">
                  <h4 className="text-white font-medium mb-2">{scene.title}</h4>
                  <p className="text-zinc-400 text-sm line-clamp-3">{scene.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-zinc-950 px-4 text-zinc-500 text-sm">or</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Write Your Own Scene</h3>
        <Textarea
          placeholder="Enter your scene dialogue here..."
          value={customScene}
          onChange={(e) => setCustomScene(e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-white min-h-32"
        />
      </div>

      <Button
        onClick={() => handleStartSession(selectedScene || customScene)}
        disabled={!selectedScene && !customScene.trim()}
        className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950"
      >
        Start Coaching Session
      </Button>
    </div>
  )
}
