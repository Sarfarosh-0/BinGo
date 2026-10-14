import React from 'react'
import { BookOpen, Sparkles } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Header({ onOpenGuide }) {
  return (
    <header className="relative w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
      {/* Soft brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-20 h-44 w-44 rounded-full bg-[var(--color-primary-soft)] opacity-80 blur-2xl"
      />

      <div className="relative z-10 flex min-w-0 items-center justify-between gap-3 sm:gap-4">
        {/* Logo & Title */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] sm:h-12 sm:w-12">
            <img
              src="/logo.png"
              alt="BinGo recycling leaf logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h1 className="text-2xl font-black leading-none tracking-tight sm:text-3xl">
                <span className="text-[var(--color-text)]">Bin</span>
                <span className="text-[var(--color-primary-strong)]">Go</span>
              </h1>
              <span className="hidden h-4 w-px bg-[var(--color-border-strong)] sm:block" aria-hidden="true" />
              <span className="shrink-0 text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                Life on Land
              </span>
            </div>
            <p className="mt-1 truncate text-xs font-medium leading-snug text-[var(--color-text-secondary)] sm:text-sm">
              {STRINGS.app.tagline}
            </p>
          </div>
        </div>

        {/* Actions / Badges */}
        <div className="flex shrink-0 items-center gap-2">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="flex h-11 min-h-[44px] items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-primary-strong)_24%,transparent)] bg-[var(--color-surface-alt)] px-3.5 text-xs font-bold text-[var(--color-primary-strong)] shadow-[var(--shadow-xs)] transition-all duration-150 hover:bg-[var(--color-primary-soft)] hover:shadow-[var(--shadow-sm)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] sm:px-4 sm:text-sm"
              title="Explore sorting rules for all 5 bins"
              aria-label="Open sorting guide for all bins"
            >
              <BookOpen className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5" strokeWidth={2.25} />
              <span className="hidden sm:inline">Sorting Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>
          )}

          <div className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] md:flex">
            <Sparkles className="h-4 w-4 shrink-0 text-[var(--color-primary-strong)]" />
            <span>On-Device AI</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header