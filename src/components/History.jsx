import React from 'react'
import { Recycle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { STRINGS } from '../lib/strings'
import { formatDateDisplay } from '../lib/date'

const CATEGORY_DOT_CLASSES = {
  recyclable: 'bg-[var(--emerald-400)]',
  organic: 'bg-[var(--lime-mist)]',
  ewaste: 'bg-[var(--aqua-400)]',
  hazardous: 'bg-[var(--coral-500)]',
  general: 'bg-white/60',
}

const CATEGORY_LABELS = {
  recyclable: 'Recyclable',
  organic: 'Organic',
  ewaste: 'E-Waste',
  hazardous: 'Hazardous',
  general: 'General / Non-recyclable',
}

export function History({ items = [], onOpenItem }) {
  if (!items || items.length === 0) {
    return (
      <div 
        aria-label="Empty Scan History"
        className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Recycle className="w-10 h-10 text-white/30" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">
          {STRINGS.history.emptyTitle}
        </h2>
        <p className="text-sm text-white/60 max-w-[240px]">
          {STRINGS.history.emptySubtitle}
        </p>
      </div>
    )
  }

  return (
    <div 
      aria-label="Scan History List"
      className="flex flex-col gap-3 py-2"
    >
      {items.map((item) => {
        const dotClass = CATEGORY_DOT_CLASSES[item.categoryId] || 'bg-white/50'
        const label = CATEGORY_LABELS[item.categoryId] || item.categoryId
        const confidencePct = Math.round(item.confidence * 100)

        return (
          <div
            key={item.id}
            onClick={() => onOpenItem && onOpenItem(item)}
            role={onOpenItem ? 'button' : undefined}
            tabIndex={onOpenItem ? 0 : undefined}
            className="surface-flat rounded-2xl p-3 flex items-center gap-3.5 min-h-[72px] transition-all hover:bg-white/[0.12] active:scale-[0.99] cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/30 border border-white/10 shrink-0 flex items-center justify-center">
              {item.thumb ? (
                <img
                  src={item.thumb}
                  alt={label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Recycle className="w-6 h-6 text-white/30" />
              )}
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white truncate">
                  {label}
                </span>
                <span 
                  className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} 
                  title={label} 
                />
              </div>

              <div className="text-xs text-white/60 mt-0.5 truncate">
                <span>{confidencePct}% sure</span>
                <span className="mx-1.5 opacity-50">·</span>
                <span>{formatDateDisplay(item.ts)}</span>
              </div>
            </div>

            {/* User Feedback Icon Indicator */}
            {item.feedback && (
              <div className="shrink-0 pr-1">
                {item.feedback === 'up' && (
                  <div className="w-8 h-8 rounded-full bg-[var(--emerald-500)]/20 border border-[var(--emerald-400)]/30 flex items-center justify-center text-[var(--emerald-400)]">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                )}
                {item.feedback === 'down' && (
                  <div className="w-8 h-8 rounded-full bg-[var(--coral-500)]/20 border border-[var(--coral-500)]/30 flex items-center justify-center text-[var(--coral-500)]">
                    <ThumbsDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default History
