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
  const navBtn = (isActive, onClick, icon, label) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      className={`min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
        isActive
          ? 'text-[var(--color-primary-strong)]'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
      }`}
    >
      <div className={`relative flex items-center justify-center w-8 h-5 rounded-full transition-all ${
        isActive ? 'scale-110' : ''
      }`}>
        {icon(isActive)}
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary-strong)]" />
        )}
      </div>
      <span className={`text-[10px] leading-tight font-${isActive ? 'bold' : 'medium'}`}>{label}</span>
    </button>
  )

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-[max(0.5rem,env(safe-area-inset-bottom))] px-4 lg:hidden"
    >
      <div className="max-w-[440px] mx-auto pointer-events-auto flex flex-col items-center gap-2">
        {/* Scan FAB */}
        <button
          type="button"
          onClick={onOpenScanSheet}
          disabled={scanDisabled}
          aria-label={STRINGS.nav.scan}
          className="h-11 px-5 rounded-full bg-[var(--color-primary-strong)] hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 shadow-[var(--shadow-scan-btn)] transition-all"
        >
          <ScanLine className="w-4.5 h-4.5" strokeWidth={2.25} />
          <span className="font-bold text-sm tracking-wide">{STRINGS.nav.scan}</span>
        </button>

        {/* Bottom pill nav */}
        <div className="w-full bg-[var(--color-surface)] rounded-2xl px-2 py-1 flex items-center justify-around shadow-[var(--shadow-md)] border border-[var(--color-border)]">
          {navBtn(active === 'impact', onImpact, (a) => <TrendingUp className="w-5 h-5" strokeWidth={a ? 2.5 : 2} />, STRINGS.nav.impact)}
          {navBtn(active === 'home', onHome, (a) => <Home className="w-5 h-5" strokeWidth={a ? 2.5 : 2} />, STRINGS.nav.home)}
          {navBtn(active === 'history', onHistory, (a) => <History className="w-5 h-5" strokeWidth={a ? 2.5 : 2} />, STRINGS.nav.history)}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav