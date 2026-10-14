import React from 'react'
import { Flame } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function ImpactBar({ totalSorted = 0, streak = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-3" aria-label="Environmental Impact Summary">
      {/* Items sorted */}
      <div className="card p-4 flex flex-col gap-1.5 border border-[var(--color-border)] shadow-sm">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          {STRINGS.home.itemsSorted}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-[var(--color-text)] tabular-nums tracking-tight leading-none">
            {totalSorted}
          </span>
          <span className="text-xs font-semibold text-[var(--color-text-muted)] mb-0.5">items</span>
        </div>
      </div>

      {/* Day streak */}
      <div className="card p-4 flex flex-col gap-1.5 border border-[var(--color-border)] shadow-sm">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          {STRINGS.home.dayStreak}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-extrabold tabular-nums tracking-tight leading-none ${
            streak > 0 ? 'text-[var(--color-primary-strong)]' : 'text-[var(--color-text-disabled)]'
          }`}>
            {streak}
          </span>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            streak > 0 ? 'bg-orange-100' : 'bg-[var(--color-surface-sunken)]'
          }`}>
            <Flame
              className={`w-4 h-4 transition-colors ${
                streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-[var(--color-text-disabled)]'
              }`}
              strokeWidth={streak > 0 ? 0 : 2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactBar