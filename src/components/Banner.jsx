import React from 'react'
import { RefreshCw, X, TriangleAlert } from 'lucide-react'

export function Banner({ tone = 'error', message, onRetry, onDismiss }) {
  const isError = tone === 'error'
  return (
    <div
      role="alert"
      className={`rounded-2xl px-4 py-3 flex items-start gap-3 border shadow-xs ${
        isError
          ? 'border-[var(--color-error)]/25 bg-[var(--color-error-soft)] text-[var(--color-error)]'
          : 'border-[var(--color-info)]/25 bg-[var(--color-info-soft)] text-[var(--color-info)]'
      }`}
    >
      <TriangleAlert className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <div className="flex items-center gap-1 shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 active:scale-95 transition-all"
            aria-label="Retry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 active:scale-95 transition-all"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Banner
