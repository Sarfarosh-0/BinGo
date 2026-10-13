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
        <div className="mb-8 flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#10B981] via-[#0F9D58] to-[#0B6E4F] flex items-center justify-center shadow-sm border border-white/40 shrink-0">
            <svg viewBox="0 0 36 36" className="w-6 h-6" fill="none">
              <path d="M18 5L21 9H16.5C12.91 9 10 11.91 10 15.5V17L7 17V15.5C7 10.25 11.25 6 16.5 6L18 5Z" fill="#FFFFFF" />
              <path d="M19.5 31L16.5 27H21C24.59 27 27.5 24.09 27.5 20.5V19L30.5 19V20.5C30.5 25.75 26.25 30 21 30L19.5 31Z" fill="#FFFFFF" />
              <path d="M18 10C18 10 24 12 24 18C24 23 19 25 18 25C17 25 12 23 12 18C12 12 18 10 18 10Z" fill="#D9F99D" opacity="0.9" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none flex items-center gap-1.5">
              <span><span className="text-[#0E2A1F]">Bin</span><span className="text-[#0F9D58]">Go</span></span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)] text-[var(--color-primary-strong)]">
                SDG 15
              </span>
            </h1>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">{STRINGS.app.tagline}</p>
          </div>
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
