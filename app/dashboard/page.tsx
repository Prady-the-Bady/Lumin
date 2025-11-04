"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { ScriptAnalysisModule } from "@/modules/script-analysis"
import { ExpressionCoachingModule } from "@/modules/expression-coaching"
import { PosterGenerationModule } from "@/modules/poster-generation"
import { ErrorBoundary } from "@/components/common/error-boundary"
import { useWebSocket } from "@/hooks/use-websocket"

export default function DashboardPage() {
  const [activeModule, setActiveModule] = useState<"script" | "coaching" | "poster">("script")
  const { isConnected } = useWebSocket()

  useEffect(() => {
    console.log("[v0] WebSocket connected:", isConnected())
  }, [isConnected])

  const modules = {
    script: <ScriptAnalysisModule />,
    coaching: <ExpressionCoachingModule />,
    poster: <PosterGenerationModule />,
  }

  const moduleTitles = {
    script: "Script Analysis Studio",
    coaching: "Expression Coaching Studio",
    poster: "Poster Generation Studio",
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
          <DashboardNav activeModule={activeModule} onModuleChange={setActiveModule} />

          <main className="max-w-7xl mx-auto px-6 py-12">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">{moduleTitles[activeModule]}</h1>
              <p className="text-zinc-400">
                {activeModule === "script" && "Upload and analyze your screenplay with AI-powered feedback"}
                {activeModule === "coaching" && "Practice your expressions with real-time AR coaching"}
                {activeModule === "poster" && "Generate stunning movie posters with AI"}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {modules[activeModule]}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
