import React from 'react'
import { BookOpen, Sparkles } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Header({ onOpenGuide }) {
  return (
    <header className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-[var(--color-border)] shadow-[0_2px_16px_rgba(15,157,88,0.05)] relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between gap-3.5 sm:gap-4 min-w-0">
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-[0_3px_10px_rgba(15,157,88,0.22)] border border-[var(--color-border)] shrink-0">
            <img
              src="/logo.png"
              alt="BinGo recycling leaf logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                <span className="text-[var(--color-text)]">Bin</span>
                <span className="text-[var(--color-primary-strong)]">Go</span>
              </h1>
              <span className="hidden xs:flex items-center h-4 w-px bg-[var(--color-border-strong)]" aria-hidden="true" />
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)] shrink-0">
                Life on Land
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mt-0.5 tracking-normal leading-snug">
              {STRINGS.app.tagline}
            </p>
          </div>
        </div>

        {/* Action / Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface-sunken)] border border-[var(--color-primary-soft)] text-[var(--color-primary-strong)] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
              title="Explore sorting rules for all 5 bins"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sorting Guide</span>
              <span className="xs:hidden">Guide</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-[var(--color-primary-strong)]" />
            <span>On-Device AI</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header