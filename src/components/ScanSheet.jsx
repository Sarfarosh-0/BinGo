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
      if (e.key === 'Escape') onClose()
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
      className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[color-mix(in_srgb,var(--color-text)_45%,transparent)] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="view-enter-fast relative z-10 w-full max-w-[420px] rounded-t-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[var(--shadow-lg)] sm:px-6 md:rounded-[var(--radius-xl)] md:pb-6 md:pt-6">
        {/* Drag handle (mobile) */}
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[var(--color-border-strong)] md:hidden" />

        <div className="mb-1 flex items-center justify-between gap-3">
          <h2
            id="scansheet-title"
            className="text-xl font-extrabold tracking-tight text-[var(--color-text)]"
          >
            {STRINGS.scanSheet.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)] active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            aria-label={STRINGS.scanSheet.closeAria}
          >
            <X className="h-5 w-5 shrink-0" />
          </button>
        </div>

        <p className="mb-6 text-sm leading-snug text-[var(--color-text-secondary)]">
          {STRINGS.home.scanSubtitle}
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              onClose()
              onTakePhoto()
            }}
            className="btn btn-primary w-full gap-3 text-base"
          >
            <Camera className="h-5 w-5 shrink-0 text-white" />
            <span>{STRINGS.scanSheet.takePhoto}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              onChooseGallery()
            }}
            className="btn btn-tonal w-full gap-3 text-base"
          >
            <ImageIcon className="h-5 w-5 shrink-0 text-[var(--color-primary-strong)]" />
            <span>{STRINGS.scanSheet.chooseGallery}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScanSheet