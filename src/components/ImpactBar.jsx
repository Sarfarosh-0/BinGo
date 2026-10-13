import React from 'react'
import { Flame } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function ImpactBar({ totalSorted = 0, streak = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-3" aria-label="Environmental Impact Preview">
      {/* Metric 1: Items sorted */}
      <div className="card p-4 flex flex-col justify-between border border-[var(--color-border)] shadow-sm">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {STRINGS.home.itemsSorted}
        </span>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-[var(--color-text)] tabular-nums tracking-tight">
            {totalSorted}
          </span>
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">items</span>
        </div>
      </div>

      {/* Metric 2: Day streak */}
      <div className="card p-4 flex flex-col justify-between border border-[var(--color-border)] shadow-sm">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {STRINGS.home.dayStreak}
        </span>
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`text-3xl font-extrabold tabular-nums tracking-tight ${
            streak > 0 ? 'text-[var(--color-primary-strong)]' : 'text-[var(--color-text-muted)]'
          }`}>
            {streak}
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            streak > 0 ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-surface-sunken)]'
          }`}>
            <Flame
              className={`w-4 h-4 ${
                streak > 0 ? 'text-[#FF9800] fill-[#FF9800]' : 'text-[var(--color-text-muted)]'
              }`}
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactBar
