// Expression coaching state management

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { CoachingSession, CoachingMetrics, FacialLandmark } from "@/types"

interface CoachingStore {
  currentSession: CoachingSession | null
  isCoaching: boolean
  error: string | null
  referenceImage: string | null
  showReference: boolean
  referenceOpacity: number

  startSession: (sceneText: string, sessionId: string) => void
  stopSession: () => void
  updateMetrics: (metrics: CoachingMetrics) => void
  updateLandmarks: (landmarks: FacialLandmark[]) => void
  setError: (error: string | null) => void
  setReferenceImage: (image: string | null) => void
  toggleReference: () => void
  setReferenceOpacity: (opacity: number) => void
}

export const useCoachingStore = create<CoachingStore>()(
  devtools(
    (set) => ({
      currentSession: null,
      isCoaching: false,
      error: null,
      referenceImage: null,
      showReference: false,
      referenceOpacity: 0.5,

      startSession: (sceneText, sessionId) =>
        set({
          currentSession: {
            id: sessionId,
            sceneText,
            startedAt: new Date().toISOString(),
            status: "active",
            metrics: {
              emotionalIntensity: 0,
              facialSymmetry: 0,
              eyeContact: 0,
              microExpressions: 0,
              overallScore: 0,
            },
            facialLandmarks: [],
          },
          isCoaching: true,
          error: null,
        }),

      stopSession: () =>
        set((state) => ({
          currentSession: state.currentSession ? { ...state.currentSession, status: "completed" } : null,
          isCoaching: false,
        })),

      updateMetrics: (metrics) =>
        set((state) => ({
          currentSession: state.currentSession ? { ...state.currentSession, metrics } : null,
        })),

      updateLandmarks: (landmarks) =>
        set((state) => ({
          currentSession: state.currentSession ? { ...state.currentSession, facialLandmarks: landmarks } : null,
        })),

      setError: (error) => set({ error }),

      setReferenceImage: (image) => set({ referenceImage: image, showReference: !!image }),

      toggleReference: () => set((state) => ({ showReference: !state.showReference })),

      setReferenceOpacity: (opacity) => set({ referenceOpacity: opacity }),
    }),
    { name: "CoachingStore" },
  ),
)
