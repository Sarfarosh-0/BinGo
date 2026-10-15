import React, { useState, useEffect } from 'react'
import { X, Check, AlertTriangle, Leaf, Recycle } from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import { CATEGORY_THEME } from '../lib/categoryTheme'

const CATEGORY_DETAILS = {
  recyclable: {
    title: 'Dry Recyclables',
    binColor: 'Blue Bin',
    accepted: [
      'Clean PET bottles & plastic containers (#1-#5)',
      'Cardboard boxes & paper bags',
      'Aluminium beverage cans & tin food tins',
      'Clean glass jars & beverage bottles',
    ],
    notAccepted: [
      'Greasy pizza boxes with melted cheese',
      'Thin single-use plastic films / grocery pouches',
      'Broken window panes & heat-proof ceramics',
    ],
    tips: 'Rinse with leftover dishwater to remove liquids. Crush cans and flatten boxes to conserve bin volume.',
    sdgFact: 'Every metric ton of recycled paper preserves 17 mature trees and avoids 4,000 kW·h of electrical energy.',
  },
  organic: {
    title: 'Wet Compostable Organic Waste',
    binColor: 'Green Bin',
    accepted: [
      'Fruit peels, citrus rinds & vegetable trimmings',
      'Coffee grounds, filter paper & tea bags',
      'Garden leaves, cut flowers & dead plant stems',
      'Crushed eggshells & plain wood shavings',
    ],
    notAccepted: [
      'Plastic produce stickers (remove first!)',
      'Synthetic tea bags with nylon mesh',
      'Excessive cooking oils or grease',
    ],
    tips: 'Composting aerobically halts methane production and creates nutrient-rich humus for urban gardening.',
    sdgFact: 'Organic soil matter restores subterranean microbiome diversity and increases moisture retention by up to 20%.',
  },
  ewaste: {
    title: 'Electronic & Digital Waste',
    binColor: 'Designated Take-Back Kiosk',
    accepted: [
      'Old smartphones, tablets & e-readers',
      'Charging cords, USB cables & power adapters',
      'Keyboards, mice & internal computer parts',
      'Small kitchen appliances & hair dryers',
    ],
    notAccepted: [
      'Swollen or leaking lithium-ion pouch cells (treat as Hazardous)',
      'Light bulbs & fluorescent mercury tubes',
    ],
    tips: 'Back up and factory reset devices. Never toss e-waste in domestic dumpsters where metals crush and spark fires.',
    sdgFact: 'Recycling 1 million mobile phones recovers 16,000 kg of copper, 350 kg of silver, and 34 kg of gold.',
  },
  hazardous: {
    title: 'Hazardous & Chemical Waste',
    binColor: 'Red Hazardous Container',
    accepted: [
      'Household batteries (alkaline, button, NiCd)',
      'Unused paints, varnishes & chemical solvents',
      'Aerosol spray canisters with propellant',
      'Pesticides, weedkillers & motor oil containers',
    ],
    notAccepted: [
      'Regular household kitchen trash',
      'Non-hazardous empty dry glass bottles',
    ],
    tips: 'Retain in original marked containers with safety labels visible. Store upright out of reach of children.',
    sdgFact: 'A single cadmium battery can contaminate 600,000 liters of groundwater—preventing dumping halts toxic soil sterility.',
  },
  general: {
    title: 'General / Non-Recyclable Residuals',
    binColor: 'Grey / Black Bin',
    accepted: [
      'Multi-layer laminated snack wrappers & foil pouches',
      'Used facial tissues, cotton swabs & sanitary napkins',
      'Broken porcelain mugs & drinking glass shards (wrapped)',
      'Worn synthetic cleaning sponges',
    ],
    notAccepted: [
      'Clean recyclable bottles or cans',
      'Compostable food waste',
      'Any batteries or electronic devices',
    ],
    tips: 'Tie trash liners tightly to prevent lightweight plastic fragments from dispersing onto natural wildlife reserves.',
    sdgFact: 'Responsible containment shields open grasslands, rivers, and wildlife habitats from fatal microplastic ingestion.',
  },
}

const CATEGORY_KEYS = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']

export function CategoryGuideModal({ isOpen, initialCategory = 'recyclable', onClose }) {
  const [selectedKey, setSelectedKey] = useState(initialCategory)

  useEffect(() => {
    if (initialCategory) {
      setSelectedKey(initialCategory)
    }
  }, [initialCategory])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const active = CATEGORY_DETAILS[selectedKey] || CATEGORY_DETAILS.recyclable
  const theme = CATEGORY_THEME[selectedKey] || CATEGORY_THEME.recyclable

  return (
    <div
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
                What Goes Where Guide
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Official sorting standards for SDG 15 (Life on Land)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            aria-label="Close guide"
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
              <span>What Goes In This Bin</span>
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
              <span>Do Not Put In This Bin</span>
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
                SDG 15 Conservation Impact
              </span>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {active.sdgFact}
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
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryGuideModal