import React from 'react'
import { Recycle, ThumbsUp, ThumbsDown, ChevronRight, Camera } from 'lucide-react'
import { STRINGS } from '../lib/strings'
import { formatDateDisplay } from '../lib/date'
import { getCategoryTheme } from '../lib/categoryTheme'

export function History({ items = [], onOpenItem, onScan }) {
  if (!items || items.length === 0) {
    return (
      <div
        aria-label="Empty Scan History"
        className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)] flex items-center justify-center mb-4 text-[var(--color-primary-strong)]">
          <Recycle className="w-8 h-8" strokeWidth={1.75} />
        </div>
        <h2 className="text-base font-extrabold text-[var(--color-text)] mb-1">
          {STRINGS.history.emptyTitle}
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-[260px] leading-relaxed">
          {STRINGS.history.emptySubtitle}
        </p>
        {onScan && (
          <button
            type="button"
            onClick={onScan}
            className="btn btn-primary mt-5 flex items-center gap-2 text-xs font-bold py-2 px-5 h-auto"
          >
            <Camera className="w-4 h-4 text-white" />
            <span>Scan First Item</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      aria-label="Scan History List"
      className="flex flex-col gap-2 py-2"
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
            className="history-row cursor-pointer group bg-[var(--color-surface)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xs transition-all duration-200"
          >
            {/* Thumbnail */}
            <div className="w-13 h-13 rounded-xl overflow-hidden bg-[var(--color-surface-sunken)] border border-[var(--color-border)] shrink-0 flex items-center justify-center">
              {item.thumb ? (
                <img
                  src={item.thumb}
                  alt={theme.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
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

              <div className="text-xs text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1.5 truncate">
                <span className="font-semibold text-[var(--color-primary-strong)] tabular-nums">
                  {confidencePct}% sure
                </span>
                <span className="text-[var(--color-text-disabled)]">·</span>
                <span className="text-[var(--color-text-muted)]">{formatDateDisplay(item.ts)}</span>
              </div>
            </div>

            {/* User Feedback Icon Indicator */}
            {item.feedback && (
              <div className="shrink-0 pr-1">
                {item.feedback === 'up' && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-success-soft)] text-[var(--color-success)] flex items-center justify-center">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </div>
                )}
                {item.feedback === 'down' && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-warning-soft)] text-[var(--color-warning)] flex items-center justify-center">
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            )}

            <ChevronRight className="w-4 h-4 text-[var(--color-text-disabled)] group-hover:text-[var(--color-text)] transition-colors shrink-0" />
          </div>
        )
      })}
    </div>
  )
}

export default History
