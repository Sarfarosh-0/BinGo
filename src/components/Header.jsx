import React from 'react'
import { Leaf, BookOpen, Sparkles } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Header({ onOpenGuide }) {
  return (
    <header className="w-full bg-[var(--color-surface)] rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-[var(--color-border)] shadow-xs relative overflow-hidden transition-all">
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-xs border border-[var(--color-border-strong)] shrink-0 bg-[var(--color-surface-sunken)]">
            <img
              src="/logo.png"
              alt="BinGo logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-[var(--color-text)]">
                <span>Bin</span>
                <span className="text-[var(--color-primary)]">Go</span>
              </h1>
              <span className="text-xs text-[var(--color-text-disabled)]" aria-hidden="true">·</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                SDG 15 Life on Land
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] mt-0.5 truncate">
              {STRINGS.app.tagline}
            </p>
          </div>
        </div>

        {/* Quick Waste Guide Trigger */}
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

          {/* Privacy badge */}
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
