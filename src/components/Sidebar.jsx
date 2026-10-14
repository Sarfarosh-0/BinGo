import React from 'react'
import { Home, History, TrendingUp, ScanLine, Leaf } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Sidebar({
  active,
  onHome,
  onHistory,
  onImpact,
  onOpenScanSheet,
  scanDisabled = false,
}) {
  const navItem = (isActive, onClick, Icon, label) => (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
        isActive
          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--color-primary-strong)] rounded-r-full" />
      )}
      <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.5 : 2} />
      <span>{label}</span>
    </button>
  )

  return (
    <aside
      aria-label="Desktop Navigation"
      className="hidden lg:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] py-6 px-4 justify-between select-none"
    >
      <div>
        {/* Brand */}
        <div className="mb-7 flex items-center gap-3 px-1.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)] shrink-0">
            <img src="/logo.png" alt="BinGo logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none flex items-baseline gap-1.5">
              <span>
                <span className="text-[var(--color-text)]">Bin</span>
                <span className="text-[var(--color-primary-strong)]">Go</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-[var(--color-surface-alt)] text-[var(--color-primary-strong)]">
                SDG 15
              </span>
            </h1>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-tight">{STRINGS.app.tagline}</p>
          </div>
        </div>

        {/* Scan CTA */}
        <button
          type="button"
          onClick={onOpenScanSheet}
          disabled={scanDisabled}
          className="btn btn-primary w-full flex items-center justify-center gap-2 mb-6 text-sm h-11 shadow-xs"
        >
          <ScanLine className="w-4 h-4 text-white" />
          <span>Scan an item</span>
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItem(active === 'home', onHome, Home, STRINGS.nav.home)}
          {navItem(active === 'impact', onImpact, TrendingUp, STRINGS.nav.impact)}
          {navItem(active === 'history', onHistory, History, STRINGS.nav.history)}
        </nav>
      </div>

      {/* Sustainable Mission Note */}
      <div className="p-3.5 rounded-2xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] leading-relaxed">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-primary-strong)] mb-1">
          <Leaf className="w-3.5 h-3.5" />
          <span>SDG 15 Impact</span>
        </div>
        Every correctly sorted item protects soil quality and halts landfill runoff.
      </div>
    </aside>
  )
}

export default Sidebar