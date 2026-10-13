import React, { useEffect } from 'react'
import { Camera, Image as ImageIcon, X } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function ScanSheet({
  isOpen,
  onClose,
  onTakePhoto,
  onChooseGallery,
}) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scansheet-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-[#0E2A1F]/45 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Panel */}
      <div className="relative z-10 w-full max-w-[440px] bg-[var(--color-surface)] rounded-t-[28px] md:rounded-[28px] p-6 shadow-lg border border-[var(--color-border)] animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Handle for mobile */}
        <div className="w-9 h-1 rounded-full bg-[var(--color-border-strong)] mx-auto mb-4 md:hidden" />

        <div className="flex items-center justify-between mb-4">
          <h2
            id="scansheet-title"
            className="text-lg font-bold text-[var(--color-text)] tracking-tight"
          >
            {STRINGS.scanSheet.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-surface-sunken)] active:scale-95 text-[var(--color-text-secondary)] transition-all"
            aria-label="Close sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          {STRINGS.home.scanSubtitle}
        </p>

        <div className="flex flex-col gap-3">
          {/* Primary Take Photo */}
          <button
            type="button"
            onClick={() => {
              onClose()
              onTakePhoto()
            }}
            className="btn btn-primary w-full shadow-sm flex items-center justify-center gap-3 text-base"
          >
            <Camera className="w-5 h-5 text-white" />
            <span>{STRINGS.scanSheet.takePhoto}</span>
          </button>

          {/* Secondary Choose from gallery */}
          <button
            type="button"
            onClick={() => {
              onClose()
              onChooseGallery()
            }}
            className="btn btn-secondary w-full flex items-center justify-center gap-3 text-base"
          >
            <ImageIcon className="w-5 h-5 text-[var(--color-primary-strong)]" />
            <span>{STRINGS.scanSheet.chooseGallery}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScanSheet
