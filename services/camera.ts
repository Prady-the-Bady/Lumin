// Camera service for webcam access and frame capture

export class CameraManager {
  private stream: MediaStream | null = null
  private videoElement: HTMLVideoElement | null = null
  private devices: MediaDeviceInfo[] = []
  private currentDeviceId: string | null = null

  async getDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      this.devices = devices.filter((device) => device.kind === "videoinput")
      return this.devices
    } catch (error) {
      console.error("[v0] Failed to enumerate devices:", error)
      throw new Error("Failed to access camera devices")
    }
  }

  async startCamera(videoElement: HTMLVideoElement, deviceId?: string): Promise<MediaStream> {
    try {
      // Stop existing stream if any
      this.stopCamera()

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.videoElement = videoElement
      this.currentDeviceId = deviceId || null

      videoElement.srcObject = this.stream
      await videoElement.play()

      console.log("[v0] Camera started successfully")
      return this.stream
    } catch (error: any) {
      console.error("[v0] Failed to start camera:", error)

      if (error.name === "NotAllowedError") {
        throw new Error("Camera access denied. Please allow camera permissions.")
      } else if (error.name === "NotFoundError") {
        throw new Error("No camera found on this device.")
      } else if (error.name === "NotReadableError") {
        throw new Error("Camera is already in use by another application.")
      } else {
        throw new Error("Failed to access camera: " + error.message)
      }
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null
      this.videoElement = null
    }

    console.log("[v0] Camera stopped")
  }

  captureFrame(videoElement: HTMLVideoElement): string | null {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      ctx.drawImage(videoElement, 0, 0)
      return canvas.toDataURL("image/jpeg", 0.8)
    } catch (error) {
      console.error("[v0] Failed to capture frame:", error)
      return null
    }
  }

  async switchCamera(): Promise<MediaStream | null> {
    if (this.devices.length <= 1 || !this.videoElement) {
      return null
    }

    const currentIndex = this.devices.findIndex((device) => device.deviceId === this.currentDeviceId)
    const nextIndex = (currentIndex + 1) % this.devices.length
    const nextDevice = this.devices[nextIndex]

    return this.startCamera(this.videoElement, nextDevice.deviceId)
  }

  getStream(): MediaStream | null {
    return this.stream
  }

  isActive(): boolean {
    return this.stream !== null && this.stream.active
  }
}

export const cameraManager = new CameraManager()
