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
      className={`flex-1 min-w-0 min-h-[50px] h-[52px] flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-xl relative transition-all active:scale-95 ${
        isActive
          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] border border-[color-mix(in_srgb,var(--color-primary-strong)_22%,transparent)] shadow-xs'
          : 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)]/70 border border-transparent'
      }`}
    >
      {isActive && (
        <span
          className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[var(--color-primary-strong)]"
          aria-hidden="true"
        />
      )}
      <Icon
        className={`w-[22px] h-[22px] shrink-0 transition-transform ${
          isActive
            ? 'text-[var(--color-primary-strong)] scale-105'
            : 'text-[var(--color-text-muted)]'
        }`}
        strokeWidth={isActive ? 2.5 : 1.9}
      />
      <span
        className={`text-[11px] sm:text-xs leading-none tracking-tight truncate w-full text-center ${
          isActive
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
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-[max(0.625rem,env(safe-area-inset-bottom))] px-4 lg:hidden"
    >
      <div className="max-w-[440px] mx-auto pointer-events-auto flex flex-col items-center gap-2">
        {/* Scan FAB */}
        <button
          type="button"
          onClick={onOpenScanSheet}
          disabled={scanDisabled}
          aria-label={STRINGS.nav.scan}
          className="h-11 px-5 rounded-full bg-[var(--color-primary-strong)] hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2.5 shadow-[var(--shadow-scan-btn)] transition-all"
        >
          <ScanLine className="w-5 h-5 text-white shrink-0" strokeWidth={2.25} />
          <span className="font-bold text-sm tracking-wide">{STRINGS.nav.scan}</span>
        </button>

        {/* Bottom pill nav */}
        <div className="w-full bg-[var(--color-surface)]/95 backdrop-blur-md rounded-2xl p-1.5 flex items-center justify-around gap-1.5 shadow-[0_6px_24px_rgba(14,42,31,0.12)] border border-[var(--color-border)]">
          {navBtn(active === 'impact', onImpact, TrendingUp, STRINGS.nav.impact)}
          {navBtn(active === 'home', onHome, Home, STRINGS.nav.home)}
          {navBtn(active === 'history', onHistory, History, STRINGS.nav.history)}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav