import React from 'react'
import { Recycle, ThumbsUp, ThumbsDown, ChevronRight, Camera } from 'lucide-react'
import { STRINGS } from '../lib/strings'
import { formatDateDisplay } from '../lib/date'
import { getCategoryTheme } from '../lib/categoryTheme'

export function History({ items = [], onOpenItem, onScan }) {
  if (!items || items.length === 0) {
    return (
      <div
        aria-label={STRINGS.a11y.emptyHistory}
        className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-alt)] flex items-center justify-center mb-4 text-[var(--color-primary-strong)]">
          <Recycle className="w-8 h-8" strokeWidth={1.75} />
        </div>
        <h2 className="text-base font-bold text-[var(--color-text)] mb-1">
          {STRINGS.history.emptyTitle}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] max-w-[240px] leading-relaxed">
          {STRINGS.history.emptySubtitle}
        </p>
        {onScan && (
          <button
            type="button"
            onClick={onScan}
            className="btn btn-primary mt-5 flex items-center gap-2.5 text-xs font-bold py-2.5 px-5 h-auto shadow-xs"
          >
            <Camera className="w-4.5 h-4.5 text-white shrink-0" />
            <span>{STRINGS.history.scanFirst}</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      aria-label={STRINGS.a11y.historyList}
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
            className="history-row cursor-pointer group bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-200"
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
                  width={48}
                  height={48}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              ) : (
                <Recycle className="w-6 h-6 text-[var(--color-text-muted)] shrink-0" />
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
            <div className="shrink-0 flex items-center gap-1.5">
              {item.feedback === 'up' && (
                <div className="w-7 h-7 rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)] flex items-center justify-center shrink-0">
                  <ThumbsUp className="w-4 h-4 shrink-0" />
                </div>
              )}
              {item.feedback === 'down' && (
                <div className="w-7 h-7 rounded-full bg-[var(--color-warning-soft)] text-[var(--color-warning)] flex items-center justify-center shrink-0">
                  <ThumbsDown className="w-4 h-4 shrink-0" />
                </div>
              )}
              <ChevronRight className="w-4.5 h-4.5 text-[var(--color-text-disabled)] group-hover:text-[var(--color-text-muted)] transition-colors shrink-0" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default History