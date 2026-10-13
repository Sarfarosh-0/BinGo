import React from 'react'
import { ArrowLeft, X } from 'lucide-react'

export function TopBar({ title, onBack, onClose }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--color-surface)]/90 backdrop-blur-none border-b border-[var(--color-border)]">
      <div className="w-11 h-11 flex items-center justify-start">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text)]" strokeWidth={2.25} />
          </button>
        )}
        {onClose && !onBack && (
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)]"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[var(--color-text)]" strokeWidth={2.25} />
          </button>
        )}
      </div>

      <h1 className="text-lg font-bold text-[var(--color-text)] tracking-tight text-center truncate max-w-[240px]">
        {title}
      </h1>

      {/* Spacer to keep title centered */}
      <div className="w-11 h-11" aria-hidden="true" />
    </header>
  )
}

export default TopBar
