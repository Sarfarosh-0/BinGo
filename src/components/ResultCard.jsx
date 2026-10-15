import React from 'react'
import {
  Check,
  CircleHelp,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Leaf,
  Lightbulb,
} from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import { TopBar } from './TopBar'
import { STRINGS } from '../lib/strings'
import { getCategoryTheme } from '../lib/categoryTheme'

const DEFAULT_CATEGORY_RULES = {
  recyclable: {
    label: 'Recyclable',
    steps: [
      'Empty and rinse it.',
      'Keep it dry.',
      'Put it in the dry-waste bin or give it to a kabadiwala or recycler.',
    ],
    sdgFact: 'Recycling reduces demand for new raw material taken from forests and land.',
  },
  organic: {
    label: 'Organic',
    steps: [
      'Put it in the wet-waste bin or a compost pit.',
      "Don't mix it with plastic.",
    ],
    sdgFact: 'Compost returns nutrients to soil instead of rotting in landfills.',
  },
  ewaste: {
    label: 'E-Waste',
    steps: [
      "Don't put it in household waste.",
      'Hand it to an authorised e-waste collector or a take-back counter.',
    ],
    sdgFact: 'Toxic metals from dumped electronics can leak into soil and harm land ecosystems.',
  },
  hazardous: {
    label: 'Hazardous',
    steps: [
      'Keep it separate and sealed.',
      "Don't burn, flush or mix it.",
      'Give it to a hazardous-waste collection point.',
    ],
    sdgFact: 'Chemicals and batteries that reach the ground contaminate soil and the life that depends on it.',
  },
  general: {
    label: 'General / Non-recyclable',
    steps: [
      'Wrap it and put it in the general dry non-recyclable bin.',
      "Don't litter.",
    ],
    sdgFact: 'Waste left on open land damages soil and habitats, so proper disposal protects them.',
  },
}

export function ResultCard({
  result,
  rules,
  feedback,
  onFeedback,
  onScanAnother,
  onBack,
}) {
  if (!result) return null

  const isConfident = result.kind === 'confident'
  const categoryId = result.categoryId || 'general'
  const categoryRules =
    rules?.categories?.[categoryId] ||
    DEFAULT_CATEGORY_RULES[categoryId] ||
    DEFAULT_CATEGORY_RULES.general
  const theme = getCategoryTheme(categoryId)
  const confidencePct = Math.round((result.confidence || 0) * 100)

  const handleThumbClick = (val) => {
    onFeedback(feedback === val ? null : val)
  }

  return (
    <div className="view-enter-fast flex min-h-full flex-col pb-8" aria-live="polite">
      <TopBar title={STRINGS.result.title} onBack={onBack} />

      <div className="flex flex-col gap-4 pt-4">
        {/* ── CONFIDENT ── */}
        {isConfident && (
          <>
            {/* Hero */}
            <section
              className="card card-hero relative overflow-hidden p-5"
              style={{
                background: `linear-gradient(135deg, ${theme.soft} 0%, var(--color-surface) 65%)`,
              }}
            >
              <div
                className="absolute bottom-0 left-0 top-0 w-1.5"
                style={{ backgroundColor: theme.ink }}
              />

              <div className="flex items-center justify-between gap-4 pl-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <CategoryIcon categoryId={categoryId} size={28} />
                    <h2 className="truncate text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
                      {categoryRules.label}
                    </h2>
                  </div>

                  <p className="text-sm font-bold" style={{ color: theme.ink }}>
                    {confidencePct}% {STRINGS.result.confidentLabel}
                  </p>

                  {/* Confidence bar */}
                  <div
                    role="progressbar"
                    aria-valuenow={confidencePct}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface)]/70 ring-1 ring-inset ring-[var(--color-border)]"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(100, Math.max(8, confidencePct))}%`,
                        backgroundColor: theme.ink,
                      }}
                    />
                  </div>
                </div>

                {/* Preview */}
                {result.previewUrl && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border-2 border-[var(--color-surface)] bg-[var(--color-surface-sunken)] shadow-[var(--shadow-md)] sm:h-28 sm:w-28">
                    <img
                      src={result.previewUrl}
                      alt={categoryRules.label}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-primary-strong)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                      <Check className="h-4 w-4 shrink-0 text-[var(--color-primary-strong)]" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Disposal steps */}
            <section className="card p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {STRINGS.result.howToDispose}
              </span>

              <ol className="mt-4 flex flex-col gap-3.5">
                {categoryRules.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                    <span
                      className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: theme.ink }}
                    >
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* SDG fact */}
            <section className="card card-mint flex items-start gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                <Leaf className="h-[18px] w-[18px] shrink-0 text-[var(--color-primary-strong)]" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-strong)]">
                  {STRINGS.result.sdgOverline}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text)]">
                  {categoryRules.sdgFact}
                </p>
              </div>
            </section>

            {/* Feedback row */}
            <section className="card flex items-center justify-between gap-3 p-4">
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
                {feedback ? STRINGS.result.feedbackThanks : STRINGS.result.wasCorrect}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleThumbClick('up')}
                  aria-label={STRINGS.a11y.thumbsUp}
                  aria-pressed={feedback === 'up'}
                  className={`btn-icon flex items-center justify-center rounded-full border transition-all duration-150 ${feedback === 'up'
                      ? 'border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success)]'
                      : 'border-transparent bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                >
                  <ThumbsUp className="h-[18px] w-[18px] shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleThumbClick('down')}
                  aria-label={STRINGS.a11y.thumbsDown}
                  aria-pressed={feedback === 'down'}
                  className={`btn-icon flex items-center justify-center rounded-full border transition-all duration-150 ${feedback === 'down'
                      ? 'border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]'
                      : 'border-transparent bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                >
                  <ThumbsDown className="h-[18px] w-[18px] shrink-0" />
                </button>
              </div>
            </section>

            {/* CTA */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onScanAnother}
                className="btn btn-primary w-full gap-2.5 text-base"
              >
                <Camera className="h-5 w-5" />
                <span>{STRINGS.result.scanAnother}</span>
              </button>
            </div>
          </>
        )}

        {/* ── NOT SURE ── */}
        {!isConfident && (
          <>
            <section className="card card-hero border-[color-mix(in_srgb,var(--color-warning)_25%,transparent)] bg-[var(--color-warning-soft)] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <CircleHelp className="h-7 w-7 shrink-0 text-[var(--color-warning)]" />
                    <h2 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
                      {STRINGS.result.notSureTitle}
                    </h2>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-[var(--color-text-secondary)]">
                    {STRINGS.result.notSureMessage}
                  </p>
                </div>

                {result.previewUrl && (
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border-2 border-[var(--color-surface)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] sm:h-28 sm:w-28">
                    <img
                      src={result.previewUrl}
                      alt={STRINGS.result.capturedItemAlt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="card p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {STRINGS.result.scanningTips}
              </span>

              <ul className="mt-4 flex flex-col gap-3">
                <li className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-warning-soft)]">
                    <Lightbulb className="h-4 w-4 text-[var(--color-warning)]" />
                  </span>
                  <span className="pt-1 leading-relaxed">{STRINGS.result.tipAnotherAngle}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-warning-soft)]">
                    <Lightbulb className="h-4 w-4 text-[var(--color-warning)]" />
                  </span>
                  <span className="pt-1 leading-relaxed">{STRINGS.result.tipOneItem}</span>
                </li>
              </ul>
            </section>

            <div className="pt-1">
              <button
                type="button"
                onClick={onScanAnother}
                className="btn btn-primary w-full gap-2.5 text-base"
              >
                <Camera className="h-5 w-5" />
                <span>{STRINGS.result.scanAnother}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ResultCard