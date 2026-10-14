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
      'Empty and rinse it thoroughly.',
      'Keep dry and free of food residue.',
      'Place in the dry-waste / recycling bin or hand to a recycler.',
    ],
    sdgFact: 'Recycling prevents deforestation and saves valuable virgin raw materials from being extracted.',
  },
  organic: {
    label: 'Organic',
    steps: [
      'Place in the wet-waste bin or composting unit.',
      'Do not mix with plastics, foil, or packaging.',
    ],
    sdgFact: 'Compost restores organic matter to soil, halting degradation and preventing methane release.',
  },
  ewaste: {
    label: 'E-Waste',
    steps: [
      'Do not discard with normal household trash.',
      'Hand over to an authorized e-waste collection center or take-back kiosk.',
    ],
    sdgFact: 'Diverting electronic waste keeps toxic heavy metals like lead and cadmium out of soil ecosystems.',
  },
  hazardous: {
    label: 'Hazardous',
    steps: [
      'Keep sealed in original container if possible.',
      'Never burn, pour down drains, or mix with other waste.',
      'Deliver to a designated hazardous waste depot.',
    ],
    sdgFact: 'Hazardous chemicals contaminate groundwater and degrade topsoil biodiversity for generations.',
  },
  general: {
    label: 'General / Non-recyclable',
    steps: [
      'Wrap securely and place in the non-recyclable bin.',
      'Dispose responsibly to prevent windblown litter.',
    ],
    sdgFact: 'Responsible containment shields open grasslands, rivers, and wildlife habitats from litter contamination.',
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
    if (feedback === val) {
      onFeedback(null)
    } else {
      onFeedback(val)
    }
  }

  return (
    <div className="flex flex-col min-h-full pb-8 animate-in fade-in duration-200" aria-live="polite">
      {/* Top Navigation */}
      <TopBar title={STRINGS.result.title} onBack={onBack} />

      <div className="flex flex-col gap-4 pt-3">
        {/* ================= CONFIDENT RESULT STATE ================= */}
        {isConfident && (
          <>
            {/* Primary Result Hero Card */}
            <section className="card card-hero p-5 sm:p-6 border border-[var(--color-border)] shadow-sm bg-[var(--color-surface)] relative overflow-hidden">
              <div className="flex items-center justify-between gap-4">
                {/* Left: Category info & confidence */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryIcon categoryId={categoryId} size={22} />
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: theme.ink }}
                    >
                      Classified Waste
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight truncate">
                    {categoryRules.label}
                  </h2>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-[var(--color-primary-strong)] tabular-nums">
                      {confidencePct}% confidence
                    </span>
                    <span className="text-xs text-[var(--color-text-disabled)]">·</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">AI Model Verified</span>
                  </div>

                  {/* Confidence progress indicator */}
                  <div
                    role="progressbar"
                    aria-valuenow={confidencePct}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    className="w-full h-2 rounded-full bg-[var(--color-surface-sunken)] mt-3.5 overflow-hidden border border-[var(--color-border)]"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(100, Math.max(12, confidencePct))}%`,
                        backgroundColor: theme.ink,
                      }}
                    />
                  </div>
                </div>

                {/* Right: Photo preview thumbnail */}
                {result.previewUrl && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-[var(--color-border)] bg-[var(--color-surface-sunken)] shadow-xs">
                    <img
                      src={result.previewUrl}
                      alt={categoryRules.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white shadow-xs border border-[var(--color-border)] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-[var(--color-primary-strong)]" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* How to Dispose Steps */}
            <section className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                {STRINGS.result.howToDispose}
              </h3>

              <ol className="mt-3.5 space-y-3">
                {categoryRules.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* SDG 15 Impact Fact */}
            <section className="card p-4 sm:p-5 flex items-start gap-3.5 border border-[var(--color-primary-soft)] bg-[var(--color-surface-alt)] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-[var(--color-border)] text-[var(--color-primary-strong)]">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--color-primary-strong)]">
                  {STRINGS.result.sdgOverline}
                </span>
                <p className="text-xs sm:text-sm text-[var(--color-text)] mt-1 leading-relaxed">
                  {categoryRules.sdgFact}
                </p>
              </div>
            </section>

            {/* Feedback Widget */}
            <section className="card p-4 flex items-center justify-between border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {feedback ? STRINGS.result.feedbackThanks : STRINGS.result.wasCorrect}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleThumbClick('up')}
                  aria-label="Correct classification"
                  aria-pressed={feedback === 'up'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    feedback === 'up'
                      ? 'bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]/40 font-bold'
                      : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Correct</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleThumbClick('down')}
                  aria-label="Incorrect classification"
                  aria-pressed={feedback === 'down'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    feedback === 'down'
                      ? 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border border-[var(--color-warning)]/40 font-bold'
                      : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Incorrect</span>
                </button>
              </div>
            </section>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onScanAnother}
                className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-sm font-bold shadow-xs active:scale-[0.98] transition-all"
              >
                <Camera className="w-4 h-4 text-white" />
                <span>{STRINGS.result.scanAnother}</span>
              </button>
            </div>
          </>
        )}

        {/* ================= NOT SURE / LOW CONFIDENCE STATE ================= */}
        {!isConfident && (
          <>
            <section className="card card-hero p-5 sm:p-6 border border-amber-200 bg-amber-50/60 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CircleHelp className="w-5 h-5 text-amber-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Uncertain Match
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[var(--color-text)] tracking-tight">
                    {STRINGS.result.notSureTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                    {STRINGS.result.notSureMessage}
                  </p>
                </div>

                {result.previewUrl && (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-amber-200 bg-white shadow-xs">
                    <img
                      src={result.previewUrl}
                      alt="Captured item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Tips Card */}
            <section className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                Scanning Suggestions
              </h3>

              <ul className="mt-3.5 space-y-2.5">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--color-text)]">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{STRINGS.result.tipAnotherAngle}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--color-text)]">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{STRINGS.result.tipOneItem}</span>
                </li>
              </ul>
            </section>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onScanAnother}
                className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-sm font-bold shadow-xs active:scale-[0.98] transition-all"
              >
                <Camera className="w-4 h-4 text-white" />
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
