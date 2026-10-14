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
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)] shadow-xs"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2.5">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--color-primary-strong)] shrink-0" />
          <h1 className="text-base font-bold text-[var(--color-text)] tracking-tight">
            {STRINGS.analyzing.title}
          </h1>
        </div>

        <div className="w-10 h-10" aria-hidden="true" />
      </header>

      {/* Center Viewfinder Scan Frame */}
      <div className="flex-1 my-3 flex items-center justify-center relative min-h-0">
        <div className="scan-frame relative w-full max-w-[360px] h-full max-h-[420px] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-sunken)] flex items-center justify-center shadow-md">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Scan preview"
              className="w-full h-full object-contain"
            />
          )}
          <div className="scan-corner tl" />
          <div className="scan-corner tr" />
          <div className="scan-corner bl" />
          <div className="scan-corner br" />
          <div className="scan-line" />
        </div>
      </div>

      {/* Status Card */}
      <div
        role="status"
        className="card max-w-[360px] mx-auto w-full mb-3 p-4 border border-[var(--color-border)] shadow-sm bg-[var(--color-surface)]"
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
          <div className="h-full rounded-full bg-[var(--color-primary)] w-3/4 animate-pulse" />
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2 leading-relaxed">
          <Sparkles className="w-4 h-4 text-[var(--color-primary-strong)] shrink-0" />
          <span>{STRINGS.analyzing.hintTakesMoment}</span>
        </p>
      </div>
    </div>
  )
}

export default AnalyzingView