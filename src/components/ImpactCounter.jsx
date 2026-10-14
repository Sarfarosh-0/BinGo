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
    <div className="view-enter-fast flex flex-1 flex-col gap-4 pb-36">
      <TopBar title={STRINGS.impact.title} />

      {/* Hero Metric Tile */}
      <div className="card card-hero relative flex flex-col gap-4 overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[var(--color-primary-soft)] opacity-70 blur-2xl"
        />

        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-primary-strong)_18%,transparent)] bg-[var(--color-primary-soft)] px-3 py-1.5">
            <Leaf className="h-4 w-4 shrink-0 text-[var(--color-primary-strong)]" />
            <span className="text-xs font-bold tracking-wide text-[var(--color-primary-strong)]">
              SDG 15 · LIFE ON LAND
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 shadow-[var(--shadow-xs)]">
            <Flame
              className={`h-4 w-4 shrink-0 ${streak > 0 ? 'fill-orange-500 text-orange-500' : 'text-[var(--color-text-muted)]'
                }`}
              strokeWidth={streak > 0 ? 0 : 2}
            />
            <span className="text-xs font-bold tabular-nums text-[var(--color-text)]">
              {streak} {STRINGS.impact.dayStreak.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="text-5xl font-extrabold leading-none tracking-tight tabular-nums text-[var(--color-text)] sm:text-6xl">
            {totalSorted}
          </div>
          <div className="mt-2 text-sm font-semibold text-[var(--color-text-secondary)]">
            {STRINGS.impact.heroCaption}
          </div>
        </div>

        <p className="relative text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {totalSorted > 0
            ? 'Every item safely sorted prevents landfill expansion, halts toxic leachate, and preserves biodiversity on land.'
            : 'Start sorting today to keep recyclable and compostable materials out of landfills.'}
        </p>

        {totalSorted === 0 && (
          <button
            type="button"
            onClick={onOpenScanSheet}
            className="btn btn-primary relative w-full gap-2.5 text-sm"
          >
            <ScanLine className="h-5 w-5 shrink-0 text-white" strokeWidth={2.25} />
            <span>{STRINGS.impact.startStreak}</span>
          </button>
        )}
      </div>

      {/* Last 7 Days Strip */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[var(--color-text)]">
            {STRINGS.impact.last7Days}
          </h2>
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            {streak > 0 ? `${streak} day active streak 🔥` : STRINGS.impact.startStreak}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          {last7Days.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] transition-all duration-150 sm:h-10 sm:w-10 ${d.active
                    ? 'bg-[var(--color-primary-strong)] text-white shadow-[var(--shadow-sm)]'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)]'
                  } ${d.isToday ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-surface)]' : ''}`}
                title={d.key}
              >
                {d.active ? (
                  <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-border-strong)]" />
                )}
              </div>
              <span
                className={`text-xs font-semibold ${d.isToday ? 'text-[var(--color-primary-strong)]' : 'text-[var(--color-text-muted)]'
                  }`}
              >
                {d.dayLetter}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
          {STRINGS.impact.streakDesc}
        </p>
      </div>

      {/* Analytics (Recharts) */}
      <WasteAnalyticsChart
        history={history}
        streak={streak}
        byCategory={byCategory}
        totalSorted={totalSorted}
        onOpenScanSheet={onOpenScanSheet}
      />

      {/* Category Breakdown */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[var(--color-text)]">
            {STRINGS.impact.breakdownTitle}
          </h2>
          {history.length > 0 && onGoToHistory && (
            <button
              type="button"
              onClick={onGoToHistory}
              className="-mr-2 flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-sm)] px-2 text-sm font-bold text-[var(--color-primary-strong)] transition-colors duration-150 hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            >
              <span>{STRINGS.impact.seeScans}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
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
                <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-xs)]"
                      style={{ backgroundColor: theme.soft }}
                    >
                      <CategoryIcon categoryId={catKey} size={18} />
                    </span>
                    <span className="truncate text-[var(--color-text)]">{theme.label}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 tabular-nums text-[var(--color-text-muted)]">
                    <span>{count}</span>
                    <span className="w-9 text-right font-bold text-[var(--color-text)]">{pct}%</span>
                  </div>
                </div>

                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-sunken)]"
                  role="progressbar"
                  aria-label={theme.label}
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