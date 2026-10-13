import React from 'react'
import { ArrowLeft, X } from 'lucide-react'

export function TopBar({ title, onBack, onClose }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--forest-900)]/60 backdrop-blur-md border-b border-white/10">
      <div className="w-11 h-11 flex items-center justify-start">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/15"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
        {onClose && !onBack && (
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/15"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </div>

      <h1 className="text-lg font-semibold text-white tracking-wide text-center truncate max-w-[240px]">
        {title}
      </h1>

      {/* Spacer to keep title centered */}
      <div className="w-11 h-11" aria-hidden="true" />
    </header>
  )
}

export default TopBar
