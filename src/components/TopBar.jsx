import { ArrowLeft, X } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function TopBar({ title, onBack, onClose }) {
  const iconBtn =
    'flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text)] transition-all duration-150 hover:bg-[var(--color-surface-alt)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]'

  return (
    <header className="sticky top-0 z-30 flex h-[var(--topbar-h)] shrink-0 items-center justify-between rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-glass)] px-3 shadow-[var(--shadow-xs)] backdrop-blur-md">
      <div className="flex h-11 w-11 items-center justify-start">
        {onBack && (
          <button type="button" onClick={onBack} className={iconBtn} aria-label={STRINGS.a11y.goBack}>
            <ArrowLeft className="h-5 w-5" strokeWidth={2.25} />
          </button>
        )}
        {onClose && !onBack && (
          <button type="button" onClick={onClose} className={iconBtn} aria-label={STRINGS.a11y.close}>
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
        )}
      </div>

      <h1 className="truncate px-2 text-center text-base font-bold tracking-tight text-[var(--color-text)]">
        {title}
      </h1>

      <div className="h-11 w-11" aria-hidden="true" />
    </header>
  )
}

export default TopBar