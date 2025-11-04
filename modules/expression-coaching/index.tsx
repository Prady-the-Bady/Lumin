"use client"

import { Button } from "@/components/ui/button"
import { useCoachingStore } from "@/stores/coaching-store"
import { SceneSelector } from "./scene-selector"
import { WebcamViewer } from "./webcam-viewer"
import { CoachingMetrics } from "./coaching-metrics"
import { ReferenceImageControl } from "./reference-image-control"
import { StopCircle } from "lucide-react"
import { api } from "@/services/api"
import { toast } from "sonner"

export function ExpressionCoachingModule() {
  const { isCoaching, currentSession, stopSession } = useCoachingStore()

  const handleStopSession = async () => {
    if (currentSession) {
      try {
        await api.stopCoachingSession(currentSession.id)
      } catch (error) {
        console.log("[v0] Backend unavailable for stop session")
      }
    }
    stopSession()
    toast.success("Coaching session ended")
  }

  if (!isCoaching) {
    return <SceneSelector />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Active Coaching Session</h3>
        <Button
          onClick={handleStopSession}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
        >
          <StopCircle className="w-4 h-4 mr-2" />
          Stop Session
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WebcamViewer />
        </div>
        <div className="space-y-6">
          <ReferenceImageControl />
          <CoachingMetrics />
        </div>
      </div>
    </div>
  )
}
