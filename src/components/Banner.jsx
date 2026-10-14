import React from 'react'
import { RefreshCw, X, TriangleAlert, Info } from 'lucide-react'

export function Banner({ tone = 'error', message, onRetry, onDismiss }) {
  const isError = tone === 'error'

  // Presentation-only: buttons inherit the tone color and tint on hover
  const actionBtn =
    'flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-all duration-150 hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)] active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current'

  return (
    <div
      role="alert"
      className={`view-enter-fast flex items-start gap-3 rounded-[var(--radius-lg)] border py-3 pl-4 pr-2 shadow-[var(--shadow-xs)] ${isError
          ? 'border-[color-mix(in_srgb,var(--color-error)_25%,transparent)] bg-[var(--color-error-soft)] text-[var(--color-error)]'
          : 'border-[color-mix(in_srgb,var(--color-info)_25%,transparent)] bg-[var(--color-info-soft)] text-[var(--color-info)]'
        }`}
    >
      {isError
        ? <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
        : <Info className="mt-0.5 h-5 w-5 shrink-0" />
      }
      <p className="flex-1 py-0.5 text-sm font-medium leading-snug text-[var(--color-text)]">
        {message}
      </p>
      <div className="-my-1.5 flex shrink-0 items-center">
        {onRetry && (
          <button type="button" onClick={onRetry} className={actionBtn} aria-label="Retry">
            <RefreshCw className="h-4 w-4 shrink-0" />
          </button>
        )}
        {onDismiss && (
          <button type="button" onClick={onDismiss} className={actionBtn} aria-label="Dismiss">
            <X className="h-4 w-4 shrink-0" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Banner