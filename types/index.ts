// Core type definitions for Lumin AI Filmography Assistant

// ============================================================================
// Authentication Types
// ============================================================================

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// ============================================================================
// Script Analysis Types
// ============================================================================

export interface ScriptAnalysis {
  id: string
  filename: string
  uploadedAt: string
  status: "uploading" | "analyzing" | "completed" | "error"
  progress: number
  agents: AgentFeedback[]
}

export interface AgentFeedback {
  agentType: "dialogue" | "plot" | "character" | "content"
  score: number
  feedback: string
  suggestions: string[]
  timestamp: string
}

// ============================================================================
// Expression Coaching Types
// ============================================================================

export interface CoachingSession {
  id: string
  sceneText: string
  startedAt: string
  status: "active" | "paused" | "completed"
  metrics: CoachingMetrics
  facialLandmarks: FacialLandmark[]
}

export interface CoachingMetrics {
  emotionalIntensity: number
  facialSymmetry: number
  eyeContact: number
  microExpressions: number
  overallScore: number
}

export interface FacialLandmark {
  x: number
  y: number
  z?: number
  label: string
}

// ============================================================================
// Poster Generation Types
// ============================================================================

export interface PosterRequest {
  title: string
  tagline: string
  genre: string[]
  cast: string[]
  director: string
  releaseYear: string
  theme: "dark" | "light" | "vibrant" | "minimal"
  layout: "classic" | "modern" | "artistic"
}

export interface GeneratedPoster {
  id: string
  imageUrl: string
  thumbnailUrl: string
  createdAt: string
  request: PosterRequest
  variations: PosterVariation[]
}

export interface PosterVariation {
  id: string
  imageUrl: string
  theme: string
  layout: string
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
}
