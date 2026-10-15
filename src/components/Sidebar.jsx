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
      className={`relative flex min-h-[44px] w-full items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] ${isActive
          ? 'bg-[var(--color-primary-soft)] font-bold text-[var(--color-primary-strong)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
        }`}
    >
      {isActive && (
        <span
          className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-[var(--color-primary-strong)]"
          aria-hidden="true"
        />
      )}
      <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
      <span>{label}</span>
    </button>
  )

  return (
    <aside
      aria-label={STRINGS.sidebar.navAria}
      className="fixed left-0 top-0 bottom-0 z-30 hidden h-screen w-[var(--sidebar-w)] shrink-0 select-none flex-col justify-between overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 lg:flex"
    >
      <div>
        {/* Brand */}
        <div className="mb-8 flex items-center gap-3 px-1.5">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
            <img src="/logo.png" alt={STRINGS.app.logoAlt} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-lg font-black leading-none tracking-tight">
              <span>
                <span className="text-[var(--color-text)]">{STRINGS.app.brandFirst}</span>
                <span className="text-[var(--color-primary-strong)]">{STRINGS.app.brandSecond}</span>
              </span>
              <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-strong)]">
                {STRINGS.sidebar.sdgBadge}
              </span>
            </h1>
            <p className="mt-1 text-xs leading-tight text-[var(--color-text-muted)]">
              {STRINGS.app.tagline}
            </p>
          </div>
        </div>

        {/* Scan CTA */}
        <button
          type="button"
          onClick={onOpenScanSheet}
          disabled={scanDisabled}
          className="btn btn-primary mb-6 h-11 w-full gap-2.5 text-sm shadow-[var(--shadow-scan-btn)]"
        >
          <ScanLine className="h-5 w-5 shrink-0 text-white" strokeWidth={2.25} />
          <span>{STRINGS.sidebar.scanItem}</span>
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItem(active === 'home', onHome, Home, STRINGS.nav.home)}
          {navItem(active === 'impact', onImpact, TrendingUp, STRINGS.nav.impact)}
          {navItem(active === 'history', onHistory, History, STRINGS.nav.history)}
        </nav>
      </div>

      {/* Mission Note */}
      <div className="card-mint rounded-[var(--radius-lg)] p-4 text-xs leading-relaxed text-[var(--color-text-secondary)]">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary-strong)]">
          <Leaf className="h-4 w-4 shrink-0" />
          <span>{STRINGS.sidebar.missionTitle}</span>
        </div>
        {STRINGS.sidebar.missionBody}
      </div>
    </aside>
  )
}

export default Sidebar