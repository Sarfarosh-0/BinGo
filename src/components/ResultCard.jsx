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
    <div className="flex flex-col min-h-full pb-8 animate-in fade-in duration-200" aria-live="polite">
      <TopBar title={STRINGS.result.title} onBack={onBack} />

      <div className="flex flex-col gap-3.5 pt-3">
        {/* ── CONFIDENT ── */}
        {isConfident && (
          <>
            {/* Hero */}
            <section className="card card-hero p-5 relative overflow-hidden">
              {/* Category accent strip */}
              <div
                className="absolute top-0 left-0 bottom-0 w-1"
                style={{ backgroundColor: theme.ink }}
              />

              <div className="flex items-center justify-between gap-4 pl-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryIcon categoryId={categoryId} size={22} />
                    <h2 className="text-2xl font-extrabold text-[var(--color-text)] tracking-tight truncate">
                      {categoryRules.label}
                    </h2>
                  </div>

                  <p className="text-sm font-bold" style={{ color: theme.ink }}>
                    {confidencePct}% confident
                  </p>

                  {/* Confidence bar */}
                  <div
                    role="progressbar"
                    aria-valuenow={confidencePct}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    className="w-full h-1.5 rounded-full bg-[var(--color-surface-sunken)] mt-3 overflow-hidden"
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
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-[var(--color-border)] bg-[var(--color-surface-sunken)] shadow-sm">
                    <img
                      src={result.previewUrl}
                      alt={categoryRules.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white border border-[var(--color-primary-strong)] flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5 text-[var(--color-primary-strong)]" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Disposal steps */}
            <section className="card p-5 border border-[var(--color-border)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {STRINGS.result.howToDispose}
              </span>

              <ol className="mt-3.5 flex flex-col gap-3">
                {categoryRules.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                    <span
                      className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 text-white"
                      style={{ backgroundColor: theme.ink }}
                    >
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* SDG fact */}
            <section className="card card-mint p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Leaf className="w-4 h-4 text-[var(--color-primary-strong)]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary-strong)]">
                  {STRINGS.result.sdgOverline}
                </span>
                <p className="text-xs text-[var(--color-text)] mt-1 leading-relaxed">
                  {categoryRules.sdgFact}
                </p>
              </div>
            </section>

            {/* Feedback row */}
            <section className="card p-4 flex items-center justify-between border border-[var(--color-border)]">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                {feedback ? STRINGS.result.feedbackThanks : STRINGS.result.wasCorrect}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleThumbClick('up')}
                  aria-label="Thumbs up"
                  aria-pressed={feedback === 'up'}
                  className={`btn-icon flex items-center justify-center rounded-xl transition-all ${
                    feedback === 'up'
                      ? 'bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]'
                      : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-transparent'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleThumbClick('down')}
                  aria-label="Thumbs down"
                  aria-pressed={feedback === 'down'}
                  className={`btn-icon flex items-center justify-center rounded-xl transition-all ${
                    feedback === 'down'
                      ? 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border border-[var(--color-warning)]'
                      : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-transparent'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* CTA */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onScanAnother}
                className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-base"
              >
                <Camera className="w-5 h-5" />
                <span>{STRINGS.result.scanAnother}</span>
              </button>
            </div>
          </>
        )}

        {/* ── NOT SURE ── */}
        {!isConfident && (
          <>
            <section className="card card-hero p-5 border border-[#FFE082] bg-[var(--color-warning-soft)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CircleHelp className="w-6 h-6 text-[var(--color-warning)]" />
                    <h2 className="text-2xl font-extrabold text-[var(--color-text)] tracking-tight">
                      {STRINGS.result.notSureTitle}
                    </h2>
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                    {STRINGS.result.notSureMessage}
                  </p>
                </div>

                {result.previewUrl && (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-[var(--color-border)] bg-white shadow-sm">
                    <img
                      src={result.previewUrl}
                      alt="Captured item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="card p-5 border border-[var(--color-border)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                Scanning Tips
              </span>

              <ul className="mt-3.5 flex flex-col gap-2.5">
                <li className="flex items-start gap-2.5 text-sm text-[var(--color-text)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" />
                  <span>{STRINGS.result.tipAnotherAngle}</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-[var(--color-text)]">
                  <Lightbulb className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" />
                  <span>{STRINGS.result.tipOneItem}</span>
                </li>
              </ul>
            </section>

            <div className="pt-1">
              <button
                type="button"
                onClick={onScanAnother}
                className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-base"
              >
                <Camera className="w-5 h-5" />
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