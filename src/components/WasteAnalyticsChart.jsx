import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Trophy,
  Award,
  Zap,
  Leaf,
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { localDateKey } from '../lib/date'
import { CATEGORY_THEME } from '../lib/categoryTheme'
import { STRINGS } from '../lib/strings'

// Brand category colors, mapped to design tokens
const CATEGORY_COLORS = {
  recyclable: 'var(--cat-recyclable)',
  organic: 'var(--cat-organic)',
  ewaste: 'var(--cat-ewaste)',
  hazardous: 'var(--cat-hazardous)',
  general: 'var(--cat-general)',
}

const CATEGORY_KEYS = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']

// Shared look for chart axes
const AXIS_TICK = { fontSize: 12, fill: 'var(--color-text-muted)' }

// Sample timeline for starter/demo mode to showcase gamified visualization immediately
function generateSampleHistory() {
  const sample = []
  const now = Date.now()
  const daysAgo = (d, h = 12) => now - (d * 24 * 60 * 60 * 1000) + (h * 60 * 60 * 1000)

  const template = [
    { cat: 'recyclable', days: 6, count: 2 },
    { cat: 'organic', days: 6, count: 1 },
    { cat: 'recyclable', days: 5, count: 3 },
    { cat: 'general', days: 5, count: 1 },
    { cat: 'organic', days: 4, count: 2 },
    { cat: 'ewaste', days: 4, count: 1 },
    { cat: 'recyclable', days: 3, count: 4 },
    { cat: 'organic', days: 3, count: 3 },
    { cat: 'hazardous', days: 2, count: 1 },
    { cat: 'recyclable', days: 2, count: 2 },
    { cat: 'organic', days: 1, count: 3 },
    { cat: 'general', days: 1, count: 1 },
    { cat: 'recyclable', days: 0, count: 3 },
    { cat: 'organic', days: 0, count: 2 },
    { cat: 'ewaste', days: 0, count: 1 },
  ]

  template.forEach(({ cat, days, count }, idx) => {
    for (let i = 0; i < count; i++) {
      sample.push({
        id: `sample_${idx}_${i}`,
        ts: daysAgo(days, 9 + i * 2),
        categoryId: cat,
        confidence: 0.88 + (i * 0.03),
        feedback: i % 2 === 0 ? 'up' : null,
      })
    }
  })
  return sample
}

export function WasteAnalyticsChart({
  history = [],
  streak = 0,
  byCategory = {},
  totalSorted = 0,
  onOpenScanSheet,
}) {
  const [timeRange, setTimeRange] = useState('7d') // '7d' | '30d' | 'cumulative'
  const [chartType, setChartType] = useState('bar') // 'bar' | 'area' | 'pie'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | categoryKey
  const [useSampleData, setUseSampleData] = useState(() => history.length === 0)

  const activeHistory = useMemo(() => {
    if (useSampleData || history.length === 0) {
      return generateSampleHistory()
    }
    return history
  }, [history, useSampleData])

  // Gamification: Calculate Eco XP and Player Level
  const { xp, level, nextLevelXp, levelTitle, xpProgressPct } = useMemo(() => {
    let earnedXp = 0
    activeHistory.forEach((item) => {
      const cat = item.categoryId
      if (cat === 'hazardous') earnedXp += 30
      else if (cat === 'ewaste') earnedXp += 25
      else if (cat === 'organic') earnedXp += 15
      else if (cat === 'recyclable') earnedXp += 12
      else earnedXp += 6
      if (item.feedback === 'up') earnedXp += 5
    })

    // Streak multiplier
    const effectiveStreak = useSampleData ? 4 : streak
    if (effectiveStreak > 0) {
      const multiplier = Math.min(1.5, 1 + effectiveStreak * 0.05)
      earnedXp = Math.round(earnedXp * multiplier)
    }

    const tiers = [
      { lvl: 1, title: STRINGS.analytics.levels.seedling, min: 0, max: 60 },
      { lvl: 2, title: STRINGS.analytics.levels.soilGuardian, min: 60, max: 160 },
      { lvl: 3, title: STRINGS.analytics.levels.forestProtector, min: 160, max: 320 },
      { lvl: 4, title: STRINGS.analytics.levels.sentinel, min: 320, max: 550 },
      { lvl: 5, title: STRINGS.analytics.levels.zeroWasteMaster, min: 550, max: 99999 },
    ]

    const curTier = tiers.find((t) => earnedXp >= t.min && earnedXp < t.max) || tiers[tiers.length - 1]
    const range = curTier.max - curTier.min
    const curProgress = earnedXp - curTier.min
    const progressPct = curTier.lvl === 5 ? 100 : Math.min(100, Math.round((curProgress / range) * 100))

    return {
      xp: earnedXp,
      level: curTier.lvl,
      nextLevelXp: curTier.max,
      levelTitle: curTier.title,
      xpProgressPct: progressPct,
    }
  }, [activeHistory, streak, useSampleData])

  // Environmental Impact Stats calculated over the dataset
  const impactStats = useMemo(() => {
    const counts = { recyclable: 0, organic: 0, ewaste: 0, hazardous: 0, general: 0 }
    activeHistory.forEach((item) => {
      if (counts[item.categoryId] !== undefined) {
        counts[item.categoryId]++
      }
    })
    const total = activeHistory.length
    const diverted = counts.recyclable + counts.organic + counts.ewaste + counts.hazardous
    const diversionRate = total > 0 ? Math.round((diverted / total) * 100) : 0
    const co2AvoidedKg = (
      counts.recyclable * 0.42 +
      counts.organic * 0.65 +
      counts.ewaste * 1.85 +
      counts.hazardous * 1.3
    ).toFixed(1)
    const soilAreaProtectedSqFt = (diverted * 1.75).toFixed(1)

    return {
      counts,
      total,
      diverted,
      diversionRate,
      co2AvoidedKg,
      soilAreaProtectedSqFt,
    }
  }, [activeHistory])

  // Aggregated data points over time for Recharts
  const chartData = useMemo(() => {
    const today = new Date()
    const daysCount = timeRange === '30d' ? 30 : 7

    // Build timeline buckets
    const buckets = []
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = localDateKey(d)
      const label =
        daysCount === 7
          ? d.toLocaleDateString(undefined, { weekday: 'short' })
          : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      buckets.push({
        dateKey: key,
        displayDate: label,
        recyclable: 0,
        organic: 0,
        ewaste: 0,
        hazardous: 0,
        general: 0,
        total: 0,
        cumulativeTotal: 0,
      })
    }

    const bucketMap = new Map(buckets.map((b) => [b.dateKey, b]))

    activeHistory.forEach((item) => {
      const ts = item.ts || item.timestamp
      if (!ts) return
      const itemKey = localDateKey(new Date(ts))
      const bucket = bucketMap.get(itemKey)
      if (bucket) {
        const cat = item.categoryId
        if (bucket[cat] !== undefined) {
          bucket[cat]++
          bucket.total++
        }
      }
    })

    // Compute cumulative totals
    let runningTotal = 0
    let runningRecyclable = 0
    let runningOrganic = 0
    let runningEwaste = 0
    let runningHazardous = 0
    let runningGeneral = 0

    buckets.forEach((b) => {
      runningTotal += b.total
      runningRecyclable += b.recyclable
      runningOrganic += b.organic
      runningEwaste += b.ewaste
      runningHazardous += b.hazardous
      runningGeneral += b.general

      b.cumulativeTotal = runningTotal
      b.cumRecyclable = runningRecyclable
      b.cumOrganic = runningOrganic
      b.cumEwaste = runningEwaste
      b.cumHazardous = runningHazardous
      b.cumGeneral = runningGeneral
    })

    return buckets
  }, [activeHistory, timeRange])

  // Pie chart breakdown data
  const pieData = useMemo(() => {
    return CATEGORY_KEYS.map((key) => {
      const count = impactStats.counts[key] || 0
      return {
        name: CATEGORY_THEME[key]?.label || key,
        key,
        value: count,
        color: CATEGORY_COLORS[key],
      }
    }).filter((item) => item.value > 0)
  }, [impactStats])

  // Gamification Milestones (color strings are presentation only)
  const milestones = useMemo(() => {
    const total = impactStats.total
    const organics = impactStats.counts.organic || 0
    const recyclables = impactStats.counts.recyclable || 0
    const toxics = (impactStats.counts.ewaste || 0) + (impactStats.counts.hazardous || 0)
    const activeStreak = useSampleData ? 4 : streak

    return [
      {
        id: 'first_divert',
        title: STRINGS.analytics.milestone.pioneerTitle,
        desc: STRINGS.analytics.milestone.pioneerDesc,
        target: 1,
        current: total,
        unlocked: total >= 1,
        icon: Leaf,
        color:
          'text-[var(--color-primary-strong)] bg-[var(--color-primary-soft)] border-[color-mix(in_srgb,var(--color-primary-strong)_25%,transparent)]',
      },
      {
        id: 'streak_3',
        title: STRINGS.analytics.milestone.habitTitle,
        desc: STRINGS.analytics.milestone.habitDesc,
        target: 3,
        current: activeStreak,
        unlocked: activeStreak >= 3,
        icon: Zap,
        color:
          'text-[var(--color-warning)] bg-[var(--color-warning-soft)] border-[color-mix(in_srgb,var(--color-warning)_25%,transparent)]',
      },
      {
        id: 'organic_5',
        title: STRINGS.analytics.milestone.soilTitle,
        desc: STRINGS.analytics.milestone.soilDesc,
        target: 5,
        current: organics,
        unlocked: organics >= 5,
        icon: Sparkles,
        color:
          'text-[var(--cat-organic)] bg-[var(--cat-organic-soft)] border-[color-mix(in_srgb,var(--cat-organic)_25%,transparent)]',
      },
      {
        id: 'recycling_5',
        title: STRINGS.analytics.milestone.loopTitle,
        desc: STRINGS.analytics.milestone.loopDesc,
        target: 5,
        current: recyclables,
        unlocked: recyclables >= 5,
        icon: Award,
        color:
          'text-[var(--cat-recyclable)] bg-[var(--cat-recyclable-soft)] border-[color-mix(in_srgb,var(--cat-recyclable)_25%,transparent)]',
      },
      {
        id: 'toxic_shield',
        title: STRINGS.analytics.milestone.guardianTitle,
        desc: STRINGS.analytics.milestone.guardianDesc,
        target: 1,
        current: toxics,
        unlocked: toxics >= 1,
        icon: ShieldCheck,
        color:
          'text-[var(--cat-ewaste)] bg-[var(--cat-ewaste-soft)] border-[color-mix(in_srgb,var(--cat-ewaste)_25%,transparent)]',
      },
    ]
  }, [impactStats, streak, useSampleData])

  // Shared segmented-control classes
  const segBtn = (active) =>
    `h-9 min-w-[40px] rounded-[var(--radius-xs)] px-3 text-xs transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-focus-ring)] ${active
      ? 'bg-[var(--color-surface)] font-bold text-[var(--color-text)] shadow-[var(--shadow-sm)]'
      : 'font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
    }`

  const iconSegBtn = (active) =>
    `flex h-9 w-9 items-center justify-center rounded-[var(--radius-xs)] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-focus-ring)] ${active
      ? 'bg-[var(--color-surface)] text-[var(--color-primary-strong)] shadow-[var(--shadow-sm)]'
      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
    }`

  return (
    <div className="flex flex-col gap-4" aria-label={STRINGS.analytics.sectionAria}>
      {/* Level Hero Card */}
      <section className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-strong)] text-white shadow-[var(--shadow-scan-btn)]">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--color-primary-strong)]">
                  {STRINGS.analytics.level} {level}
                </span>
                <span className="text-xs text-[var(--color-text-disabled)]">·</span>
                <span className="text-xs font-semibold tabular-nums text-[var(--color-text-secondary)]">
                  {xp} {STRINGS.analytics.ecoXp}
                </span>
              </div>
              <h3 className="truncate text-lg font-extrabold tracking-tight text-[var(--color-text)]">
                {levelTitle}
              </h3>
            </div>
          </div>

          {/* Sample Data Toggle */}
          <button
            type="button"
            onClick={() => setUseSampleData(!useSampleData)}
            aria-pressed={useSampleData}
            className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] ${useSampleData
                ? 'border-[color-mix(in_srgb,var(--color-warning)_35%,transparent)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
              }`}
            title={STRINGS.analytics.sampleToggleTitle}
          >
            <Info className="h-4 w-4 shrink-0" />
            <span>{useSampleData ? STRINGS.analytics.sampleMode : STRINGS.analytics.liveMode}</span>
          </button>
        </div>

        {/* XP Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold">
            <span className="text-[var(--color-text-secondary)]">{STRINGS.analytics.progressToTier} {level + 1}</span>
            <span className="font-bold tabular-nums text-[var(--color-text)]">
              {xp} / {nextLevelXp} {STRINGS.analytics.xpShort} ({xpProgressPct}%)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-sunken)] ring-1 ring-inset ring-[var(--color-border)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary-strong)] to-[var(--color-primary)] transition-all duration-700 ease-out"
              style={{ width: `${xpProgressPct}%` }}
            />
          </div>
        </div>

        {/* Quick Eco Metrics */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--color-divider)] pt-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">{STRINGS.analytics.co2Averted}</span>
            <span className="mt-1 text-base font-extrabold tabular-nums text-[var(--color-text)]">
              ~{impactStats.co2AvoidedKg}{' '}
              <span className="text-xs font-medium text-[var(--color-text-muted)]">{STRINGS.analytics.kg}</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">{STRINGS.analytics.diversion}</span>
            <span className="mt-1 text-base font-extrabold tabular-nums text-[var(--color-primary-strong)]">
              {impactStats.diversionRate}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">{STRINGS.analytics.soilProtected}</span>
            <span className="mt-1 text-base font-extrabold tabular-nums text-[var(--color-text)]">
              {impactStats.soilAreaProtectedSqFt}{' '}
              <span className="text-xs font-medium text-[var(--color-text-muted)]">{STRINGS.analytics.sqFt}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Chart Section */}
      <section className="card p-5">
        {/* Header & Controls */}
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--color-primary-soft)]">
                <BarChart3 className="h-[18px] w-[18px] text-[var(--color-primary-strong)]" />
              </span>
              <h2 className="text-sm font-extrabold text-[var(--color-text)]">
                {STRINGS.analytics.itemsOverTime}
              </h2>
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              {timeRange === '7d'
                ? STRINGS.analytics.range7dDesc
                : timeRange === '30d'
                  ? STRINGS.analytics.range30dDesc
                  : STRINGS.analytics.rangeCumulativeDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Time Range */}
            <div className="flex items-center gap-0.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-0.5">
              <button
                type="button"
                onClick={() => setTimeRange('7d')}
                aria-pressed={timeRange === '7d'}
                className={segBtn(timeRange === '7d')}
              >
                {STRINGS.analytics.range7d}
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30d')}
                aria-pressed={timeRange === '30d'}
                className={segBtn(timeRange === '30d')}
              >
                {STRINGS.analytics.range30d}
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('cumulative')}
                aria-pressed={timeRange === 'cumulative'}
                className={segBtn(timeRange === 'cumulative')}
              >
                {STRINGS.analytics.rangeTotal}
              </button>
            </div>

            {/* Chart Type */}
            <div className="flex items-center gap-0.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-0.5">
              <button
                type="button"
                onClick={() => setChartType('bar')}
                title={STRINGS.analytics.chartStackedBar}
                aria-label={STRINGS.analytics.chartStackedBar}
                aria-pressed={chartType === 'bar'}
                className={iconSegBtn(chartType === 'bar')}
              >
                <BarChart3 className="h-4 w-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => setChartType('area')}
                title={STRINGS.analytics.chartArea}
                aria-label={STRINGS.analytics.chartArea}
                aria-pressed={chartType === 'area'}
                className={iconSegBtn(chartType === 'area')}
              >
                <TrendingUp className="h-4 w-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => setChartType('pie')}
                title={STRINGS.analytics.chartPie}
                aria-label={STRINGS.analytics.chartPie}
                aria-pressed={chartType === 'pie'}
                className={iconSegBtn(chartType === 'pie')}
              >
                <PieIcon className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="no-scrollbar -mx-1 mb-3 flex items-center gap-1.5 overflow-x-auto border-b border-[var(--color-divider)] px-1 pb-3">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            aria-pressed={categoryFilter === 'all'}
            className={`h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] ${categoryFilter === 'all'
                ? 'border-[var(--color-text)] bg-[var(--color-text)] text-white'
                : 'border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
              }`}
          >
            {STRINGS.analytics.allCategories}
          </button>
          {CATEGORY_KEYS.map((catKey) => {
            const theme = CATEGORY_THEME[catKey]
            const isSelected = categoryFilter === catKey
            const color = CATEGORY_COLORS[catKey]

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setCategoryFilter(isSelected ? 'all' : catKey)}
                aria-pressed={isSelected}
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] ${isSelected
                    ? 'text-white shadow-[var(--shadow-sm)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)]'
                  }`}
                style={isSelected ? { backgroundColor: color, borderColor: color } : {}}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : color }}
                />
                <span>{theme.label.split('/')[0].trim()}</span>
              </button>
            )
          })}
        </div>

        {/* Chart Area */}
        <div className="mt-2 h-64 w-full sm:h-72">
          {chartType === 'pie' ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="h-48 w-full sm:h-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={74}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {pieData.map((entry) => (
                        <Cell key={`cell-${entry.key}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Legend */}
              <div className="flex w-full flex-col gap-1 sm:w-1/2">
                {pieData.map((item) => {
                  const pct =
                    impactStats.total > 0
                      ? Math.round((item.value / impactStats.total) * 100)
                      : 0
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-2 rounded-[var(--radius-xs)] px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--color-surface-sunken)]"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate text-[var(--color-text)]">{item.name}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 tabular-nums">
                        <span className="text-[var(--color-text-muted)]">{item.value} {STRINGS.analytics.itemsUnit}</span>
                        <span className="font-bold text-[var(--color-text)]">{pct}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : chartType === 'area' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {CATEGORY_KEYS.map((k) => (
                    <linearGradient key={`grad-${k}`} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CATEGORY_COLORS[k]} stopOpacity={0.65} />
                      <stop offset="95%" stopColor={CATEGORY_COLORS[k]} stopOpacity={0.05} />
                    </linearGradient>
                  ))}
                  <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tick={AXIS_TICK}
                  interval="preserveStartEnd"
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tick={AXIS_TICK}
                />
                <Tooltip content={<CustomChartTooltip timeRange={timeRange} />} />
                {timeRange === 'cumulative' ? (
                  categoryFilter === 'all' ? (
                    <Area
                      type="monotone"
                      dataKey="cumulativeTotal"
                      name={STRINGS.analytics.totalCumulative}
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#grad-total)"
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey={`cum${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}`}
                      name={CATEGORY_THEME[categoryFilter]?.label}
                      stroke={CATEGORY_COLORS[categoryFilter]}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill={`url(#grad-${categoryFilter})`}
                    />
                  )
                ) : categoryFilter === 'all' ? (
                  CATEGORY_KEYS.map((k) => (
                    <Area
                      key={k}
                      type="monotone"
                      stackId="1"
                      dataKey={k}
                      name={CATEGORY_THEME[k]?.label}
                      stroke={CATEGORY_COLORS[k]}
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill={`url(#grad-${k})`}
                    />
                  ))
                ) : (
                  <Area
                    type="monotone"
                    dataKey={categoryFilter}
                    name={CATEGORY_THEME[categoryFilter]?.label}
                    stroke={CATEGORY_COLORS[categoryFilter]}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#grad-${categoryFilter})`}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tick={AXIS_TICK}
                  interval="preserveStartEnd"
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tick={AXIS_TICK}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-surface-sunken)', opacity: 0.7 }}
                  content={<CustomChartTooltip timeRange={timeRange} />}
                />
                {timeRange === 'cumulative' ? (
                  categoryFilter === 'all' ? (
                    <Bar
                      dataKey="cumulativeTotal"
                      name={STRINGS.analytics.totalCumulative}
                      fill="var(--color-primary)"
                      radius={[6, 6, 0, 0]}
                    />
                  ) : (
                    <Bar
                      dataKey={`cum${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}`}
                      name={CATEGORY_THEME[categoryFilter]?.label}
                      fill={CATEGORY_COLORS[categoryFilter]}
                      radius={[6, 6, 0, 0]}
                    />
                  )
                ) : categoryFilter === 'all' ? (
                  CATEGORY_KEYS.map((k, i) => (
                    <Bar
                      key={k}
                      dataKey={k}
                      stackId="a"
                      name={CATEGORY_THEME[k]?.label}
                      fill={CATEGORY_COLORS[k]}
                      radius={i === CATEGORY_KEYS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))
                ) : (
                  <Bar
                    dataKey={categoryFilter}
                    name={CATEGORY_THEME[categoryFilter]?.label}
                    fill={CATEGORY_COLORS[categoryFilter]}
                    radius={[6, 6, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[var(--color-divider)] pt-4 text-xs text-[var(--color-text-secondary)]">
          {CATEGORY_KEYS.map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: CATEGORY_COLORS[k] }}
              />
              <span className="font-medium">{CATEGORY_THEME[k]?.label.split('/')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--color-primary-soft)]">
              <Award className="h-[18px] w-[18px] shrink-0 text-[var(--color-primary-strong)]" />
            </span>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text)]">
              {STRINGS.analytics.milestoneHeading}
            </h3>
          </div>
          <span className="rounded-full bg-[var(--color-surface-sunken)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--color-text-secondary)]">
            {milestones.filter((m) => m.unlocked).length} / {milestones.length} {STRINGS.analytics.unlockedSuffix}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {milestones.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 rounded-[var(--radius-md)] border p-3.5 transition-all duration-150 ${m.unlocked
                    ? 'border-[color-mix(in_srgb,var(--color-primary-strong)_18%,transparent)] bg-[var(--color-surface-alt)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-sunken)] opacity-75'
                  }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border ${m.unlocked
                      ? m.color
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                    }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-[var(--color-text)]">
                      {m.title}
                    </span>
                    {m.unlocked ? (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--color-primary-strong)]">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        {STRINGS.analytics.done}
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--color-text-muted)]">
                        {m.current}/{m.target}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs leading-snug text-[var(--color-text-secondary)]">
                    {m.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

// Custom Tooltip for Bar & Area Charts
function CustomChartTooltip({ active, payload, label, timeRange }) {
  if (!active || !payload || !payload.length) return null

  const totalForDay = payload.reduce((sum, p) => sum + (Number(p.value) || 0), 0)

  return (
    <div className="max-w-[220px] rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-text)] p-3 text-xs text-white shadow-[var(--shadow-lg)]">
      <div className="mb-2 flex items-center justify-between gap-3 border-b border-white/15 pb-2 font-bold">
        <span>{label}</span>
        <span className="font-extrabold text-[var(--color-accent)]">{totalForDay} {STRINGS.analytics.itemsUnit}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {payload.map((entry) => {
          if (!entry.value && timeRange !== 'cumulative') return null
          return (
            <div key={entry.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="truncate text-white/80">{entry.name?.split('/')[0]}</span>
              </div>
              <span className="font-bold tabular-nums text-white">{entry.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Custom Tooltip for Pie Chart
function CustomPieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0]

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-text)] p-3 text-xs text-white shadow-[var(--shadow-lg)]">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="font-bold text-white">{data.name}</span>
      </div>
      <div className="mt-1 text-white/80">
        <span className="font-extrabold tabular-nums text-[var(--color-accent)]">{data.value}</span> {STRINGS.analytics.itemsSortedUnit}
      </div>
    </div>
  )
}

export default WasteAnalyticsChart