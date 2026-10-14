import React from 'react'
import { ArrowLeft, X } from 'lucide-react'

export function TopBar({ title, onBack, onClose }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-2 sm:px-4 py-2.5 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] rounded-2xl mb-2">
      <div className="w-10 h-10 flex items-center justify-start">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)] shadow-xs"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--color-text)]" strokeWidth={2} />
          </button>
        )}
        {onClose && !onBack && (
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)] shadow-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[var(--color-text)]" strokeWidth={2} />
          </button>
        )}
      </div>

      <h1 className="text-base font-extrabold text-[var(--color-text)] tracking-tight text-center truncate max-w-[240px]">
        {title}
      </h1>

      {/* Spacer to keep title centered */}
      <div className="w-10 h-10" aria-hidden="true" />
    </header>
  )
}

export default TopBar
