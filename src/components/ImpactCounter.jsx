import React, { useMemo } from 'react'
import { Flame, Leaf, ArrowRight, ScanLine } from 'lucide-react'
import { TopBar } from './TopBar'
import { CategoryIcon } from './CategoryIcon'
import { STRINGS } from '../lib/strings'
import { CATEGORY_THEME } from '../lib/categoryTheme'
import { localDateKey, dayDiff } from '../lib/date'

const CATEGORIES = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']

export function ImpactCounter({
  totalSorted = 0,
  streak = 0,
  byCategory = {},
  history = [],
  onOpenScanSheet,
  onGoToHistory,
}) {
  // Derive 7-day strip from history timestamps (D6)
  const last7Days = useMemo(() => {
    const today = new Date()
    const activeDates = new Set()

    history.forEach((item) => {
      if (item.timestamp) {
        const d = new Date(item.timestamp)
        activeDates.add(localDateKey(d))
      }
    })

    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = localDateKey(d)
      const dayLetter = d.toLocaleDateString(undefined, { weekday: 'narrow' })
      const isToday = i === 0
      days.push({
        key,
        dayLetter,
        isToday,
        active: activeDates.has(key),
      })
    }
    return days
  }, [history])

  return (
    <div className="flex-1 flex flex-col gap-4 pb-28 animate-in fade-in duration-200">
      <TopBar title={STRINGS.impact.title} />

      {/* Hero Metric Tile */}
      <div className="card card-hero p-6 flex flex-col gap-4 border border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)]">
            <Leaf className="w-4 h-4 text-[var(--color-primary-strong)]" />
            <span className="text-xs font-bold text-[var(--color-primary-strong)]">
              SDG 15 · LIFE ON LAND
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
            <Flame
              className={`w-4 h-4 ${
                streak > 0 ? 'text-[#FF9800] fill-[#FF9800]' : 'text-[var(--color-text-muted)]'
              }`}
            />
            <span className="text-xs font-bold text-[var(--color-text)]">
              {streak} {STRINGS.impact.dayStreak.toLowerCase()}
            </span>
          </div>
        </div>

        <div>
          <div className="text-5xl font-extrabold tracking-tight text-[var(--color-text)] tabular-nums">
            {totalSorted}
          </div>
          <div className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1">
            {STRINGS.impact.heroCaption}
          </div>
        </div>

        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          {totalSorted > 0
            ? 'Every item safely diverted preserves soil vitality, stops toxic runoff, and shields biodiversity on land.'
            : 'Start sorting today to keep recyclable materials out of landfills and protect ecosystems.'}
        </p>

        {totalSorted === 0 && (
          <button
            type="button"
            onClick={onOpenScanSheet}
            className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm mt-1"
          >
            <ScanLine className="w-4 h-4 text-white" />
            <span>{STRINGS.impact.startStreak}</span>
          </button>
        )}
      </div>

      {/* Last 7 Days Timeline Strip */}
      <div className="card p-5 border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--color-text)]">
            {STRINGS.impact.last7Days}
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {streak > 0 ? `${streak} day streak` : STRINGS.impact.startStreak}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1 py-1">
          {last7Days.map((d) => (
            <div key={d.key} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  d.active
                    ? 'bg-[var(--color-primary-strong)] text-white shadow-sm'
                    : 'bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
                } ${d.isToday ? 'ring-2 ring-[var(--color-accent)] ring-offset-2' : ''}`}
                title={d.key}
              >
                {d.active ? (
                  <span className="text-xs font-bold">✓</span>
                ) : (
                  <span className="text-[10px] font-semibold opacity-60">·</span>
                )}
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  d.isToday
                    ? 'text-[var(--color-primary-strong)] font-bold'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {d.dayLetter}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--color-text-muted)] mt-4">
          {STRINGS.impact.streakDesc}
        </p>
      </div>

      {/* Category Activity Breakdown */}
      <div className="card p-5 border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--color-text)]">
            {STRINGS.impact.breakdownTitle}
          </h2>
          {history.length > 0 && onGoToHistory && (
            <button
              type="button"
              onClick={onGoToHistory}
              className="text-xs font-bold text-[var(--color-primary-strong)] flex items-center gap-1 hover:underline"
            >
              <span>{STRINGS.impact.seeScans}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          {CATEGORIES.map((catKey) => {
            const theme = CATEGORY_THEME[catKey]
            const count = byCategory[catKey] || 0
            const pct = totalSorted > 0 ? Math.round((count / totalSorted) * 100) : 0

            return (
              <div key={catKey} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CategoryIcon categoryId={catKey} size={16} />
                    <span className="text-[var(--color-text)]">{theme.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--color-text-muted)] tabular-nums">{count} items</span>
                    <span className="text-[var(--color-text)] font-bold tabular-nums w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div
                  className="w-full h-2 rounded-full bg-[var(--color-surface-sunken)] overflow-hidden"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: theme.ink,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ImpactCounter
