"use client"

import { ScriptUpload } from "./script-upload"
import { AnalysisDashboard } from "./analysis-dashboard"
import { useScriptStore } from "@/stores/script-store"

export function ScriptAnalysisModule() {
  const { currentAnalysis } = useScriptStore()

  return (
    <div className="space-y-8">
      {!currentAnalysis && <ScriptUpload />}
      <AnalysisDashboard />
    </div>
  )
}
