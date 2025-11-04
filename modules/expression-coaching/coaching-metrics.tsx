"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCoachingStore } from "@/stores/coaching-store"
import { Smile, Eye, Activity, TrendingUp } from "lucide-react"

const metricIcons = {
  emotionalIntensity: Activity,
  facialSymmetry: Smile,
  eyeContact: Eye,
  microExpressions: TrendingUp,
}

const metricLabels = {
  emotionalIntensity: "Emotional Intensity",
  facialSymmetry: "Facial Symmetry",
  eyeContact: "Eye Contact",
  microExpressions: "Micro Expressions",
}

export function CoachingMetrics() {
  const { currentSession } = useCoachingStore()

  if (!currentSession) return null

  const metrics = currentSession.metrics
  const metricEntries = Object.entries(metrics).filter(([key]) => key !== "overallScore")

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl font-bold text-white">{Math.round(metrics.overallScore)}</span>
              <span className="text-zinc-400">/ 100</span>
            </div>
            <Progress value={metrics.overallScore} className="h-3" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Individual Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        {metricEntries.map(([key, value], index) => {
          const Icon = metricIcons[key as keyof typeof metricIcons]
          const label = metricLabels[key as keyof typeof metricLabels]

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-5 h-5 text-amber-500" />
                    <span className="text-white font-medium">{label}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Score</span>
                      <span className="text-white font-semibold">{Math.round(value as number)}</span>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
