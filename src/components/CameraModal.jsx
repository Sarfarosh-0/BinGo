import React, { useRef, useState, useEffect, useCallback } from 'react'
import { X, Camera, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { STRINGS } from '../lib/strings'
import { useModalA11y } from '../hooks/useModalA11y'

export function CameraModal({ isOpen, onClose, onCapture, onFallbackFilePicker }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const dialogRef = useRef(null)
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

  const handleClose = useCallback(() => {
    stopStream()
    onClose()
  }, [stopStream, onClose])

  // Focus management + Escape handled centrally (video keeps the dialog focusable).
  useModalA11y({ isOpen, onClose: handleClose, containerRef: dialogRef })

  const startStream = useCallback(async (mode = facingMode) => {
    stopStream()
    setCameraError(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(STRINGS.camera.errUnsupported)
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
        setCameraError(STRINGS.camera.errDenied)
      } else {
        setCameraError(STRINGS.camera.errGeneric)
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

  const glassBtn =
    'flex items-center justify-center rounded-full border border-white/15 bg-white/15 text-white backdrop-blur-md transition-all duration-150 hover:bg-white/25 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={STRINGS.camera.dialogAria}
      className="view-enter-fast fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black"
    >
      {/* Top Controls */}
      <header className="relative z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={handleClose}
          className={`h-11 w-11 ${glassBtn}`}
          aria-label={STRINGS.camera.closeAria}
        >
          <X className="h-5 w-5" />
        </button>

        <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
          {STRINGS.camera.liveScanner}
        </span>

        <button
          type="button"
          onClick={toggleCamera}
          className={`h-11 w-11 ${glassBtn}`}
          aria-label={STRINGS.camera.flipAria}
          title={STRINGS.camera.switchTitle}
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </header>

      {/* Camera Viewport */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
        {cameraError ? (
          <div className="flex max-w-sm flex-col items-center gap-3 p-6 text-center text-white">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/15 ring-1 ring-amber-400/30">
              <AlertCircle className="h-10 w-10 text-amber-400" />
            </div>
            <h3 className="mt-1 text-lg font-bold">{STRINGS.camera.unavailableTitle}</h3>
            <p className="text-sm leading-relaxed text-white/80">{cameraError}</p>
            {onFallbackFilePicker && (
              <button
                type="button"
                onClick={() => {
                  stopStream()
                  onClose()
                  onFallbackFilePicker()
                }}
                className="btn btn-primary mt-3 h-12 gap-2 px-5 text-sm"
              >
                <ImageIcon className="h-4 w-4 text-white" />
                <span>{STRINGS.camera.uploadDevice}</span>
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
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Viewfinder Frame */}
            <div className="pointer-events-none relative z-10 flex h-64 w-64 items-center justify-center rounded-[var(--radius-xl)] border-2 border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] sm:h-72 sm:w-72">
              <div className="absolute left-2.5 top-2.5 h-6 w-6 rounded-tl-md border-l-[3px] border-t-[3px] border-[var(--color-primary)]" />
              <div className="absolute right-2.5 top-2.5 h-6 w-6 rounded-tr-md border-r-[3px] border-t-[3px] border-[var(--color-primary)]" />
              <div className="absolute bottom-2.5 left-2.5 h-6 w-6 rounded-bl-md border-b-[3px] border-l-[3px] border-[var(--color-primary)]" />
              <div className="absolute bottom-2.5 right-2.5 h-6 w-6 rounded-br-md border-b-[3px] border-r-[3px] border-[var(--color-primary)]" />

              <span className="rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white/95 backdrop-blur-sm">
                {STRINGS.camera.centerItem}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Shutter Bar */}
      <footer className="relative z-20 flex items-center justify-around bg-gradient-to-t from-black/90 to-transparent px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8">
        {onFallbackFilePicker ? (
          <button
            type="button"
            onClick={() => {
              stopStream()
              onClose()
              onFallbackFilePicker()
            }}
            className={`h-12 w-12 ${glassBtn}`}
            title={STRINGS.camera.uploadGallery}
            aria-label={STRINGS.camera.uploadGallery}
          >
            <ImageIcon className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-12 w-12" />
        )}

        {/* Shutter */}
        <button
          type="button"
          onClick={handleCapture}
          disabled={!isStreaming}
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white shadow-[var(--shadow-lg)] transition-transform duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label={STRINGS.camera.captureAria}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
            <Camera className="h-7 w-7 text-[var(--color-primary-strong)]" />
          </div>
        </button>

        <div className="h-12 w-12" />
      </footer>
    </div>
  )
}

export default CameraModal