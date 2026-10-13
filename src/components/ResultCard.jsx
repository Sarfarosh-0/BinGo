<<<<<<< HEAD
import React, { useState } from 'react'
import { CircleHelp, ThumbsUp, ThumbsDown, Check, Camera } from 'lucide-react'
import { TopBar } from './TopBar'
import { CategoryIcon } from './CategoryIcon'
import { STRINGS } from '../lib/strings'

function ConfidenceBar({ value, toneVar }) {
  const pct = Math.round(value * 100)
  return (
    <div
      className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Confidence ${pct}%`}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: `var(${toneVar})` }}
      />
    </div>
  )
}

/** Confident result state (>= 60% and not background) */
function ConfidentResult({ current, rules, onFeedback, onScanAnother }) {
  const [feedbackGiven, setFeedbackGiven] = useState(current.feedback || null)
  const category = rules.categories[current.categoryId]
  if (!category) return null

  const toneVar =
    {
      accent: '--emerald-400',
      highlight: '--lime-mist',
      info: '--aqua-400',
      error: '--coral-500',
      muted: '--color-text-muted',
    }[category.tone] || '--emerald-400'

  const pct = Math.round(current.confidence * 100)

  const handleFeedback = (val) => {
    setFeedbackGiven(val)
    onFeedback(val)
  }

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Primary result card */}
      <section className="surface-glass-strong rounded-3xl p-5 border border-white/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0" aria-live="polite">
            <div className="flex items-center gap-2.5">
              <CategoryIcon iconName={category.iconName} tone={category.tone} size={26} />
              <h2 className="text-2xl font-black text-white truncate">{category.label}</h2>
            </div>
            <p className="text-sm text-white/70 mt-1 font-medium">{pct}% sure</p>
            <ConfidenceBar value={current.confidence} toneVar={toneVar} />
          </div>

          {/* Photo thumbnail with check badge */}
          {current.thumbUrl && (
            <div className="relative shrink-0">
              <img
                src={current.thumbUrl}
                alt={category.label}
                className="w-24 h-24 rounded-2xl object-cover border border-white/20"
              />
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[var(--emerald-500)] border-2 border-[var(--forest-800)] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Disposal steps */}
      <section>
        <h3 className="text-lg font-bold text-white mb-2">{STRINGS.result.howToDispose}</h3>
        <div className="surface-glass rounded-2xl p-4 border border-white/15">
          <ol className="flex flex-col">
            {category.steps.map((step, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 py-2.5 ${
                  i < category.steps.length - 1 ? 'border-b border-[var(--color-divider)]' : ''
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-[var(--emerald-500)]/25 border border-[var(--emerald-400)]/40 text-[var(--emerald-400)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-white/90 leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SDG 15 fact */}
      <section className="surface-glass rounded-2xl p-4 border border-white/15">
        <p className="text-[10px] font-bold tracking-widest text-[var(--lime-mist)] uppercase mb-1.5">
          {STRINGS.result.sdgOverline}
        </p>
        <p className="text-sm text-white/85 leading-snug">{category.sdgFact}</p>
      </section>

      {/* Feedback row */}
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-sm text-white/75">
          {feedbackGiven ? STRINGS.result.feedbackThanks : STRINGS.result.wasCorrect}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleFeedback('up')}
            aria-label="Thumbs up"
            aria-pressed={feedbackGiven === 'up'}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
              feedbackGiven === 'up'
                ? 'bg-[var(--emerald-500)]/25 border-[var(--emerald-400)]/50 text-[var(--emerald-400)]'
                : 'bg-white/8 border-white/15 text-white/70 hover:bg-white/15'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleFeedback('down')}
            aria-label="Thumbs down"
            aria-pressed={feedbackGiven === 'down'}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
              feedbackGiven === 'down'
                ? 'bg-[var(--coral-500)]/25 border-[var(--coral-500)]/50 text-[var(--coral-500)]'
                : 'bg-white/8 border-white/15 text-white/70 hover:bg-white/15'
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scan another CTA */}
      <button
        type="button"
        onClick={onScanAnother}
        className="btn-primary rounded-full py-4 px-6 flex items-center justify-center gap-2.5 w-full font-semibold text-base min-h-[48px]"
      >
        <Camera className="w-5 h-5" />
        <span>{STRINGS.result.scanAnother}</span>
      </button>
    </div>
  )
}

/** Not-sure result state (< 60% or background top) */
function NotSureResult({ rules, onScanAnother }) {
  const tips = rules.fallback?.tips || [
    STRINGS.result.tipAnotherAngle,
    STRINGS.result.tipOneItem,
  ]

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Warning card */}
      <section className="surface-glass-strong rounded-3xl p-5 border border-white/20" aria-live="polite">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--amber-400)]/15 border border-[var(--amber-400)]/35 flex items-center justify-center shrink-0">
            <CircleHelp className="w-6 h-6 text-[var(--amber-400)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-white">{rules.fallback?.title || STRINGS.result.notSureTitle}</h2>
            <p className="text-sm text-white/70 mt-1">{rules.fallback?.message || STRINGS.result.notSureMessage}</p>
          </div>
        </div>
      </section>

      {/* Tips card */}
      <section className="surface-glass rounded-2xl p-4 border border-white/15">
        <div className="flex flex-col gap-2.5">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-white/85">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime-mist)] shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Scan another CTA */}
      <button
        type="button"
        onClick={onScanAnother}
        className="btn-primary rounded-full py-4 px-6 flex items-center justify-center gap-2.5 w-full font-semibold text-base min-h-[48px]"
      >
        <Camera className="w-5 h-5" />
        <span>{STRINGS.result.scanAnother}</span>
      </button>
    </div>
  )
}

export function ResultCard({ current, rules, onFeedback, onScanAnother, onBack }) {
  if (!current || !rules) return null

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title={STRINGS.result.title} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {current.kind === 'result' ? (
          <ConfidentResult
            current={current}
            rules={rules}
            onFeedback={onFeedback}
            onScanAnother={onScanAnother}
          />
        ) : (
          <NotSureResult rules={rules} onScanAnother={onScanAnother} />
        )}
=======
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

const DEFAULT_CATEGORY_RULES = {
  recyclable: {
    label: 'Recyclable',
    steps: [
      'Empty and rinse it.',
      'Keep it dry.',
      'Put it in the dry-waste bin or give it to a kabadiwala or recycler.',
    ],
    sdgFact: 'Recycling reduces demand for new raw material taken from forests and land.',
    toneColor: 'bg-[var(--emerald-400)]',
  },
  organic: {
    label: 'Organic',
    steps: [
      'Put it in the wet-waste bin or a compost pit.',
      "Don't mix it with plastic.",
    ],
    sdgFact: 'Compost returns nutrients to soil instead of rotting in landfills.',
    toneColor: 'bg-[var(--lime-mist)]',
  },
  ewaste: {
    label: 'E-Waste',
    steps: [
      "Don't put it in household waste.",
      'Hand it to an authorised e-waste collector or a take-back counter.',
    ],
    sdgFact: 'Toxic metals from dumped electronics can leak into soil and harm land ecosystems.',
    toneColor: 'bg-[var(--aqua-400)]',
  },
  hazardous: {
    label: 'Hazardous',
    steps: [
      'Keep it separate and sealed.',
      "Don't burn, flush or mix it.",
      'Give it to a hazardous-waste collection point.',
    ],
    sdgFact: 'Chemicals and batteries that reach the ground contaminate soil and the life that depends on it.',
    toneColor: 'bg-[var(--coral-500)]',
  },
  general: {
    label: 'General / Non-recyclable',
    steps: [
      'Wrap it and put it in the general dry non-recyclable bin.',
      "Don't litter.",
    ],
    sdgFact: 'Waste left on open land damages soil and habitats, so proper disposal protects them.',
    toneColor: 'bg-white/60',
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
  const isConfident = result.kind === 'confident'
  const categoryId = result.categoryId || 'general'
  const categoryRules = rules?.categories?.[categoryId] || DEFAULT_CATEGORY_RULES[categoryId] || DEFAULT_CATEGORY_RULES.general
  const confidencePct = Math.round((result.confidence || 0) * 100)

  return (
    <div 
      className="flex flex-col min-h-full pb-8"
      aria-live="polite"
    >
      {/* Top Bar with Back Arrow */}
      <TopBar title={STRINGS.result.title} onBack={onBack} />

      <div className="flex flex-col gap-4 pt-3">
        {/* ================= CONFIDENT RESULT STATE ================= */}
        {isConfident && (
          <>
            {/* Primary Result Summary Card */}
            <section className="surface-glass-strong rounded-3xl p-5 border border-white/20">
              <div className="flex items-center justify-between gap-4">
                {/* Left Column: Category, Confidence & Progress Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryIcon categoryId={categoryId} size={22} />
                    <h2 className="text-2xl font-bold text-white tracking-tight truncate">
                      {categoryRules.label}
                    </h2>
                  </div>

                  <p className="text-sm font-semibold text-[var(--lime-mist)]">
                    {confidencePct}% sure
                  </p>

                  {/* Visual Confidence Progress Bar */}
                  <div 
                    role="progressbar" 
                    aria-valuenow={confidencePct} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                    className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        categoryRules.toneColor || 'bg-[var(--emerald-400)]'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(10, confidencePct))}%` }}
                    />
                  </div>
                </div>

                {/* Right Column: Photo thumbnail with check badge */}
                <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-white/20 bg-black/40 shadow-inner">
                  {result.previewUrl ? (
                    <img
                      src={result.previewUrl}
                      alt="Scanned item thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CategoryIcon categoryId={categoryId} size={32} />
                    </div>
                  )}

                  {/* Overlapping Emerald Check Badge */}
                  <div 
                    aria-hidden="true"
                    className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[var(--emerald-500)] border-2 border-white/80 flex items-center justify-center shadow-md"
                  >
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </section>

            {/* Disposal Steps Section */}
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-white/90 tracking-wide uppercase px-1">
                {STRINGS.result.howToDispose}
              </h3>

              <div className="surface-glass rounded-2xl p-4 border border-white/15 space-y-3">
                {categoryRules.steps?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[var(--lime-mist)] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-white/90 leading-relaxed font-normal">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SDG 15 Impact Fact Card */}
            <section className="surface-glass rounded-2xl p-4 border border-white/15 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-1.5">
                <Leaf className="w-4 h-4 text-[var(--lime-mist)]" />
                <span className="text-[11px] font-extrabold text-[var(--lime-mist)] tracking-widest uppercase">
                  {STRINGS.result.sdgOverline}
                </span>
              </div>
              <p className="text-xs text-white/85 leading-relaxed">
                {categoryRules.sdgFact}
              </p>
            </section>

            {/* Was this correct? Feedback Row */}
            <section className="flex items-center justify-between px-2 py-1">
              <span className="text-xs text-white/75 font-medium">
                {feedback ? STRINGS.result.feedbackThanks : STRINGS.result.wasCorrect}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onFeedback('up')}
                  aria-label="Thumbs up - correct classification"
                  className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all border ${
                    feedback === 'up'
                      ? 'bg-[var(--emerald-500)] text-white border-white/40 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onFeedback('down')}
                  aria-label="Thumbs down - incorrect classification"
                  className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all border ${
                    feedback === 'down'
                      ? 'bg-[var(--coral-500)] text-white border-white/40 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </section>
          </>
        )}

        {/* ================= NOT SURE RESULT STATE ================= */}
        {!isConfident && (
          <>
            {/* Primary Not-Sure Card */}
            <section className="surface-glass-strong rounded-3xl p-5 border border-white/20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CircleHelp className="w-6 h-6 text-[var(--amber-400)] shrink-0" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {STRINGS.result.notSureTitle}
                    </h2>
                  </div>
                  <p className="text-sm text-white/80 font-medium">
                    {STRINGS.result.notSureMessage}
                  </p>
                </div>

                {/* Photo thumbnail without badge */}
                <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-white/20 bg-black/40 shadow-inner">
                  {result.previewUrl ? (
                    <img
                      src={result.previewUrl}
                      alt="Uncertain scan photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CircleHelp className="w-10 h-10 text-[var(--amber-400)]/60" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Tips Card */}
            <section className="surface-glass rounded-2xl p-4 border border-white/15 space-y-2.5">
              <h3 className="text-xs font-bold text-[var(--lime-mist)] uppercase tracking-wider mb-1">
                Scanning Tips
              </h3>
              <div className="flex items-center gap-2.5 text-xs text-white/85">
                <Lightbulb className="w-4 h-4 text-[var(--lime-mist)] shrink-0" />
                <span>{STRINGS.result.tipAnotherAngle}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/85">
                <Lightbulb className="w-4 h-4 text-[var(--lime-mist)] shrink-0" />
                <span>{STRINGS.result.tipOneItem}</span>
              </div>
            </section>
          </>
        )}

        {/* Primary CTA: Scan another item */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onScanAnother}
            className="btn-primary rounded-full py-4 px-6 w-full font-bold text-sm tracking-wide shadow-fab flex items-center justify-center gap-2.5 active:scale-95 transition-transform min-h-[48px]"
          >
            <Camera className="w-5 h-5 text-white" />
            <span>{STRINGS.result.scanAnother}</span>
          </button>
        </div>
>>>>>>> 34af0729ef93c0a988739df7f4f7c459280ae23a
      </div>
    </div>
  )
}

export default ResultCard
