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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
    >
<<<<<<< HEAD
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0E2A1F]/40 backdrop-blur-[2px] transition-opacity"
=======
      {/* Dimmed backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-[#0E2A1F]/50 backdrop-blur-xs transition-opacity duration-200"
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
        onClick={onClose}
        aria-hidden="true"
      />

<<<<<<< HEAD
      {/* Sheet */}
      <div className="relative z-10 w-full max-w-[420px] bg-[var(--color-surface)] rounded-t-3xl md:rounded-2xl p-6 shadow-[var(--shadow-lg)] border border-[var(--color-border)] animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Drag handle (mobile) */}
        <div className="w-8 h-1 rounded-full bg-[var(--color-border-strong)] mx-auto mb-5 md:hidden" />

        <div className="flex items-center justify-between mb-1">
=======
      {/* Sheet Panel */}
      <div className="relative z-10 w-full max-w-[440px] bg-[var(--color-surface)] rounded-t-3xl md:rounded-3xl p-6 shadow-xl border border-[var(--color-border)] animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Drag handle for mobile */}
        <div className="w-10 h-1 rounded-full bg-[var(--color-border-strong)] mx-auto mb-4 md:hidden" />

        <div className="flex items-center justify-between mb-2">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
          <h2
            id="scansheet-title"
            className="text-lg font-extrabold text-[var(--color-text)] tracking-tight"
          >
            {STRINGS.scanSheet.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
<<<<<<< HEAD
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-surface-sunken)] active:scale-90 text-[var(--color-text-secondary)] transition-all"
            aria-label="Close sheet"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] mb-5 leading-snug">
=======
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--color-surface-sunken)] active:scale-95 text-[var(--color-text-secondary)] transition-all"
            aria-label="Close sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] mb-6">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
          {STRINGS.home.scanSubtitle}
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => { onClose(); onTakePhoto() }}
            className="btn btn-primary w-full flex items-center justify-center gap-3 text-base"
          >
            <Camera className="w-5 h-5" />
=======
            onClick={() => {
              onClose()
              onTakePhoto()
            }}
            className="btn btn-primary w-full shadow-xs flex items-center justify-center gap-3 text-sm font-bold active:scale-[0.98] transition-all"
          >
            <Camera className="w-4 h-4 text-white" />
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
            <span>{STRINGS.scanSheet.takePhoto}</span>
          </button>

          <button
            type="button"
<<<<<<< HEAD
            onClick={() => { onClose(); onChooseGallery() }}
            className="btn btn-secondary w-full flex items-center justify-center gap-3 text-base"
          >
            <ImageIcon className="w-5 h-5" />
=======
            onClick={() => {
              onClose()
              onChooseGallery()
            }}
            className="btn btn-tonal w-full flex items-center justify-center gap-3 text-sm font-bold active:scale-[0.98] transition-all"
          >
            <ImageIcon className="w-4 h-4 text-[var(--color-primary-strong)]" />
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
            <span>{STRINGS.scanSheet.chooseGallery}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScanSheet