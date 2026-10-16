import { Award, ArrowRight } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function ImpactBar({ totalSorted = 0, onViewAnalytics }) {
  // Determine next milestone
  const milestones = [5, 10, 25, 50, 100, 250, 500]
  const nextTarget = milestones.find((m) => m > totalSorted) || totalSorted + 50
  const progressPct = Math.min(100, Math.round((totalSorted / nextTarget) * 100))

  return (
    <div className="card flex flex-col gap-4 p-4 sm:p-5" aria-label={STRINGS.a11y.impactSummary}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {STRINGS.home.ecologicalImpact}
        </span>
        {onViewAnalytics && (
          <button
            type="button"
            onClick={onViewAnalytics}
            className="-mr-2 flex min-h-[44px] items-center gap-1.5 rounded-[var(--radius-sm)] px-2 text-sm font-bold text-[var(--color-primary-strong)] transition-colors duration-150 hover:bg-[var(--color-primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
          >
            <span>{STRINGS.home.analytics}</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Items sorted */}
        <div className="flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
              {STRINGS.home.itemsSorted}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--color-primary-soft)]">
              <Award className="h-[18px] w-[18px] text-[var(--color-primary-strong)]" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-nums tracking-tight text-[var(--color-text)]">
              {totalSorted}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">{STRINGS.home.itemsUnit}</span>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <span>{STRINGS.home.goal}</span>
              <span className="font-semibold tabular-nums text-[var(--color-text)]">
                {totalSorted}/{nextTarget}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary-strong),var(--color-primary))] transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactBar