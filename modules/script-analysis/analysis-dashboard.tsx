"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useScriptStore } from "@/stores/script-store"
import { useWebSocket } from "@/hooks/use-websocket"
import { AgentFeedbackCard } from "./agent-feedback-card"
import { LoadingSpinner } from "@/components/common/loading-spinner"
import { Progress } from "@/components/ui/progress"
import { FileText } from "lucide-react"
import type { AgentFeedback } from "@/types"

export function AnalysisDashboard() {
  const { currentAnalysis, addAgentFeedback, updateProgress } = useScriptStore()
  const { subscribe } = useWebSocket()

  useEffect(() => {
    if (!currentAnalysis) return

    // Subscribe to WebSocket events for real-time updates
    const unsubscribeProgress = subscribe("analysis:progress", (data) => {
      updateProgress(data.progress)
    })

    const unsubscribeFeedback = subscribe("analysis:feedback", (data) => {
      addAgentFeedback(data as AgentFeedback)
    })

    // Demo mode - simulate analysis if WebSocket is not connected
    const demoTimeout = setTimeout(() => {
      if (currentAnalysis.agents.length === 0) {
        simulateDemoAnalysis()
      }
    }, 2000)

    return () => {
      unsubscribeProgress()
      unsubscribeFeedback()
      clearTimeout(demoTimeout)
    }
  }, [currentAnalysis, subscribe, addAgentFeedback, updateProgress])

  const simulateDemoAnalysis = () => {
    const mockFeedback: AgentFeedback[] = [
      {
        agentType: "dialogue",
        score: 85,
        feedback: "Strong character voices with natural flow. Dialogue feels authentic and purposeful.",
        suggestions: [
          "Consider varying sentence length for more dynamic exchanges",
          "Add more subtext in key emotional scenes",
        ],
        timestamp: new Date().toISOString(),
      },
      {
        agentType: "plot",
        score: 78,
        feedback: "Solid three-act structure with clear turning points. Pacing is generally good.",
        suggestions: [
          "The second act could use more tension escalation",
          "Consider adding a subplot to enrich the main narrative",
        ],
        timestamp: new Date().toISOString(),
      },
      {
        agentType: "character",
        score: 92,
        feedback: "Well-developed characters with clear motivations and arcs. Strong protagonist.",
        suggestions: [
          "Supporting characters could use more distinct voices",
          "Explore the antagonist's backstory more deeply",
        ],
        timestamp: new Date().toISOString(),
      },
      {
        agentType: "content",
        score: 95,
        feedback: "Content is appropriate and well-balanced. No major concerns flagged.",
        suggestions: ["Consider age rating implications for certain scenes"],
        timestamp: new Date().toISOString(),
      },
    ]

    mockFeedback.forEach((feedback, index) => {
      setTimeout(() => {
        addAgentFeedback(feedback)
        updateProgress(((index + 1) / mockFeedback.length) * 100)
      }, index * 1500)
    })
  }

  if (!currentAnalysis) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <FileText className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">Upload a script to begin analysis</p>
        </div>
      </div>
    )
  }

  const isAnalyzing = currentAnalysis.status === "analyzing" && currentAnalysis.progress < 100

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{currentAnalysis.filename}</h3>
            <p className="text-zinc-400 text-sm">Uploaded {new Date(currentAnalysis.uploadedAt).toLocaleString()}</p>
          </div>
          {isAnalyzing && <LoadingSpinner size="sm" />}
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Analysis Progress</span>
              <span className="text-white">{Math.round(currentAnalysis.progress)}%</span>
            </div>
            <Progress value={currentAnalysis.progress} className="h-2" />
          </div>
        )}
      </motion.div>

      {/* Agent Feedback Cards */}
      {currentAnalysis.agents.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {currentAnalysis.agents.map((feedback, index) => (
            <AgentFeedbackCard key={feedback.timestamp} feedback={feedback} index={index} />
          ))}
        </div>
      )}

      {isAnalyzing && currentAnalysis.agents.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner text="AI agents are analyzing your script..." />
        </div>
      )}
    </div>
  )
}
