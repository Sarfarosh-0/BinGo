import React from 'react'
import { X, Lightbulb } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function AnalyzingView({ previewUrl, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image analysis in progress"
      className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col justify-between p-4 overflow-hidden"
    >
      {/* Top Bar with Cancel X */}
      <header className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel analysis"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)] shadow-sm"
        >
          <X className="w-5 h-5 text-[var(--color-text)]" strokeWidth={2.25} />
        </button>

        <h1 className="text-lg font-bold text-[var(--color-text)] tracking-tight">
          {STRINGS.analyzing.title}
        </h1>

        <div className="w-11 h-11" aria-hidden="true" />
      </header>

      {/* Center Viewfinder Scan Frame (max 420 px tall) */}
      <div className="flex-1 my-3 flex items-center justify-center relative min-h-0">
        <div className="scan-frame relative w-full max-w-[360px] h-full max-h-[420px] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-sunken)] flex items-center justify-center shadow-md">
          {/* Captured photo preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Scan preview"
              className="w-full h-full object-contain"
            />
          )}

          {/* Corner brackets */}
          <div className="scan-corner tl" />
          <div className="scan-corner tr" />
          <div className="scan-corner bl" />
          <div className="scan-corner br" />

          {/* Sweeping laser line */}
          <div className="scan-line" />
        </div>
      </div>

      {/* Status & Hints Card */}
      <div
        role="status"
        className="card max-w-[360px] mx-auto w-full mb-2 p-4 border border-[var(--color-border)] shadow-sm"
      >
        <h2 className="text-sm font-bold text-[var(--color-text)] mb-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary-strong)] animate-pulse" />
          <span>{STRINGS.analyzing.status}</span>
        </h2>

        <div className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[var(--color-primary-strong)] shrink-0" />
            <span>{STRINGS.analyzing.hintOneItem}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[var(--color-primary-strong)] shrink-0" />
            <span>{STRINGS.analyzing.hintTakesMoment}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyzingView
