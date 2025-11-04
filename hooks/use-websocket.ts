"use client"

// Custom hook for WebSocket integration

import { useEffect, useCallback } from "react"
import { wsManager, type WebSocketEventHandler } from "@/services/websocket"

export function useWebSocket() {
  useEffect(() => {
    wsManager.connect()

    return () => {
      wsManager.disconnect()
    }
  }, [])

  const subscribe = useCallback((event: string, handler: WebSocketEventHandler) => {
    wsManager.on(event, handler)
    return () => wsManager.off(event, handler)
  }, [])

  const emit = useCallback((event: string, data: any) => {
    wsManager.emit(event, data)
  }, [])

  const isConnected = useCallback(() => {
    return wsManager.isConnected()
  }, [])

  return { subscribe, emit, isConnected }
}
