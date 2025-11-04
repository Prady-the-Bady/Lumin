"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { AgentFeedback } from "@/types"
import { MessageSquare, TrendingUp, Users, Shield } from "lucide-react"

interface AgentFeedbackCardProps {
  feedback: AgentFeedback
  index: number
}

const agentIcons = {
  dialogue: MessageSquare,
  plot: TrendingUp,
  character: Users,
  content: Shield,
}

const agentColors = {
  dialogue: "text-blue-500",
  plot: "text-green-500",
  character: "text-purple-500",
  content: "text-red-500",
}

export function AgentFeedbackCard({ feedback, index }: AgentFeedbackCardProps) {
  const Icon = agentIcons[feedback.agentType]
  const colorClass = agentColors[feedback.agentType]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${colorClass}`} />
            <span className="text-white capitalize">{feedback.agentType} Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Score</span>
              <span className="text-white font-semibold">{feedback.score}/100</span>
            </div>
            <Progress value={feedback.score} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium">Feedback</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{feedback.feedback}</p>
          </div>

          {feedback.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Suggestions</h4>
              <ul className="space-y-1">
                {feedback.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
