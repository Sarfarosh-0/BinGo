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
      </div>
    </div>
  )
}

export default ResultCard
