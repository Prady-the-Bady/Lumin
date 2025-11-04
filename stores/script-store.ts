// Script analysis state management

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { ScriptAnalysis, AgentFeedback } from "@/types"

interface ScriptStore {
  currentAnalysis: ScriptAnalysis | null
  analyses: ScriptAnalysis[]
  isUploading: boolean
  error: string | null

  setCurrentAnalysis: (analysis: ScriptAnalysis) => void
  updateProgress: (progress: number) => void
  addAgentFeedback: (feedback: AgentFeedback) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useScriptStore = create<ScriptStore>()(
  devtools(
    (set) => ({
      currentAnalysis: null,
      analyses: [],
      isUploading: false,
      error: null,

      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis, error: null }),

      updateProgress: (progress) =>
        set((state) => ({
          currentAnalysis: state.currentAnalysis ? { ...state.currentAnalysis, progress } : null,
        })),

      addAgentFeedback: (feedback) =>
        set((state) => ({
          currentAnalysis: state.currentAnalysis
            ? {
                ...state.currentAnalysis,
                agents: [...state.currentAnalysis.agents, feedback],
              }
            : null,
        })),

      setError: (error) => set({ error }),

      reset: () =>
        set({
          currentAnalysis: null,
          isUploading: false,
          error: null,
        }),
    }),
    { name: "ScriptStore" },
  ),
)
