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
    onFeedback(feedback === val ? null : val)
  }

  return (
    <div className="flex flex-col min-h-full pb-8 animate-in fade-in duration-200" aria-live="polite">
<<<<<<< HEAD
=======
      {/* Top Navigation */}
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
      <TopBar title={STRINGS.result.title} onBack={onBack} />

      <div className="flex flex-col gap-3.5 pt-3">
        {/* ── CONFIDENT ── */}
        {isConfident && (
          <>
<<<<<<< HEAD
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
=======
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
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
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
<<<<<<< HEAD
                        width: `${Math.min(100, Math.max(8, confidencePct))}%`,
=======
                        width: `${Math.min(100, Math.max(12, confidencePct))}%`,
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                        backgroundColor: theme.ink,
                      }}
                    />
                  </div>
                </div>

<<<<<<< HEAD
                {/* Preview */}
=======
                {/* Right: Photo preview thumbnail */}
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                {result.previewUrl && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-[var(--color-border)] bg-[var(--color-surface-sunken)] shadow-xs">
                    <img
                      src={result.previewUrl}
                      alt={categoryRules.label}
                      className="w-full h-full object-cover"
                    />
<<<<<<< HEAD
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white border border-[var(--color-primary-strong)] flex items-center justify-center shadow-sm">
=======
                    <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white shadow-xs border border-[var(--color-border)] flex items-center justify-center">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                      <Check className="w-3.5 h-3.5 text-[var(--color-primary-strong)]" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
            </section>

<<<<<<< HEAD
            {/* Disposal steps */}
            <section className="card p-5 border border-[var(--color-border)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
=======
            {/* How to Dispose Steps */}
            <section className="card p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                {STRINGS.result.howToDispose}
              </h3>

<<<<<<< HEAD
              <ol className="mt-3.5 flex flex-col gap-3">
                {categoryRules.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                    <span
                      className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 text-white"
                      style={{ backgroundColor: theme.ink }}
                    >
                      {idx + 1}
=======
              <ol className="mt-3.5 space-y-3">
                {categoryRules.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                      {index + 1}
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

<<<<<<< HEAD
            {/* SDG fact */}
            <section className="card card-mint p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Leaf className="w-4 h-4 text-[var(--color-primary-strong)]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary-strong)]">
=======
            {/* SDG 15 Impact Fact */}
            <section className="card p-4 sm:p-5 flex items-start gap-3.5 border border-[var(--color-primary-soft)] bg-[var(--color-surface-alt)] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-[var(--color-border)] text-[var(--color-primary-strong)]">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--color-primary-strong)]">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                  {STRINGS.result.sdgOverline}
                </span>
                <p className="text-xs sm:text-sm text-[var(--color-text)] mt-1 leading-relaxed">
                  {categoryRules.sdgFact}
                </p>
              </div>
            </section>

<<<<<<< HEAD
            {/* Feedback row */}
            <section className="card p-4 flex items-center justify-between border border-[var(--color-border)]">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
=======
            {/* Feedback Widget */}
            <section className="card p-4 flex items-center justify-between border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                {feedback ? STRINGS.result.feedbackThanks : STRINGS.result.wasCorrect}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleThumbClick('up')}
                  aria-label="Correct classification"
                  aria-pressed={feedback === 'up'}
<<<<<<< HEAD
                  className={`btn-icon flex items-center justify-center rounded-xl transition-all ${
                    feedback === 'up'
                      ? 'bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]'
                      : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-transparent'
=======
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    feedback === 'up'
                      ? 'bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]/40 font-bold'
                      : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
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
<<<<<<< HEAD
                  className={`btn-icon flex items-center justify-center rounded-xl transition-all ${
                    feedback === 'down'
                      ? 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border border-[var(--color-warning)]'
                      : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-transparent'
=======
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    feedback === 'down'
                      ? 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border border-[var(--color-warning)]/40 font-bold'
                      : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Incorrect</span>
                </button>
              </div>
            </section>

            {/* CTA */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onScanAnother}
<<<<<<< HEAD
                className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-base"
              >
                <Camera className="w-5 h-5" />
=======
                className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-sm font-bold shadow-xs active:scale-[0.98] transition-all"
              >
                <Camera className="w-4 h-4 text-white" />
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                <span>{STRINGS.result.scanAnother}</span>
              </button>
            </div>
          </>
        )}

        {/* ── NOT SURE ── */}
        {!isConfident && (
          <>
<<<<<<< HEAD
            <section className="card card-hero p-5 border border-[#FFE082] bg-[var(--color-warning-soft)]">
=======
            <section className="card card-hero p-5 sm:p-6 border border-amber-200 bg-amber-50/60 shadow-sm">
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
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

<<<<<<< HEAD
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
=======
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
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
                </li>
              </ul>
            </section>

            <div className="pt-1">
              <button
                type="button"
                onClick={onScanAnother}
<<<<<<< HEAD
                className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-base"
              >
                <Camera className="w-5 h-5" />
=======
                className="btn btn-primary w-full flex items-center justify-center gap-2.5 text-sm font-bold shadow-xs active:scale-[0.98] transition-all"
              >
                <Camera className="w-4 h-4 text-white" />
>>>>>>> a0ebd175229679f65590e079dcbb9306dfc8a255
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