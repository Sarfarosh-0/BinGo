import React from 'react'
import { Home, History, ScanLine, TrendingUp } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function BottomNav({
  active, // 'home' | 'history' | 'impact'
  onHome,
  onHistory,
  onImpact,
  onOpenScanSheet,
  scanDisabled = false,
}) {
  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-[max(0.75rem,env(safe-area-inset-bottom))] px-4 lg:hidden"
    >
      <div className="max-w-[420px] mx-auto pointer-events-auto flex flex-col items-center">
        {/* Floating Action Hero Pill Centered Directly Above Bottom Nav (GPay style) */}
        <div className="mb-2">
          <button
            type="button"
            onClick={onOpenScanSheet}
            disabled={scanDisabled}
            aria-label={STRINGS.nav.scan}
            style={{ boxShadow: 'var(--shadow-scan-btn)' }}
            className="h-12 px-6 rounded-full bg-[var(--color-primary-strong)] hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 border-2 border-white transition-all"
          >
            <ScanLine className="w-5 h-5 text-white" strokeWidth={2.25} />
            <span className="font-bold text-sm tracking-wide">{STRINGS.nav.scan}</span>
          </button>
        </div>

        {/* 3-Slot Bottom Navigation Bar */}
        <div className="w-full bg-[var(--color-surface)] rounded-full px-4 py-1.5 flex items-center justify-around shadow-md border border-[var(--color-border)]">
          {/* Left Slot: Impact Counter */}
          <button
            type="button"
            onClick={onImpact}
            aria-label={STRINGS.nav.impact}
            aria-current={active === 'impact' ? 'page' : undefined}
            className={`min-w-[64px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1 transition-all ${
              active === 'impact'
                ? 'text-[var(--color-primary-strong)] font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <div className={`relative px-3 py-0.5 rounded-full transition-all ${
              active === 'impact' ? 'bg-[var(--color-accent)]' : ''
            }`}>
              <TrendingUp className="w-5 h-5" strokeWidth={active === 'impact' ? 2.5 : 2} />
            </div>
            <span className="text-[11px] leading-tight">{STRINGS.nav.impact}</span>
          </button>

          {/* Center Slot: Home */}
          <button
            type="button"
            onClick={onHome}
            aria-label={STRINGS.nav.home}
            aria-current={active === 'home' ? 'page' : undefined}
            className={`min-w-[64px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1 transition-all ${
              active === 'home'
                ? 'text-[var(--color-primary-strong)] font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <div className={`relative px-3 py-0.5 rounded-full transition-all ${
              active === 'home' ? 'bg-[var(--color-accent)]' : ''
            }`}>
              <Home className="w-5 h-5" strokeWidth={active === 'home' ? 2.5 : 2} />
            </div>
            <span className="text-[11px] leading-tight">{STRINGS.nav.home}</span>
          </button>

          {/* Right Slot: History */}
          <button
            type="button"
            onClick={onHistory}
            aria-label={STRINGS.nav.history}
            aria-current={active === 'history' ? 'page' : undefined}
            className={`min-w-[64px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1 transition-all ${
              active === 'history'
                ? 'text-[var(--color-primary-strong)] font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <div className={`relative px-3 py-0.5 rounded-full transition-all ${
              active === 'history' ? 'bg-[var(--color-accent)]' : ''
            }`}>
              <History className="w-5 h-5" strokeWidth={active === 'history' ? 2.5 : 2} />
            </div>
            <span className="text-[11px] leading-tight">{STRINGS.nav.history}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
