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
<<<<<<< HEAD
=======
  // Derive 7-day strip from history timestamps
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
  const last7Days = useMemo(() => {
    const today = new Date()
    const activeDates = new Set()
    history.forEach((item) => {
<<<<<<< HEAD
      if (item.timestamp) activeDates.add(localDateKey(new Date(item.timestamp)))
=======
      const ts = item.ts || item.timestamp
      if (ts) {
        const d = new Date(ts)
        activeDates.add(localDateKey(d))
      }
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
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
    <div className="flex-1 flex flex-col gap-4 pb-28 animate-in fade-in duration-200">
      <TopBar title={STRINGS.impact.title} />

<<<<<<< HEAD
      {/* Hero metric */}
      <div className="card card-hero p-6 flex flex-col gap-4 border border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary-soft)] border border-[color-mix(in_srgb,var(--color-primary-strong)_18%,transparent)]">
            <Leaf className="w-3.5 h-3.5 text-[var(--color-primary-strong)]" />
            <span className="text-[11px] font-bold text-[var(--color-primary-strong)] tracking-wide">
=======
      {/* Hero Metric Tile */}
      <div className="card card-hero p-5 sm:p-6 flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)]">
            <Leaf className="w-3.5 h-3.5 text-[var(--color-primary-strong)]" />
            <span className="text-[11px] font-extrabold text-[var(--color-primary-strong)] tracking-wider">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
              SDG 15 · LIFE ON LAND
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-surface-sunken)] border border-[var(--color-border)]">
            <Flame
              className={`w-3.5 h-3.5 ${
<<<<<<< HEAD
                streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-[var(--color-text-muted)]'
=======
                streak > 0 ? 'text-[#FF9800] fill-[#FF9800]' : 'text-[var(--color-text-muted)]'
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
              }`}
              strokeWidth={streak > 0 ? 0 : 2}
            />
<<<<<<< HEAD
            <span className="text-[11px] font-bold text-[var(--color-text)]">
=======
            <span className="text-xs font-bold text-[var(--color-text)] tabular-nums">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
              {streak} {STRINGS.impact.dayStreak.toLowerCase()}
            </span>
          </div>
        </div>

        <div>
<<<<<<< HEAD
          <div className="text-5xl font-extrabold tracking-tight text-[var(--color-text)] tabular-nums leading-none">
            {totalSorted}
          </div>
          <div className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1.5">
=======
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--color-text)] tabular-nums">
            {totalSorted}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)] mt-1">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
            {STRINGS.impact.heroCaption}
          </div>
        </div>

<<<<<<< HEAD
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed -mt-1">
          {totalSorted > 0
            ? 'Every item safely diverted preserves soil vitality and shields biodiversity on land.'
            : 'Start sorting today to keep recyclable materials out of landfills.'}
=======
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {totalSorted > 0
            ? 'Every item safely sorted prevents landfill expansion, halts toxic leachate, and preserves biodiversity on land.'
            : 'Start sorting today to keep recyclable and compostable materials out of landfills.'}
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
        </p>

        {totalSorted === 0 && (
          <button
            type="button"
            onClick={onOpenScanSheet}
<<<<<<< HEAD
            className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm h-11"
=======
            className="btn btn-primary w-full flex items-center justify-center gap-2 text-xs font-bold mt-1 shadow-xs active:scale-[0.98] transition-all"
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
          >
            <ScanLine className="w-4 h-4" />
            <span>{STRINGS.impact.startStreak}</span>
          </button>
        )}
      </div>

<<<<<<< HEAD
      {/* Last 7 Days */}
      <div className="card p-5 border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-[var(--color-text)]">
            {STRINGS.impact.last7Days}
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {streak > 0 ? `${streak} day streak 🔥` : 'No streak yet'}
=======
      {/* Last 7 Days Timeline Strip */}
      <div className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-[var(--color-text)]">
            {STRINGS.impact.last7Days}
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {streak > 0 ? `${streak} day active streak` : STRINGS.impact.startStreak}
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          {last7Days.map((d) => (
            <div key={d.key} className="flex flex-col items-center gap-1.5 flex-1">
              <div
<<<<<<< HEAD
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  d.active
                    ? 'bg-[var(--color-primary-strong)] shadow-sm'
                    : 'bg-[var(--color-surface-sunken)] border border-[var(--color-border)]'
                } ${d.isToday ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}
=======
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  d.active
                    ? 'bg-[var(--color-primary-strong)] text-white shadow-xs'
                    : 'bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
                } ${d.isToday ? 'ring-2 ring-[var(--color-accent)] ring-offset-2' : ''}`}
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                title={d.key}
              >
                {d.active ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                ) : (
<<<<<<< HEAD
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-strong)] opacity-60" />
=======
                  <span className="text-[10px] font-semibold opacity-50">·</span>
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
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

<<<<<<< HEAD
      {/* Category breakdown */}
      <div className="card p-5 border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-[var(--color-text)]">
=======
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
          <h2 className="text-sm font-extrabold text-[var(--color-text)]">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
            {STRINGS.impact.breakdownTitle}
          </h2>
          {history.length > 0 && onGoToHistory && (
            <button
              type="button"
              onClick={onGoToHistory}
              className="text-xs font-bold text-[var(--color-primary-strong)] flex items-center gap-1 hover:underline"
            >
              <span>{STRINGS.impact.seeScans}</span>
              <ArrowRight className="w-3 h-3" />
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
                  <div className="flex items-center gap-2">
<<<<<<< HEAD
                    <CategoryIcon categoryId={catKey} size={14} />
=======
                    <CategoryIcon categoryId={catKey} size={15} />
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
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