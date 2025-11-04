// WebSocket manager for real-time updates

import { io, type Socket } from "socket.io-client"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"

export type WebSocketEventHandler = (data: any) => void

class WebSocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 2000
  private isIntentionalDisconnect = false

  connect(): void {
    if (this.socket?.connected) {
      console.log("[v0] WebSocket already connected")
      return
    }

    this.isIntentionalDisconnect = false

    try {
      this.socket = io(WS_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      })

      this.socket.on("connect", () => {
        console.log("[v0] WebSocket connected")
        this.reconnectAttempts = 0
      })

      this.socket.on("disconnect", (reason) => {
        if (!this.isIntentionalDisconnect) {
          console.log("[v0] WebSocket disconnected:", reason)
        }
      })

      this.socket.on("connect_error", (error) => {
        this.reconnectAttempts++
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.warn("[v0] WebSocket connection failed after max attempts")
        }
      })
    } catch (error) {
      console.error("[v0] WebSocket connection error:", error)
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.isIntentionalDisconnect = true
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, handler: WebSocketEventHandler): void {
    if (this.socket) {
      this.socket.on(event, handler)
    }
  }

  off(event: string, handler?: WebSocketEventHandler): void {
    if (this.socket) {
      if (handler) {
        this.socket.off(event, handler)
      } else {
        this.socket.off(event)
      }
    }
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const wsManager = new WebSocketManager()
