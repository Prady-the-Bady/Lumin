"use client"

// Custom hook for camera integration

import { useState, useCallback, useRef } from "react"
import { cameraManager } from "@/services/camera"

export function useCamera() {
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      setError(null)
      videoRef.current = videoElement
      await cameraManager.startCamera(videoElement)
      setIsActive(true)

      const availableDevices = await cameraManager.getDevices()
      setDevices(availableDevices)
    } catch (err: any) {
      setError(err.message)
      setIsActive(false)
      throw err
    }
  }, [])

  const stopCamera = useCallback(() => {
    cameraManager.stopCamera()
    setIsActive(false)
    videoRef.current = null
  }, [])

  const captureFrame = useCallback((videoElement: HTMLVideoElement): string | null => {
    return cameraManager.captureFrame(videoElement)
  }, [])

  const switchCamera = useCallback(async () => {
    try {
      await cameraManager.switchCamera()
    } catch (err: any) {
      setError(err.message)
    }
  }, [])

  return {
    isActive,
    error,
    devices,
    startCamera,
    stopCamera,
    captureFrame,
    switchCamera,
  }
}
