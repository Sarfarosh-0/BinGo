<<<<<<< HEAD
﻿import React from 'react'
import { Home, History, TrendingUp, ScanLine } from 'lucide-react'
=======
import React from 'react'
import { Home, History, TrendingUp, ScanLine, Leaf } from 'lucide-react'
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
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
<<<<<<< HEAD
      className="hidden lg:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] py-6 px-4 justify-between"
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
=======
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[var(--color-surface)] border-r border-[var(--color-border)] p-6 justify-between select-none"
    >
      <div>
        {/* Brand header */}
        <div className="mb-7 flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-xs border border-[var(--color-border)] shrink-0 bg-[var(--color-surface-sunken)]">
            <img
              src="/logo.png"
              alt="BinGo logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none flex items-center gap-1 text-[var(--color-text)]">
              <span>Bin</span>
              <span className="text-[var(--color-primary)]">Go</span>
            </h1>
            <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] mt-1">
              SDG 15 · Life on Land
            </p>
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
          </div>
        </div>

        {/* Scan CTA */}
        <button
          type="button"
          onClick={onOpenScanSheet}
          disabled={scanDisabled}
<<<<<<< HEAD
          className="btn btn-primary w-full flex items-center justify-center gap-2 mb-6 text-sm h-11"
        >
          <ScanLine className="w-4 h-4" />
          <span>Scan an item</span>
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItem(active === 'home', onHome, Home, STRINGS.nav.home)}
          {navItem(active === 'impact', onImpact, TrendingUp, STRINGS.nav.impact)}
          {navItem(active === 'history', onHistory, History, STRINGS.nav.history)}
        </nav>
      </div>

      {/* Footer note */}
      <p className="px-3 text-[11px] text-[var(--color-text-disabled)] leading-relaxed">
        SDG 15 — Life on Land.{' '}
        <span className="text-[var(--color-text-muted)]">Every sorted item counts.</span>
      </p>
=======
          className="btn btn-primary w-full shadow-xs flex items-center justify-center gap-2.5 mb-7 text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all"
        >
          <ScanLine className="w-4 h-4 text-white" strokeWidth={2.25} />
          <span>Scan an item</span>
        </button>

        {/* Nav list */}
        <nav className="flex flex-col gap-1.5" aria-label="Main Menu">
          {/* Home */}
          <button
            type="button"
            onClick={onHome}
            aria-current={active === 'home' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              active === 'home'
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
            }`}
          >
            <Home className="w-4 h-4" strokeWidth={active === 'home' ? 2.5 : 2} />
            <span>{STRINGS.nav.home}</span>
          </button>

          {/* Impact */}
          <button
            type="button"
            onClick={onImpact}
            aria-current={active === 'impact' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              active === 'impact'
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
            }`}
          >
            <TrendingUp className="w-4 h-4" strokeWidth={active === 'impact' ? 2.5 : 2} />
            <span>{STRINGS.nav.impact}</span>
          </button>

          {/* History */}
          <button
            type="button"
            onClick={onHistory}
            aria-current={active === 'history' ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              active === 'history'
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]'
            }`}
          >
            <History className="w-4 h-4" strokeWidth={active === 'history' ? 2.5 : 2} />
            <span>{STRINGS.nav.history}</span>
          </button>
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
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
    </aside>
  )
}

export default Sidebar