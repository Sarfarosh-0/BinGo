import React from 'react'
import { ArrowLeft, X } from 'lucide-react'

export function TopBar({ title, onBack, onClose }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 h-14 bg-[var(--color-surface-glass,rgba(255,255,255,0.9))] backdrop-blur-md border-b border-[var(--color-border)] shrink-0">
      <div className="w-11 h-11 flex items-center justify-start">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.25} />
          </button>
        )}
        {onClose && !onBack && (
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2.25} />
          </button>
        )}
      </div>

      <h1 className="text-[15px] font-bold text-[var(--color-text)] tracking-tight text-center truncate px-2">
        {title}
      </h1>

      <div className="w-11 h-11" aria-hidden="true" />
    </header>
  )
}

export default TopBar