import React from 'react'
import { Home, History, ScanLine, TrendingUp } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function BottomNav({
  active,
  onHome,
  onHistory,
  onImpact,
  onOpenScanSheet,
  scanDisabled = false,
}) {
  const navBtn = (isActive, onClick, Icon, label) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className={`relative flex h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] px-2 py-1 transition-all duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] ${isActive
          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
          : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
        }`}
    >
      {isActive && (
        <span
          className="absolute left-1/2 top-1 h-1 w-5 -translate-x-1/2 rounded-full bg-[var(--color-primary-strong)]"
          aria-hidden="true"
        />
      )}
      <Icon
        className={`h-[22px] w-[22px] shrink-0 transition-transform duration-150 ${isActive
            ? 'mt-1 scale-105 text-[var(--color-primary-strong)]'
            : 'text-[var(--color-text-muted)]'
          }`}
        strokeWidth={isActive ? 2.5 : 1.9}
      />
      <span
        className={`w-full truncate text-center text-xs leading-none tracking-tight ${isActive
            ? 'font-extrabold text-[var(--color-primary-strong)]'
            : 'font-semibold text-[var(--color-text-muted)]'
          }`}
      >
        {label}
      </span>
    </button>
  )

  return (
    <nav
      aria-label="Main Navigation"
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="pointer-events-auto mx-auto flex max-w-[440px] flex-col items-center gap-2.5">
        {/* Scan FAB */}
        <button
          type="button"
          onClick={onOpenScanSheet}
          disabled={scanDisabled}
          aria-label={STRINGS.nav.scan}
          className="flex h-12 items-center justify-center gap-2.5 rounded-full bg-[var(--color-primary-strong)] px-6 text-white shadow-[var(--shadow-scan-btn)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
        >
          <ScanLine className="h-5 w-5 shrink-0 text-white" strokeWidth={2.25} />
          <span className="text-sm font-bold tracking-wide">{STRINGS.nav.scan}</span>
        </button>

        {/* Bottom pill nav */}
        <div className="flex w-full items-center justify-around gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-glass)] p-1.5 shadow-[var(--shadow-lg)] backdrop-blur-md">
          {navBtn(active === 'impact', onImpact, TrendingUp, STRINGS.nav.impact)}
          {navBtn(active === 'home', onHome, Home, STRINGS.nav.home)}
          {navBtn(active === 'history', onHistory, History, STRINGS.nav.history)}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav