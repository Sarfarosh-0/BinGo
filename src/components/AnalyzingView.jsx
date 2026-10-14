import React from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function AnalyzingView({ previewUrl, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image analysis in progress"
      className="view-enter-fast fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[var(--color-bg)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
    >
      {/* Top Bar */}
      <header className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel analysis"
          className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-xs)] transition-all duration-150 hover:bg-[var(--color-surface-alt)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2.5">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[var(--color-primary-strong)]" />
          <h1 className="text-base font-bold tracking-tight text-[var(--color-text)]">
            {STRINGS.analyzing.title}
          </h1>
        </div>

        <div className="h-11 w-11" aria-hidden="true" />
      </header>

      {/* Scan Frame */}
      <div className="relative my-4 flex min-h-0 flex-1 items-center justify-center">
        <div className="scan-frame relative flex h-full max-h-[420px] w-full max-w-[360px] items-center justify-center border border-[var(--color-border)] shadow-[var(--shadow-md)]">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Scan preview"
              className="h-full w-full object-contain"
            />
          )}
          <div className="scan-corner tl drop-shadow-[0_1px_3px_rgba(14,42,31,0.5)]" />
          <div className="scan-corner tr drop-shadow-[0_1px_3px_rgba(14,42,31,0.5)]" />
          <div className="scan-corner bl drop-shadow-[0_1px_3px_rgba(14,42,31,0.5)]" />
          <div className="scan-corner br drop-shadow-[0_1px_3px_rgba(14,42,31,0.5)]" />
          <div className="scan-line" />
        </div>
      </div>

      {/* Status Card */}
      <div
        role="status"
        className="card mx-auto mb-2 w-full max-w-[360px] p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2.5 text-sm font-bold text-[var(--color-text)]">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
            </span>
            <span>{STRINGS.analyzing.status}</span>
          </span>
          <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary-strong)]">
            TensorFlow.js
          </span>
        </div>

        {/* Shimmer progress */}
        <div className="mb-3.5 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-sunken)]">
          <div className="h-full w-3/4 rounded-full bg-[linear-gradient(90deg,var(--color-primary-strong),var(--color-primary),var(--color-primary-strong))] bg-[length:200%_100%] motion-safe:[animation:shimmer_1.8s_linear_infinite]" />
        </div>

        <p className="flex items-center gap-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          <Sparkles className="h-4 w-4 shrink-0 text-[var(--color-primary-strong)]" />
          <span>{STRINGS.analyzing.hintTakesMoment}</span>
        </p>
      </div>
    </div>
  )
}

export default AnalyzingView