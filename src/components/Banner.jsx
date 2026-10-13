import React from 'react'
import { RefreshCw, X } from 'lucide-react'

export function Banner({ tone = 'error', message, onRetry, onDismiss }) {
  const isError = tone === 'error'
  return (
    <div
      role="alert"
      className={`surface-flat rounded-2xl px-4 py-3 flex items-start gap-3 border ${
        isError
          ? 'border-[var(--coral-500)]/40 bg-[var(--coral-500)]/10'
          : 'border-[var(--aqua-400)]/40 bg-[var(--aqua-400)]/10'
      }`}
    >
      <p className="flex-1 text-sm text-white/90 leading-snug">{message}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all"
            aria-label="Retry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all"
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
