import React, { useState, useCallback } from 'react'
import {
  Recycle,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  UploadCloud,
  CheckCircle2,
  Shield,
  Zap,
} from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Scanner({
  ready = true,
  loadingText = STRINGS.home.loadingModel,
  onGalleryClick,
  onCameraClick,
  onDropFile,
  onSelectSample,
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!ready) return
    setIsDragOver(true)
  }, [ready])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (!ready) return

    const files = e.dataTransfer?.files
    if (files && files.length > 0 && onDropFile) {
      onDropFile(files[0])
    }
  }, [ready, onDropFile])

  return (
    <section
      aria-label="Scan Station"
      className="card card-hero p-5 sm:p-6 flex flex-col items-center text-center border border-[var(--color-border)] shadow-xs relative overflow-hidden transition-all bg-[var(--color-surface)]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 bg-[#0F9D58]/90 text-white flex flex-col items-center justify-center p-6 backdrop-blur-xs animate-in fade-in duration-150">
          <UploadCloud className="w-16 h-16 animate-bounce mb-3 text-white" />
          <h3 className="text-xl font-black tracking-tight">Drop your waste photo here</h3>
          <p className="text-xs text-white/90 mt-1">Our on-device AI will identify the material instantly</p>
        </div>
      )}

      {/* Interactive Viewfinder Aperture */}
      <div
        className="relative w-44 h-44 sm:w-48 sm:h-48 my-1 flex items-center justify-center rounded-3xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] cursor-pointer group transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-md"
        onClick={ready && onCameraClick ? onCameraClick : undefined}
        role={onCameraClick ? 'button' : undefined}
        tabIndex={onCameraClick ? 0 : undefined}
        aria-label="Activate camera to scan waste"
      >
        {/* Viewfinder reticle brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[var(--color-primary)]/50 rounded-tl-xs group-hover:border-[var(--color-primary)] transition-colors" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[var(--color-primary)]/50 rounded-tr-xs group-hover:border-[var(--color-primary)] transition-colors" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[var(--color-primary)]/50 rounded-bl-xs group-hover:border-[var(--color-primary)] transition-colors" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[var(--color-primary)]/50 rounded-br-xs group-hover:border-[var(--color-primary)] transition-colors" />

        {/* Center lens emblem */}
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-[var(--color-border)] group-hover:scale-105 group-hover:shadow-sm transition-all duration-200">
          <Recycle
            className="w-10 h-10 sm:w-11 sm:h-11 text-[var(--color-primary-strong)] group-hover:rotate-12 transition-transform duration-300"
            strokeWidth={1.8}
          />
        </div>

        {/* Sub-label inside viewfinder */}
        <div className="absolute bottom-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-strong)] transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
          <span>Tap or drag photo</span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="mt-3">
        <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text)] tracking-tight">
          {STRINGS.home.scanTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-[340px] leading-relaxed mx-auto">
          {STRINGS.home.scanSubtitle}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-4">
        <button
          type="button"
          onClick={onCameraClick}
          disabled={!ready}
          className="btn btn-primary flex-1 shadow-xs flex items-center justify-center gap-2.5 text-sm font-bold active:scale-[0.98] transition-all"
        >
          <Camera className="w-4 h-4 text-white" />
          <span>{STRINGS.home.btnCamera}</span>
        </button>

        <button
          type="button"
          onClick={onGalleryClick}
          disabled={!ready}
          className="btn btn-tonal flex-1 flex items-center justify-center gap-2.5 text-sm font-bold active:scale-[0.98] transition-all"
        >
          <ImageIcon className="w-4 h-4 text-[var(--color-primary-strong)]" />
          <span>{STRINGS.home.btnGallery}</span>
        </button>
      </div>

      {/* Interactive Quick-Try Sample Items */}
      {onSelectSample && (
        <div className="w-full mt-4 pt-3.5 border-t border-[var(--color-divider)]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-extrabold uppercase tracking-wider text-[var(--color-text-muted)] text-[10px]">
              No photo nearby? Try an instant sample
            </span>
            <span className="text-[10px] font-semibold text-[var(--color-primary-strong)] flex items-center gap-0.5">
              <Zap className="w-3 h-3" />
              1-Click Test
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSelectSample('bottle')}
              disabled={!ready}
              className="py-2 px-2.5 rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] hover:border-[#1565C0] active:scale-95 text-xs font-semibold text-[var(--color-text)] transition-all flex flex-col items-center gap-1 group"
              title="Test classification with a plastic water bottle"
            >
              <span className="text-base">🥤</span>
              <span className="text-[11px] group-hover:text-[#1565C0] truncate w-full text-center">
                Water Bottle
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectSample('organic')}
              disabled={!ready}
              className="py-2 px-2.5 rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] hover:border-[#2E7D32] active:scale-95 text-xs font-semibold text-[var(--color-text)] transition-all flex flex-col items-center gap-1 group"
              title="Test classification with banana peel scraps"
            >
              <span className="text-base">🍌</span>
              <span className="text-[11px] group-hover:text-[#2E7D32] truncate w-full text-center">
                Banana Peel
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectSample('battery')}
              disabled={!ready}
              className="py-2 px-2.5 rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] hover:border-[#C62828] active:scale-95 text-xs font-semibold text-[var(--color-text)] transition-all flex flex-col items-center gap-1 group"
              title="Test classification with a household battery"
            >
              <span className="text-base">🔋</span>
              <span className="text-[11px] group-hover:text-[#C62828] truncate w-full text-center">
                AA Battery
              </span>
            </button>
          </div>
        </div>
      )}

      {/* On-Device Security & Speed Assurance */}
      <div className="w-full mt-3.5 flex items-center justify-center gap-4 text-[11px] text-[var(--color-text-muted)] font-medium">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-[var(--color-primary-strong)]" />
          <span>100% Private</span>
        </span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-[var(--color-primary-strong)]" />
          <span>Zero Server Lag</span>
        </span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[var(--color-primary-strong)]" />
          <span>SDG 15 Verified</span>
        </span>
      </div>

      {/* Model Loading State */}
      {!ready && (
        <div className="inline-flex items-center gap-2 mt-3.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)] text-xs font-semibold text-[var(--color-primary-strong)] animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{loadingText}</span>
        </div>
      )}
    </section>
  )
}

export default Scanner
