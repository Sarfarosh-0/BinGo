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

// Exact brand category colors
const CATEGORY_COLORS = {
  recyclable: '#1565C0',
  organic: '#2E7D32',
  ewaste: '#6A3DB8',
  hazardous: '#C62828',
  general: '#5F6B63',
}

const CATEGORY_KEYS = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']

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
      { lvl: 1, title: 'Seedling Sorter', min: 0, max: 60 },
      { lvl: 2, title: 'Soil Guardian', min: 60, max: 160 },
      { lvl: 3, title: 'Forest Protector', min: 160, max: 320 },
      { lvl: 4, title: 'Biodiversity Sentinel', min: 320, max: 550 },
      { lvl: 5, title: 'Zero-Waste Master', min: 550, max: 99999 },
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

  // Gamification Milestones
  const milestones = useMemo(() => {
    const total = impactStats.total
    const organics = impactStats.counts.organic || 0
    const recyclables = impactStats.counts.recyclable || 0
    const toxics = (impactStats.counts.ewaste || 0) + (impactStats.counts.hazardous || 0)
    const activeStreak = useSampleData ? 4 : streak

    return [
      {
        id: 'first_divert',
        title: 'Pioneer Sorter',
        desc: 'Sort your 1st waste item',
        target: 1,
        current: total,
        unlocked: total >= 1,
        icon: Leaf,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      },
      {
        id: 'streak_3',
        title: 'Habit Igniter',
        desc: 'Maintain a 3+ day streak',
        target: 3,
        current: activeStreak,
        unlocked: activeStreak >= 3,
        icon: Zap,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
      },
      {
        id: 'organic_5',
        title: 'Soil Nourisher',
        desc: 'Divert 5+ organic items',
        target: 5,
        current: organics,
        unlocked: organics >= 5,
        icon: Sparkles,
        color: 'text-green-700 bg-green-50 border-green-200',
      },
      {
        id: 'recycling_5',
        title: 'Resource Looper',
        desc: 'Sort 5+ recyclable items',
        target: 5,
        current: recyclables,
        unlocked: recyclables >= 5,
        icon: Award,
        color: 'text-blue-700 bg-blue-50 border-blue-200',
      },
      {
        id: 'toxic_shield',
        title: 'Land Guardian',
        desc: 'Safely divert E-Waste or Hazard',
        target: 1,
        current: toxics,
        unlocked: toxics >= 1,
        icon: ShieldCheck,
        color: 'text-purple-700 bg-purple-50 border-purple-200',
      },
    ]
  }, [impactStats, streak, useSampleData])

  return (
    <div className="flex flex-col gap-4" aria-label="Visual Waste Analytics and Gamification Section">
      {/* Gamification Level Hero Card */}
      <section className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F9D58] to-[#0B7A44] text-white flex items-center justify-center shadow-xs shrink-0">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--color-primary-strong)]">
                  Level {level}
                </span>
                <span className="text-xs text-[var(--color-text-disabled)]">·</span>
                <span className="text-xs font-semibold text-[var(--color-text-secondary)] tabular-nums">
                  {xp} Eco XP
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-[var(--color-text)] tracking-tight">
                {levelTitle}
              </h3>
            </div>
          </div>

          {/* Sample Data Toggle Pill */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setUseSampleData(!useSampleData)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 ${
                useSampleData
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]'
              }`}
              title="Toggle sample trends vs live scan data"
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>{useSampleData ? 'Sample Mode' : 'Live Mode'}</span>
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-[var(--color-text-secondary)]">Progress to Tier {level + 1}</span>
            <span className="text-[var(--color-text)] tabular-nums font-bold">
              {xp} / {nextLevelXp} XP ({xpProgressPct}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--color-surface-sunken)] overflow-hidden border border-[var(--color-border)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0F9D58] to-[#34A853] transition-all duration-700 ease-out"
              style={{ width: `${xpProgressPct}%` }}
            />
          </div>
        </div>

        {/* Quick Gamified Eco Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[var(--color-divider)]">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">CO₂ Averted</span>
            <span className="text-sm font-extrabold text-[var(--color-text)] tabular-nums mt-0.5">
              ~{impactStats.co2AvoidedKg} <span className="text-[10px] font-medium text-[var(--color-text-muted)]">kg</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">Diversion Rate</span>
            <span className="text-sm font-extrabold text-[var(--color-primary-strong)] tabular-nums mt-0.5">
              {impactStats.diversionRate}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">Soil Protected</span>
            <span className="text-sm font-extrabold text-[var(--color-text)] tabular-nums mt-0.5">
              {impactStats.soilAreaProtectedSqFt} <span className="text-[10px] font-medium text-[var(--color-text-muted)]">sq ft</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Visual Chart Section */}
      <section className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
        {/* Chart Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--color-primary-strong)] shrink-0" />
              <h2 className="text-sm font-extrabold text-[var(--color-text)]">
                Items Sorted Over Time
              </h2>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {timeRange === '7d'
                ? 'Daily activity across past 7 days'
                : timeRange === '30d'
                ? 'Daily trends over last 30 days'
                : 'Cumulative waste diversion growth'}
            </p>
          </div>

          {/* Segmented Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Time Range Filter */}
            <div className="flex items-center p-0.5 bg-[var(--color-surface-sunken)] rounded-lg border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setTimeRange('7d')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeRange === '7d'
                    ? 'bg-white text-[var(--color-text)] shadow-xs font-bold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30d')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeRange === '30d'
                    ? 'bg-white text-[var(--color-text)] shadow-xs font-bold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('cumulative')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeRange === 'cumulative'
                    ? 'bg-white text-[var(--color-text)] shadow-xs font-bold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                Total
              </button>
            </div>

            {/* Visual Presentation Mode */}
            <div className="flex items-center p-0.5 bg-[var(--color-surface-sunken)] rounded-lg border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setChartType('bar')}
                title="Stacked Bar Chart"
                className={`p-1.5 rounded-md transition-all ${
                  chartType === 'bar'
                    ? 'bg-white text-[var(--color-primary-strong)] shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => setChartType('area')}
                title="Trend Area Chart"
                className={`p-1.5 rounded-md transition-all ${
                  chartType === 'area'
                    ? 'bg-white text-[var(--color-primary-strong)] shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => setChartType('pie')}
                title="Category Distribution"
                className={`p-1.5 rounded-md transition-all ${
                  chartType === 'pie'
                    ? 'bg-white text-[var(--color-primary-strong)] shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <PieIcon className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 pb-3 border-b border-[var(--color-divider)]">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              categoryFilter === 'all'
                ? 'bg-[var(--color-text)] text-white border-[var(--color-text)]'
                : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]'
            }`}
          >
            All Categories
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
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)]'
                }`}
                style={isSelected ? { backgroundColor: color, borderColor: color } : {}}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : color }}
                />
                <span>{theme.label.split('/')[0].trim()}</span>
              </button>
            )
          })}
        </div>

        {/* Chart Rendering Area */}
        <div className="w-full h-64 sm:h-72 mt-2">
          {chartType === 'pie' ? (
            <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full sm:w-1/2 h-48 sm:h-full">
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
                    >
                      {pieData.map((entry) => (
                        <Cell key={`cell-${entry.key}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Legend Details */}
              <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
                {pieData.map((item) => {
                  const pct =
                    impactStats.total > 0
                      ? Math.round((item.value / impactStats.total) * 100)
                      : 0
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between text-xs font-semibold py-1 px-2 rounded-md hover:bg-[var(--color-surface-sunken)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[var(--color-text)]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 tabular-nums">
                        <span className="text-[var(--color-text-muted)]">{item.value} items</span>
                        <span className="text-[var(--color-text)] font-bold">{pct}%</span>
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
                    <stop offset="5%" stopColor="#0F9D58" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#0F9D58" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
                <XAxis
                  dataKey="displayDate"
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                />
                <Tooltip content={<CustomChartTooltip timeRange={timeRange} />} />
                {timeRange === 'cumulative' ? (
                  categoryFilter === 'all' ? (
                    <Area
                      type="monotone"
                      dataKey="cumulativeTotal"
                      name="Total Cumulative"
                      stroke="#0F9D58"
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
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                />
                <Tooltip content={<CustomChartTooltip timeRange={timeRange} />} />
                {timeRange === 'cumulative' ? (
                  categoryFilter === 'all' ? (
                    <Bar
                      dataKey="cumulativeTotal"
                      name="Total Cumulative"
                      fill="#0F9D58"
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
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-[var(--color-divider)] text-xs text-[var(--color-text-secondary)]">
          {CATEGORY_KEYS.map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[k] }}
              />
              <span className="font-medium">{CATEGORY_THEME[k]?.label.split('/')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gamified Achievements & Milestones */}
      <section className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--color-primary-strong)] shrink-0" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text)]">
              Milestone Badges
            </h3>
          </div>
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">
            {milestones.filter((m) => m.unlocked).length} / {milestones.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {milestones.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                  m.unlocked
                    ? 'bg-[var(--color-surface-alt)] border-[var(--color-primary-soft)]'
                    : 'bg-[var(--color-surface-sunken)] border-[var(--color-border)] opacity-70'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    m.unlocked ? m.color : 'text-[var(--color-text-muted)] bg-white border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text)] truncate">
                      {m.title}
                    </span>
                    {m.unlocked ? (
                      <span className="text-[10px] font-bold text-[var(--color-primary-strong)] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Done
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[var(--color-text-muted)] tabular-nums">
                        {m.current}/{m.target}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
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
    <div className="bg-[#0E2A1F] text-white p-3 rounded-xl shadow-lg border border-[#1d4334] text-xs max-w-[200px]">
      <div className="font-bold border-b border-[#244f3e] pb-1.5 mb-1.5 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[var(--color-accent)] font-extrabold">{totalForDay} items</span>
      </div>
      <div className="flex flex-col gap-1">
        {payload.map((entry) => {
          if (!entry.value && timeRange !== 'cumulative') return null
          return (
            <div key={entry.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="text-gray-200 truncate">{entry.name?.split('/')[0]}</span>
              </div>
              <span className="font-bold text-white tabular-nums">{entry.value}</span>
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
    <div className="bg-[#0E2A1F] text-white p-2.5 rounded-xl shadow-lg border border-[#1d4334] text-xs">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="font-bold text-white">{data.name}</span>
      </div>
      <div className="mt-1 text-gray-200">
        <span className="font-extrabold text-[var(--color-accent)] tabular-nums">{data.value}</span> items sorted
      </div>
    </div>
  )
}

export default WasteAnalyticsChart
