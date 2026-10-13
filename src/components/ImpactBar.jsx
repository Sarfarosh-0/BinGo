import React from 'react'
import { Flame, Leaf } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function ImpactBar({ totalSorted = 0, streak = 0 }) {
  return (
    <section 
      aria-label="Environmental Impact"
      className="surface-glass-strong rounded-3xl p-5 relative overflow-hidden border border-white/20"
    >
      {/* Decorative leaf icon overlapping top right */}
      <Leaf 
        className="absolute -top-3 -right-3 w-20 h-20 text-white/[0.12] pointer-events-none rotate-12" 
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <h2 className="text-sm font-semibold text-white/90 tracking-wide mb-3 flex items-center gap-1.5">
        <span>{STRINGS.home.impactTitle}</span>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Metric 1: Items sorted */}
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold text-[var(--lime-mist)] tracking-tight">
            {totalSorted}
          </span>
          <span className="text-xs font-medium text-white/65 mt-0.5">
            {STRINGS.home.itemsSorted}
          </span>
        </div>

        {/* Metric 2: Day streak */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`text-3xl font-extrabold tracking-tight ${
              streak > 0 ? 'text-[var(--lime-mist)]' : 'text-white/45'
            }`}>
              {streak}
            </span>
            <Flame 
              className={`w-6 h-6 ${
                streak > 0 ? 'text-[var(--amber-400)] fill-[var(--amber-400)]/80' : 'text-white/30'
              }`}
              strokeWidth={2}
            />
          </div>
          <span className="text-xs font-medium text-white/65 mt-0.5">
            {STRINGS.home.dayStreak}
          </span>
        </div>
      </div>
    </section>
  )
}

export default ImpactBar
