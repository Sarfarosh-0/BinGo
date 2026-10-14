import React from 'react'
import { ArrowLeft, X } from 'lucide-react'

export function TopBar({ title, onBack, onClose }) {
  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 h-14 bg-[var(--color-surface-glass,rgba(255,255,255,0.9))] backdrop-blur-md border-b border-[var(--color-border)] shrink-0">
      <div className="w-11 h-11 flex items-center justify-start">
=======
    <header className="sticky top-0 z-30 flex items-center justify-between px-2 sm:px-4 py-2.5 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] rounded-2xl mb-2">
      <div className="w-10 h-10 flex items-center justify-start">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
        {onBack && (
          <button
            type="button"
            onClick={onBack}
<<<<<<< HEAD
            className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.25} />
=======
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)] shadow-xs"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--color-text)]" strokeWidth={2} />
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
          </button>
        )}
        {onClose && !onBack && (
          <button
            type="button"
            onClick={onClose}
<<<<<<< HEAD
            className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2.25} />
=======
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-surface-sunken)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)] shadow-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[var(--color-text)]" strokeWidth={2} />
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
          </button>
        )}
      </div>

<<<<<<< HEAD
      <h1 className="text-[15px] font-bold text-[var(--color-text)] tracking-tight text-center truncate px-2">
        {title}
      </h1>

      <div className="w-11 h-11" aria-hidden="true" />
=======
      <h1 className="text-base font-extrabold text-[var(--color-text)] tracking-tight text-center truncate max-w-[240px]">
        {title}
      </h1>

      {/* Spacer to keep title centered */}
      <div className="w-10 h-10" aria-hidden="true" />
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
    </header>
  )
}

export default TopBar