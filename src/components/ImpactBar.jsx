import React from 'react'
import { Flame, TrendingUp, ArrowRight, Award } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function ImpactBar({ totalSorted = 0, streak = 0, onViewAnalytics }) {
  // Determine next milestone
  const milestones = [5, 10, 25, 50, 100, 250, 500]
  const nextTarget = milestones.find((m) => m > totalSorted) || totalSorted + 50
  const progressPct = Math.min(100, Math.round((totalSorted / nextTarget) * 100))

  return (
    <div className="card p-4 sm:p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)] flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Your Ecological Impact
        </span>
        {onViewAnalytics && (
          <button
            type="button"
            onClick={onViewAnalytics}
            className="text-xs font-bold text-[var(--color-primary-strong)] flex items-center gap-1 hover:underline transition-all"
          >
            <span>Visual Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Items Diverted */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              {STRINGS.home.itemsSorted}
            </span>
            <Award className="w-4 h-4 text-[var(--color-primary-strong)]" />
          </div>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[var(--color-text)] tabular-nums tracking-tight">
              {totalSorted}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">items</span>
          </div>

          {/* Mini progress bar towards next milestone */}
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

        {/* Metric 2: Day Streak */}
        <div className="p-3.5 rounded-2xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              {STRINGS.home.dayStreak}
            </span>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              streak > 0 ? 'bg-amber-100 text-amber-700' : 'bg-black/5 text-[var(--color-text-muted)]'
            }`}>
              <Flame
                className={`w-3.5 h-3.5 ${
                  streak > 0 ? 'text-[#FF9800] fill-[#FF9800]' : 'text-[var(--color-text-muted)]'
                }`}
                strokeWidth={2}
              />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-3xl font-black tabular-nums tracking-tight ${
              streak > 0 ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
            }`}>
              {streak}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">days active</span>
          </div>

          <p className="text-[10px] text-[var(--color-text-secondary)] mt-2 leading-tight">
            {streak > 0
              ? 'Keep your momentum alive today!'
              : 'Scan an item today to start a streak'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImpactBar
