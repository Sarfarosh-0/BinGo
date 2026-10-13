import React from 'react'
import { Home, History, Camera } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function BottomNav({
  active,
  onHome,
  onHistory,
  onScan,
  scanDisabled = false,
}) {
  return (
    <nav 
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none pb-[max(0.75rem,env(safe-area-inset-bottom))] px-4"
    >
      <div className="max-w-[360px] mx-auto pointer-events-auto">
        <div className="surface-glass-strong rounded-full px-6 py-2 flex items-center justify-between relative shadow-glass border border-white/20">
          {/* Home Tab */}
          <button
            type="button"
            onClick={onHome}
            aria-label={STRINGS.nav.home}
            aria-current={active === 'home' ? 'page' : undefined}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-full transition-all ${
              active === 'home'
                ? 'text-[var(--emerald-400)] font-semibold'
                : 'text-white/65 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" strokeWidth={active === 'home' ? 2.25 : 1.75} />
            <span className="text-[11px] leading-tight">{STRINGS.nav.home}</span>
            {active === 'home' && (
              <span className="w-1 h-1 rounded-full bg-[var(--emerald-400)] -mb-1" />
            )}
          </button>

          {/* Elevated Camera FAB */}
          <div className="relative -translate-y-5">
            <button
              type="button"
              onClick={onScan}
              disabled={scanDisabled}
              aria-label={STRINGS.nav.scan}
              className="w-14 h-14 rounded-full btn-primary flex items-center justify-center shadow-fab border-2 border-white/25 active:scale-95 transition-all"
            >
              <Camera className="w-7 h-7 text-white" strokeWidth={2} />
            </button>
          </div>

          {/* History Tab */}
          <button
            type="button"
            onClick={onHistory}
            aria-label={STRINGS.nav.history}
            aria-current={active === 'history' ? 'page' : undefined}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-full transition-all ${
              active === 'history'
                ? 'text-[var(--emerald-400)] font-semibold'
                : 'text-white/65 hover:text-white'
            }`}
          >
            <History className="w-5 h-5" strokeWidth={active === 'history' ? 2.25 : 1.75} />
            <span className="text-[11px] leading-tight">{STRINGS.nav.history}</span>
            {active === 'history' && (
              <span className="w-1 h-1 rounded-full bg-[var(--emerald-400)] -mb-1" />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
