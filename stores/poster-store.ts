// Poster generation state management

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { GeneratedPoster, PosterRequest } from "@/types"

interface PosterStore {
  currentPoster: GeneratedPoster | null
  posters: GeneratedPoster[]
  isGenerating: boolean
  progress: number
  error: string | null

  startGeneration: (request: PosterRequest) => void
  updateProgress: (progress: number) => void
  setCurrentPoster: (poster: GeneratedPoster) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const usePosterStore = create<PosterStore>()(
  devtools(
    (set) => ({
      currentPoster: null,
      posters: [],
      isGenerating: false,
      progress: 0,
      error: null,

      startGeneration: (request) =>
        set({
          isGenerating: true,
          progress: 0,
          error: null,
        }),

      updateProgress: (progress) => set({ progress }),

      setCurrentPoster: (poster) =>
        set((state) => ({
          currentPoster: poster,
          posters: [poster, ...state.posters],
          isGenerating: false,
          progress: 100,
        })),

      setError: (error) =>
        set({
          error,
          isGenerating: false,
        }),

      reset: () =>
        set({
          currentPoster: null,
          isGenerating: false,
          progress: 0,
          error: null,
        }),
    }),
    { name: "PosterStore" },
  ),
)
