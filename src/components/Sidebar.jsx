import React from 'react'
import { Home, History, TrendingUp, ScanLine } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Sidebar({
  active,
  onHome,
  onHistory,
  onImpact,
  onOpenScanSheet,
  scanDisabled = false,
}) {
  return (
    <aside
      aria-label="Desktop Navigation"
      className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] p-6 justify-between"
    >
      <div>
        {/* Brand header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[var(--color-text)] tracking-tight flex items-center gap-2">
            <span>{STRINGS.app.name}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)] text-[var(--color-primary-strong)]">
              SDG 15
            </span>
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">{STRINGS.app.tagline}</p>
        </div>

        {/* Scan Hero Button */}
        <button
          type="button"
          onClick={onOpenScanSheet}
          disabled={scanDisabled}
          className="btn btn-primary w-full shadow-md flex items-center justify-center gap-2.5 mb-8 text-sm"
        >
          <ScanLine className="w-5 h-5 text-white" />
          <span>Scan an item</span>
        </button>

        {/* Nav list */}
        <nav className="flex flex-col gap-1.5">
          {/* Home */}
          <button
            type="button"
            onClick={onHome}
            aria-current={active === 'home' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative ${
              active === 'home'
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
            }`}
          >
            {active === 'home' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--color-primary-strong)] rounded-r-full" />
            )}
            <Home className="w-5 h-5" strokeWidth={active === 'home' ? 2.5 : 2} />
            <span>{STRINGS.nav.home}</span>
          </button>

          {/* Impact */}
          <button
            type="button"
            onClick={onImpact}
            aria-current={active === 'impact' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative ${
              active === 'impact'
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
            }`}
          >
            {active === 'impact' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--color-primary-strong)] rounded-r-full" />
            )}
            <TrendingUp className="w-5 h-5" strokeWidth={active === 'impact' ? 2.5 : 2} />
            <span>{STRINGS.nav.impact}</span>
          </button>

          {/* History */}
          <button
            type="button"
            onClick={onHistory}
            aria-current={active === 'history' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative ${
              active === 'history'
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
            }`}
          >
            {active === 'history' && (
              <span className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--color-primary-strong)] rounded-r-full" />
            )}
            <History className="w-5 h-5" strokeWidth={active === 'history' ? 2.5 : 2} />
            <span>{STRINGS.nav.history}</span>
          </button>
        </nav>
      </div>

      <div className="p-3 rounded-xl bg-[var(--color-surface-sunken)] text-[11px] text-[var(--color-text-muted)] leading-relaxed">
        SDG 15 — Life on Land. Every sorted item helps reduce landfill pollution.
      </div>
    </aside>
  )
}

export default Sidebar
