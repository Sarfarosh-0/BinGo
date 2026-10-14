import React, { useRef, useState, useEffect, useCallback } from 'react'
import { X, Camera, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react'

export function CameraModal({ isOpen, onClose, onCapture, onFallbackFilePicker }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [cameraError, setCameraError] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const startStream = useCallback(async (mode = facingMode) => {
    stopStream()
    setCameraError(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported by your browser.')
      return
    }

    try {
      const constraints = {
        audio: false,
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.warn('Camera stream error:', err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access or upload a photo.')
      } else {
        setCameraError('Unable to access camera. Please choose an image from your device.')
      }
    }
  }, [facingMode, stopStream])

  useEffect(() => {
    if (isOpen) {
      startStream(facingMode)
    } else {
      stopStream()
    }
    return () => {
      stopStream()
    }
  }, [isOpen, facingMode, startStream, stopStream])

  const handleCapture = useCallback(() => {
    const video = videoRef.current
    if (!video || !isStreaming) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' })
      stopStream()
      onCapture(file)
    }, 'image/jpeg', 0.9)
  }, [isStreaming, onCapture, stopStream])

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
  }, [])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live Camera Scanner"
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden animate-in fade-in duration-150"
    >
      {/* Top Controls */}
      <header className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={() => {
            stopStream()
            onClose()
          }}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          Live AI Scanner
        </span>

        <button
          type="button"
          onClick={toggleCamera}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all"
          aria-label="Flip camera"
          title="Switch camera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      {/* Camera Viewport Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
        {cameraError ? (
          <div className="p-6 max-w-sm text-center text-white flex flex-col items-center gap-3">
            <AlertCircle className="w-12 h-12 text-amber-400" />
            <h3 className="text-lg font-bold">Camera Unavailable</h3>
            <p className="text-xs text-white/80 leading-relaxed">{cameraError}</p>
            {onFallbackFilePicker && (
              <button
                type="button"
                onClick={() => {
                  stopStream()
                  onClose()
                  onFallbackFilePicker()
                }}
                className="btn btn-primary mt-3 flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl"
              >
                <ImageIcon className="w-4 h-4 text-white" />
                <span>Upload From Device</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Viewfinder Overlay Frame */}
            <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-white/40 pointer-events-none flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
              {/* Reticles */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t-3 border-l-3 border-[#0F9D58] rounded-tl-sm" />
              <div className="absolute top-2 right-2 w-5 h-5 border-t-3 border-r-3 border-[#0F9D58] rounded-tr-sm" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b-3 border-l-3 border-[#0F9D58] rounded-bl-sm" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b-3 border-r-3 border-[#0F9D58] rounded-br-sm" />

              <span className="text-[11px] font-bold text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                Center item in box
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Shutter Action Bar */}
      <footer className="relative z-20 flex items-center justify-around p-6 bg-gradient-to-t from-black/90 to-transparent">
        {onFallbackFilePicker ? (
          <button
            type="button"
            onClick={() => {
              stopStream()
              onClose()
              onFallbackFilePicker()
            }}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all"
            title="Upload from gallery"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-12 h-12" />
        )}

        {/* Shutter Button */}
        <button
          type="button"
          onClick={handleCapture}
          disabled={!isStreaming}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform shadow-lg disabled:opacity-40"
          aria-label="Capture waste photo"
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Camera className="w-7 h-7 text-[#0F9D58]" />
          </div>
        </button>

        <div className="w-12 h-12" />
      </footer>
    </div>
  )
}

export default CameraModal
