import React from 'react'
import { Recycle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { STRINGS } from '../lib/strings'
import { formatDateDisplay } from '../lib/date'
import { getCategoryTheme } from '../lib/categoryTheme'

export function History({ items = [], onOpenItem }) {
  if (!items || items.length === 0) {
    return (
      <div
        aria-label="Empty Scan History"
        className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center mb-4">
          <Recycle className="w-10 h-10 text-[var(--color-text-muted)]" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">
          {STRINGS.history.emptyTitle}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] max-w-[240px]">
          {STRINGS.history.emptySubtitle}
        </p>
      </div>
    )
  }

  return (
    <div
      aria-label="Scan History List"
      className="flex flex-col gap-2.5 py-3"
    >
      {items.map((item) => {
        const theme = getCategoryTheme(item.categoryId)
        const confidencePct = Math.round(item.confidence * 100)

        return (
          <div
            key={item.id}
            onClick={() => onOpenItem && onOpenItem(item)}
            role={onOpenItem ? 'button' : undefined}
            tabIndex={onOpenItem ? 0 : undefined}
            className="history-row cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--color-surface-sunken)] border border-[var(--color-border)] shrink-0 flex items-center justify-center">
              {item.thumb ? (
                <img
                  src={item.thumb}
                  alt={theme.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Recycle className="w-6 h-6 text-[var(--color-text-muted)]" />
              )}
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[var(--color-text)] truncate">
                  {theme.label}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: theme.ink }}
                  title={theme.label}
                />
              </div>

              <div className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate">
                <span className="font-semibold text-[var(--color-primary-strong)]">{confidencePct}% sure</span>
                <span className="mx-1.5 opacity-40">·</span>
                <span>{formatDateDisplay(item.ts)}</span>
              </div>
            </div>

            {/* User Feedback Icon Indicator */}
            {item.feedback && (
              <div className="shrink-0 pr-1">
                {item.feedback === 'up' && (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)] flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                )}
                {item.feedback === 'down' && (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-warning-soft)] text-[var(--color-warning)] flex items-center justify-center">
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
