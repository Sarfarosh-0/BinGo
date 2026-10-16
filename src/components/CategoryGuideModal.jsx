import React, { useState, useEffect, useRef } from 'react'
import { X, Check, AlertTriangle, Leaf, Recycle, Loader2 } from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import { CATEGORY_THEME } from '../lib/categoryTheme'
import { STRINGS } from '../lib/strings'
import { useModalA11y } from '../hooks/useModalA11y'

const CATEGORY_KEYS = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']

export function CategoryGuideModal({ isOpen, initialCategory = 'recyclable', onClose, rules }) {
  const [selectedKey, setSelectedKey] = useState(initialCategory)
  const dialogRef = useRef(null)
  useModalA11y({ isOpen, onClose, containerRef: dialogRef })

  useEffect(() => {
    if (initialCategory) {
      setSelectedKey(initialCategory)
    }
  }, [initialCategory])

  if (!isOpen) return null

  // Guide content is served from public/rules.json so the guide and the scan
  // result share one source of truth. rules loads on mount; if the user opens
  // the guide before it resolves, show a brief loading state.
  if (!rules?.categories) {
    return (
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5"
      >
        <div
          className="fixed inset-0 bg-[color-mix(in_srgb,var(--color-text)_50%,transparent)] backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="view-enter-fast relative z-10 flex w-full max-w-[620px] items-center justify-center gap-3 rounded-t-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-lg)] sm:rounded-[var(--radius-2xl)]">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[var(--color-primary-strong)]" />
          <span id="guide-title" className="text-sm font-semibold text-[var(--color-text-secondary)]">
            {STRINGS.guide.loading}
          </span>
        </div>
      </div>
    )
  }

  const active = rules.categories[selectedKey] || rules.categories.recyclable
  const theme = CATEGORY_THEME[selectedKey] || CATEGORY_THEME.recyclable

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[color-mix(in_srgb,var(--color-text)_50%,transparent)] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog (bottom sheet on mobile, centered card on sm+) */}
      <div className="view-enter-fast relative z-10 flex max-h-[92dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-t-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] sm:max-h-[90dvh] sm:rounded-[var(--radius-2xl)]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-divider)] px-5 pb-4 pt-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-primary-strong)_16%,transparent)] bg-[var(--color-surface-alt)] text-[var(--color-primary-strong)]">
              <Recycle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2
                id="guide-title"
                className="text-base font-extrabold tracking-tight text-[var(--color-text)]"
              >
                {STRINGS.guide.title}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {STRINGS.guide.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            aria-label={STRINGS.guide.closeAria}
          >
            <X className="h-5 w-5 shrink-0" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="no-scrollbar flex shrink-0 items-center gap-2 overflow-x-auto px-5 py-3">
          {CATEGORY_KEYS.map((k) => {
            const isCur = selectedKey === k
            const th = CATEGORY_THEME[k]
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelectedKey(k)}
                aria-pressed={isCur}
                className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] ${isCur
                    ? 'border-transparent text-white shadow-[var(--shadow-sm)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]'
                  }`}
                style={isCur ? { backgroundColor: th.ink } : {}}
              >
                <CategoryIcon categoryId={k} size={16} inheritColor={isCur} />
                <span>{th.label.split('/')[0].trim()}</span>
              </button>
            )
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-5 pt-1">
          {/* Hero */}
          <div
            className="rounded-[var(--radius-lg)] border p-4 transition-all duration-150"
            style={{
              backgroundColor: `color-mix(in srgb, ${theme.soft} 70%, var(--color-surface))`,
              borderColor: `color-mix(in srgb, ${theme.ink} 25%, transparent)`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span
                  className="block text-xs font-black uppercase tracking-wider"
                  style={{ color: theme.ink }}
                >
                  {active.binColor}
                </span>
                <h3 className="mt-1 text-lg font-black leading-snug text-[var(--color-text)]">
                  {active.title}
                </h3>
              </div>
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
                style={{ border: `1px solid color-mix(in srgb, ${theme.ink} 25%, transparent)` }}
              >
                <CategoryIcon categoryId={selectedKey} size={24} />
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {active.tips}
            </p>
          </div>

          {/* Accepted */}
          <div className="space-y-2.5">
            <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-success)]">
              <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              <span>{STRINGS.guide.acceptedHeading}</span>
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {active.accepted.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-3 text-sm font-medium leading-snug text-[var(--color-text)]"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)]"
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Not accepted */}
          <div className="space-y-2.5">
            <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--color-warning)]">
              <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={2.25} />
              <span>{STRINGS.guide.rejectedHeading}</span>
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {active.notAccepted.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-warning)_22%,transparent)] bg-[var(--color-warning-soft)] p-3 text-sm font-medium leading-snug text-[var(--color-text)]"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-warning)_18%,transparent)] text-[var(--color-warning)]"
                    aria-hidden="true"
                  >
                    <X className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ecological Fact */}
          <div className="card-mint flex items-start gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
              <Leaf className="h-[18px] w-[18px] text-[var(--color-primary-strong)]" />
            </div>
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-[var(--color-primary-strong)]">
                {STRINGS.guide.sdgHeading}
              </span>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {active.guideFact}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-[var(--color-divider)] bg-[var(--color-surface)] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary h-11 w-full px-6 text-sm sm:w-auto"
          >
            {STRINGS.guide.footerCta}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryGuideModal