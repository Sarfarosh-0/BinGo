import React from 'react'
import { Recycle, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react'
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
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-alt)] flex items-center justify-center mb-4">
          <Recycle className="w-8 h-8 text-[var(--color-text-muted)]" strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-bold text-[var(--color-text)] mb-1">
          {STRINGS.history.emptyTitle}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] max-w-[220px] leading-relaxed">
          {STRINGS.history.emptySubtitle}
        </p>
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
            onKeyDown={onOpenItem ? (e) => e.key === 'Enter' && onOpenItem(item) : undefined}
            className="history-row cursor-pointer group"
          >
            {/* Category color bar */}
            <div
              className="w-1 self-stretch rounded-full shrink-0"
              style={{ backgroundColor: theme.ink, opacity: 0.7 }}
            />

            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-surface-sunken)] border border-[var(--color-border)] shrink-0 flex items-center justify-center">
              {item.thumb ? (
                <img
                  src={item.thumb}
                  alt={theme.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Recycle className="w-5 h-5 text-[var(--color-text-muted)]" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[var(--color-text)] truncate">
                  {theme.label}
                </span>
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate flex items-center gap-1.5">
                <span className="font-semibold" style={{ color: theme.ink }}>{confidencePct}%</span>
                <span className="opacity-40">·</span>
                <span>{formatDateDisplay(item.ts)}</span>
              </div>
            </div>

            {/* Feedback indicator or chevron */}
            <div className="shrink-0 flex items-center">
              {item.feedback === 'up' && (
                <div className="w-7 h-7 rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)] flex items-center justify-center">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </div>
              )}
              {item.feedback === 'down' && (
                <div className="w-7 h-7 rounded-full bg-[var(--color-warning-soft)] text-[var(--color-warning)] flex items-center justify-center">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </div>
              )}
              {!item.feedback && (
                <ChevronRight className="w-4 h-4 text-[var(--color-text-disabled)] group-hover:text-[var(--color-text-muted)] transition-colors" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default History