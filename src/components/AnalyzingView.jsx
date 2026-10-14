import React from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function AnalyzingView({ previewUrl, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image analysis in progress"
      className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Bar with Cancel */}
      <header className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel analysis"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-sunken)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)] shadow-xs"
        >
          <X className="w-5 h-5 text-[var(--color-text)]" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary-strong)]" />
          <h1 className="text-base font-bold text-[var(--color-text)] tracking-tight">
            {STRINGS.analyzing.title}
          </h1>
        </div>

        <div className="w-10 h-10" aria-hidden="true" />
      </header>

      {/* Center Viewfinder Scan Frame */}
      <div className="flex-1 my-4 flex items-center justify-center relative min-h-0">
        <div className="scan-frame relative w-full max-w-[340px] sm:max-w-[380px] h-full max-h-[440px] rounded-3xl overflow-hidden border border-[var(--color-border-strong)] bg-black/5 flex items-center justify-center shadow-lg">
          {/* Captured photo preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Scan preview"
              className="w-full h-full object-contain"
            />
          )}

          {/* Viewfinder Corner Brackets */}
          <div className="scan-corner tl border-[var(--color-primary)]" />
          <div className="scan-corner tr border-[var(--color-primary)]" />
          <div className="scan-corner bl border-[var(--color-primary)]" />
          <div className="scan-corner br border-[var(--color-primary)]" />

          {/* Laser scanning bar */}
          <div className="scan-line" />
        </div>
      </div>

      {/* Status Card */}
      <div
        role="status"
        className="card max-w-[340px] sm:max-w-[380px] mx-auto w-full mb-3 p-4 border border-[var(--color-border)] shadow-sm bg-[var(--color-surface)]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[var(--color-text)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-ping" />
            <span>{STRINGS.analyzing.status}</span>
          </span>
          <span className="text-[11px] font-semibold text-[var(--color-primary-strong)]">
            TensorFlow.js
          </span>
        </div>

        {/* Shimmer Progress Indicator */}
        <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-sunken)] overflow-hidden mb-3">
          <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[#34A853] to-[var(--color-primary)] w-3/4 animate-pulse" />
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary-strong)] shrink-0" />
          <span>{STRINGS.analyzing.hintTakesMoment}</span>
        </p>
      </div>
    </div>
  )
}

export default AnalyzingView
