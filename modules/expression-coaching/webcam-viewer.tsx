"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, SwitchCamera } from "lucide-react"
import { useCamera } from "@/hooks/use-camera"
import { useCoachingStore } from "@/stores/coaching-store"
import { api } from "@/services/api"

export function WebcamViewer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const referenceCanvasRef = useRef<HTMLCanvasElement>(null)
  const { isActive, error, devices, startCamera, stopCamera, captureFrame, switchCamera } = useCamera()
  const { currentSession, updateLandmarks, updateMetrics, referenceImage, showReference, referenceOpacity } =
    useCoachingStore()
  const [frameCount, setFrameCount] = useState(0)
  const [backendFailures, setBackendFailures] = useState(0)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Auto-start camera when component mounts
  useEffect(() => {
    if (videoRef.current && !isActive) {
      startCamera(videoRef.current).catch((err) => {
        console.error("[v0] Failed to start camera:", err)
      })
    }

    return () => {
      stopCamera()
    }
  }, [])

  // Frame capture and analysis
  useEffect(() => {
    if (!isActive || !videoRef.current || !currentSession) return

    const interval = setInterval(async () => {
      if (!videoRef.current) return

      const frameData = captureFrame(videoRef.current)
      if (!frameData) return

      setFrameCount((prev) => prev + 1)

      // Try to send frame to backend
      if (!isDemoMode) {
        try {
          await api.submitFrame(currentSession.id, frameData)
          setBackendFailures(0)
        } catch (error) {
          setBackendFailures((prev) => prev + 1)

          // Switch to demo mode after 3 failures
          if (backendFailures >= 2) {
            setIsDemoMode(true)
            console.log("[v0] Switching to demo mode")
          }
        }
      }

      // Generate mock analysis in demo mode
      if (isDemoMode) {
        generateMockAnalysis()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, currentSession, captureFrame, isDemoMode, backendFailures])

  // Draw AR overlays
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !currentSession) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawOverlays = () => {
      if (!video.videoWidth || !video.videoHeight) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw facial landmarks
      if (currentSession.facialLandmarks.length > 0) {
        currentSession.facialLandmarks.forEach((landmark) => {
          ctx.beginPath()
          ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 3, 0, 2 * Math.PI)
          ctx.fillStyle = "rgba(251, 191, 36, 0.8)"
          ctx.fill()
          ctx.strokeStyle = "rgba(251, 191, 36, 1)"
          ctx.lineWidth = 1
          ctx.stroke()
        })

        // Connect landmarks with lines
        ctx.strokeStyle = "rgba(251, 191, 36, 0.3)"
        ctx.lineWidth = 1
        for (let i = 0; i < currentSession.facialLandmarks.length - 1; i++) {
          const p1 = currentSession.facialLandmarks[i]
          const p2 = currentSession.facialLandmarks[i + 1]
          ctx.beginPath()
          ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height)
          ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height)
          ctx.stroke()
        }
      }

      requestAnimationFrame(drawOverlays)
    }

    drawOverlays()
  }, [currentSession])

  useEffect(() => {
    if (!referenceCanvasRef.current || !videoRef.current || !referenceImage || !showReference) {
      if (referenceCanvasRef.current) {
        const ctx = referenceCanvasRef.current.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, referenceCanvasRef.current.width, referenceCanvasRef.current.height)
        }
      }
      return
    }

    const canvas = referenceCanvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = referenceImage

    const drawReference = () => {
      if (!video.videoWidth || !video.videoHeight) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = referenceOpacity

      // Draw reference image in top-right corner
      const refWidth = canvas.width * 0.3
      const refHeight = canvas.height * 0.3
      const x = canvas.width - refWidth - 20
      const y = 20

      // Draw semi-transparent background
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(x - 5, y - 5, refWidth + 10, refHeight + 10)

      // Draw reference image
      ctx.drawImage(img, x, y, refWidth, refHeight)

      // Draw border
      ctx.strokeStyle = "rgba(251, 191, 36, 0.8)"
      ctx.lineWidth = 2
      ctx.strokeRect(x - 5, y - 5, refWidth + 10, refHeight + 10)

      ctx.globalAlpha = 1
    }

    img.onload = drawReference

    const interval = setInterval(drawReference, 100)
    return () => clearInterval(interval)
  }, [referenceImage, showReference, referenceOpacity])

  const generateMockAnalysis = () => {
    // Generate mock facial landmarks
    const mockLandmarks = Array.from({ length: 68 }, (_, i) => ({
      x: 0.3 + Math.random() * 0.4,
      y: 0.2 + Math.random() * 0.6,
      z: Math.random() * 0.1,
      label: `point_${i}`,
    }))

    updateLandmarks(mockLandmarks)

    // Generate mock metrics
    const mockMetrics = {
      emotionalIntensity: 60 + Math.random() * 30,
      facialSymmetry: 70 + Math.random() * 25,
      eyeContact: 65 + Math.random() * 30,
      microExpressions: 55 + Math.random() * 35,
      overallScore: 65 + Math.random() * 25,
    }

    updateMetrics(mockMetrics)
  }

  const handleToggleCamera = async () => {
    if (isActive) {
      stopCamera()
    } else if (videoRef.current) {
      try {
        await startCamera(videoRef.current)
      } catch (err) {
        console.error("[v0] Failed to start camera:", err)
      }
    }
  }

  return (
    <div className="relative">
      <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <canvas ref={referenceCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Camera controls overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <Button
            onClick={handleToggleCamera}
            size="icon"
            className="bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm"
          >
            {isActive ? <CameraOff className="w-5 h-5 text-white" /> : <Camera className="w-5 h-5 text-white" />}
          </Button>

          {devices.length > 1 && isActive && (
            <Button onClick={switchCamera} size="icon" className="bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-sm">
              <SwitchCamera className="w-5 h-5 text-white" />
            </Button>
          )}
        </div>

        {/* Status indicators */}
        {isActive && (
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <div className="bg-red-500 rounded-full w-3 h-3 animate-pulse" />
            <div className="bg-zinc-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
              Frame {frameCount}
            </div>
            {isDemoMode && (
              <div className="bg-amber-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-zinc-950 font-medium">
                Demo Mode
              </div>
            )}
          </div>
        )}

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm">
            <div className="text-center">
              <Camera className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">Camera Inactive</p>
              <p className="text-zinc-500 text-sm mt-2">Click the camera button to start</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/90 backdrop-blur-sm">
            <div className="text-center max-w-md px-6">
              <p className="text-red-400 mb-2">Camera Error</p>
              <p className="text-zinc-400 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Scene text display */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4"
        >
          <h4 className="text-white font-medium mb-2">Scene</h4>
          <p className="text-zinc-400 text-sm leading-relaxed">{currentSession.sceneText}</p>
        </motion.div>
      )}
    </div>
  )
}
