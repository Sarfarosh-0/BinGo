import React from 'react'
import { Flame, Award, ArrowRight } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function ImpactBar({ totalSorted = 0, streak = 0, onViewAnalytics }) {
  // Determine next milestone
  const milestones = [5, 10, 25, 50, 100, 250, 500]
  const nextTarget = milestones.find((m) => m > totalSorted) || totalSorted + 50
  const progressPct = Math.min(100, Math.round((totalSorted / nextTarget) * 100))

  return (
    <div className="card p-4 sm:p-5 border border-[var(--color-border)] shadow-sm bg-[var(--color-surface)] flex flex-col gap-3.5" aria-label="Environmental Impact Summary">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Your Ecological Impact
        </span>
        {onViewAnalytics && (
          <button
            type="button"
            onClick={onViewAnalytics}
            className="text-xs font-bold text-[var(--color-primary-strong)] flex items-center gap-1.5 hover:underline transition-all"
          >
            <span>Analytics</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Items sorted */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              {STRINGS.home.itemsSorted}
            </span>
            <Award className="w-5 h-5 text-[var(--color-primary-strong)] shrink-0" />
          </div>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[var(--color-text)] tabular-nums tracking-tight">
              {totalSorted}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">items</span>
          </div>

          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] mb-1">
              <span>Goal</span>
              <span className="font-semibold text-[var(--color-text)] tabular-nums">
                {totalSorted}/{nextTarget}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-black/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Day streak */}
        <div className="p-3.5 rounded-xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              {STRINGS.home.dayStreak}
            </span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              streak > 0 ? 'bg-orange-100 text-orange-600' : 'bg-black/5 text-[var(--color-text-muted)]'
            }`}>
              <Flame
                className={`w-4 h-4 shrink-0 ${
                  streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-[var(--color-text-disabled)]'
                }`}
                strokeWidth={streak > 0 ? 0 : 2}
              />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-extrabold tabular-nums tracking-tight ${
              streak > 0 ? 'text-[var(--color-primary-strong)]' : 'text-[var(--color-text-disabled)]'
            }`}>
              {streak}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">days active</span>
          </div>

          <p className="text-[10px] text-[var(--color-text-secondary)] mt-2 leading-tight">
            {streak > 0 ? 'Momentum active today!' : 'Scan an item to start'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImpactBar