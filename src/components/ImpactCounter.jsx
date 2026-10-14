import React, { useMemo } from 'react'
import { Flame, Leaf, ArrowRight, ScanLine, Check } from 'lucide-react'
import { TopBar } from './TopBar'
import { CategoryIcon } from './CategoryIcon'
import { WasteAnalyticsChart } from './WasteAnalyticsChart'
import { STRINGS } from '../lib/strings'
import { CATEGORY_THEME } from '../lib/categoryTheme'
import { localDateKey } from '../lib/date'

const CATEGORIES = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']

export function ImpactCounter({
  totalSorted = 0,
  streak = 0,
  byCategory = {},
  history = [],
  onOpenScanSheet,
  onGoToHistory,
}) {
  // Derive 7-day strip from history timestamps
  const last7Days = useMemo(() => {
    const today = new Date()
    const activeDates = new Set()
    history.forEach((item) => {
      const ts = item.ts || item.timestamp
      if (ts) {
        const d = new Date(ts)
        activeDates.add(localDateKey(d))
      }
    })
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = localDateKey(d)
      days.push({
        key,
        dayLetter: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        isToday: i === 0,
        active: activeDates.has(key),
      })
    }
    return days
  }, [history])

  return (
    <div className="flex-1 flex flex-col gap-4 pb-36 animate-in fade-in duration-200">
      <TopBar title={STRINGS.impact.title} />

      {/* Hero Metric Tile */}
      <div className="card card-hero p-5 sm:p-6 flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary-soft)] border border-[color-mix(in_srgb,var(--color-primary-strong)_18%,transparent)]">
            <Leaf className="w-4 h-4 text-[var(--color-primary-strong)] shrink-0" />
            <span className="text-[11px] font-bold text-[var(--color-primary-strong)] tracking-wide">
              SDG 15 · LIFE ON LAND
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
            <Flame
              className={`w-4 h-4 shrink-0 ${
                streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-[var(--color-text-muted)]'
              }`}
              strokeWidth={streak > 0 ? 0 : 2}
            />
            <span className="text-xs font-bold text-[var(--color-text)] tabular-nums">
              {streak} {STRINGS.impact.dayStreak.toLowerCase()}
            </span>
          </div>
        </div>

        <div>
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-text)] tabular-nums leading-none">
            {totalSorted}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)] mt-1.5">
            {STRINGS.impact.heroCaption}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {totalSorted > 0
            ? 'Every item safely sorted prevents landfill expansion, halts toxic leachate, and preserves biodiversity on land.'
            : 'Start sorting today to keep recyclable and compostable materials out of landfills.'}
        </p>

        {totalSorted === 0 && (
          <button
            type="button"
            onClick={onOpenScanSheet}
            className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-sm h-11"
          >
            <ScanLine className="w-5 h-5 text-white shrink-0" strokeWidth={2.25} />
            <span>{STRINGS.impact.startStreak}</span>
          </button>
        )}
      </div>

      {/* Last 7 Days Timeline Strip */}
      <div className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[var(--color-text)]">
            {STRINGS.impact.last7Days}
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {streak > 0 ? `${streak} day active streak 🔥` : STRINGS.impact.startStreak}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          {last7Days.map((d) => (
            <div key={d.key} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all ${
                  d.active
                    ? 'bg-[var(--color-primary-strong)] text-white shadow-xs'
                    : 'bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
                } ${d.isToday ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}
                title={d.key}
              >
                {d.active ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-strong)] opacity-60" />
                )}
              </div>
              <span className={`text-[10px] font-semibold ${
                d.isToday
                  ? 'text-[var(--color-primary-strong)]'
                  : 'text-[var(--color-text-muted)]'
              }`}>
                {d.dayLetter}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--color-text-muted)] mt-4 leading-relaxed">
          {STRINGS.impact.streakDesc}
        </p>
      </div>

      {/* Gamified Visual Waste Analytics Section (Recharts) */}
      <WasteAnalyticsChart
        history={history}
        streak={streak}
        byCategory={byCategory}
        totalSorted={totalSorted}
        onOpenScanSheet={onOpenScanSheet}
      />

      {/* Category Activity Breakdown */}
      <div className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[var(--color-text)]">
            {STRINGS.impact.breakdownTitle}
          </h2>
          {history.length > 0 && onGoToHistory && (
            <button
              type="button"
              onClick={onGoToHistory}
              className="text-xs font-bold text-[var(--color-primary-strong)] flex items-center gap-1.5 hover:underline"
            >
              <span>{STRINGS.impact.seeScans}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {CATEGORIES.map((catKey) => {
            const theme = CATEGORY_THEME[catKey]
            const count = byCategory[catKey] || 0
            const pct = totalSorted > 0 ? Math.round((count / totalSorted) * 100) : 0

            return (
              <div key={catKey} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon categoryId={catKey} size={18} />
                    <span className="text-[var(--color-text)]">{theme.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)] tabular-nums">
                    <span>{count}</span>
                    <span className="text-[var(--color-text)] font-bold w-7 text-right">{pct}%</span>
                  </div>
                </div>

                <div
                  className="w-full h-1.5 rounded-full bg-[var(--color-surface-sunken)] overflow-hidden"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: theme.ink }}
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