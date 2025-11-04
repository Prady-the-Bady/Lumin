"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useScriptStore } from "@/stores/script-store"
import { api } from "@/services/api"
import { toast } from "sonner"

export function ScriptUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { setCurrentAnalysis, updateProgress } = useScriptStore()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const scriptFile = files.find(
      (file) => file.type === "application/pdf" || file.type === "text/plain" || file.name.endsWith(".fountain"),
    )

    if (scriptFile) {
      setSelectedFile(scriptFile)
    } else {
      toast.error("Please upload a PDF, TXT, or Fountain file")
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }, [])

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await api.uploadScript(selectedFile)
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.success && response.data) {
        const analysis = {
          id: response.data.sessionId,
          filename: selectedFile.name,
          uploadedAt: new Date().toISOString(),
          status: "analyzing" as const,
          progress: 0,
          agents: [],
        }

        setCurrentAnalysis(analysis)
        toast.success("Script uploaded successfully!")

        // Start analysis
        await api.analyzeScript(response.data.sessionId)
      }
    } catch (error) {
      console.error("[v0] Upload failed:", error)
      toast.error("Failed to upload script. Using demo mode.")

      // Demo mode - create mock analysis
      const mockAnalysis = {
        id: "demo-" + Date.now(),
        filename: selectedFile.name,
        uploadedAt: new Date().toISOString(),
        status: "analyzing" as const,
        progress: 0,
        agents: [],
      }
      setCurrentAnalysis(mockAnalysis)
    } finally {
      setIsUploading(false)
      setSelectedFile(null)
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragging ? "border-amber-500 bg-amber-500/10" : "border-zinc-700 hover:border-zinc-600"}
        `}
      >
        <input
          type="file"
          id="script-upload"
          accept=".pdf,.txt,.fountain"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!selectedFile ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Upload className="w-16 h-16 text-zinc-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Drop your script here</h3>
              <p className="text-zinc-400 text-sm">
                or{" "}
                <label htmlFor="script-upload" className="text-amber-500 hover:text-amber-400 cursor-pointer">
                  browse files
                </label>
              </p>
              <p className="text-zinc-500 text-xs mt-2">Supports PDF, TXT, and Fountain formats</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-12 h-12 text-amber-500" />
              <div className="text-left">
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-zinc-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFile(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-zinc-400 text-sm">Uploading... {uploadProgress}%</p>
              </div>
            )}

            {!isUploading && (
              <Button onClick={handleUpload} className="bg-amber-500 hover:bg-amber-600 text-zinc-950">
                Analyze Script
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
