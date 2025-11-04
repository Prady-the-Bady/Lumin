// API client for backend and N8N webhook integration

import axios, { type AxiosInstance, type AxiosError } from "axios"
import { AuthManager } from "@/lib/auth"
import type { ApiResponse } from "@/types"

// API Configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api"
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "http://localhost:5678/webhook"

class ApiClient {
  private backend: AxiosInstance
  private n8n: AxiosInstance

  constructor() {
    // Backend API client
    this.backend = axios.create({
      baseURL: BACKEND_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // N8N webhook client
    this.n8n = axios.create({
      baseURL: N8N_WEBHOOK_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add auth token to requests
    this.backend.interceptors.request.use((config) => {
      const token = AuthManager.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle errors gracefully
    this.backend.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          console.warn("[v0] Backend server is offline")
          return Promise.reject(new Error("Backend server is offline"))
        }
        return Promise.reject(error)
      },
    )

    this.n8n.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          console.warn("[v0] N8N server is offline")
          return Promise.reject(new Error("N8N server is offline"))
        }
        return Promise.reject(error)
      },
    )
  }

  // ============================================================================
  // Script Analysis APIs
  // ============================================================================

  async uploadScript(file: File): Promise<ApiResponse<{ sessionId: string }>> {
    const formData = new FormData()
    formData.append("script", file)

    try {
      const response = await this.backend.post("/script/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    } catch (error) {
      console.error("[v0] Script upload failed:", error)
      throw error
    }
  }

  async analyzeScript(sessionId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.n8n.post("/analyze-script", { sessionId })
      return response.data
    } catch (error) {
      console.error("[v0] Script analysis failed:", error)
      throw error
    }
  }

  // ============================================================================
  // Expression Coaching APIs
  // ============================================================================

  async startCoachingSession(sceneText: string): Promise<ApiResponse<{ sessionId: string }>> {
    try {
      const response = await this.backend.post("/coaching/start", { sceneText })
      return response.data
    } catch (error) {
      console.error("[v0] Failed to start coaching session:", error)
      throw error
    }
  }

  async submitFrame(sessionId: string, frameData: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.backend.post(`/coaching/${sessionId}/frame`, {
        frame: frameData,
        timestamp: Date.now(),
      })
      return response.data
    } catch (error) {
      // Silently fail for frame submission to avoid console spam
      throw error
    }
  }

  async stopCoachingSession(sessionId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.backend.post(`/coaching/${sessionId}/stop`)
      return response.data
    } catch (error) {
      console.error("[v0] Failed to stop coaching session:", error)
      throw error
    }
  }

  // ============================================================================
  // Poster Generation APIs
  // ============================================================================

  async generatePoster(request: any): Promise<ApiResponse<{ posterId: string }>> {
    try {
      const response = await this.n8n.post("/generate-poster", request)
      return response.data
    } catch (error) {
      console.error("[v0] Poster generation failed:", error)
      throw error
    }
  }

  async getPosterStatus(posterId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.backend.get(`/poster/${posterId}/status`)
      return response.data
    } catch (error) {
      console.error("[v0] Failed to get poster status:", error)
      throw error
    }
  }

  // ============================================================================
  // Health Check
  // ============================================================================

  async checkHealth(): Promise<boolean> {
    try {
      await this.backend.get("/health")
      return true
    } catch (error) {
      return false
    }
  }
}

export const api = new ApiClient()
