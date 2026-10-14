import React, { useState, useEffect } from 'react'
import { X, Check, AlertTriangle, Leaf, ChevronRight, Recycle, Info } from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import { CATEGORY_THEME } from '../lib/categoryTheme'

const CATEGORY_DETAILS = {
  recyclable: {
    title: 'Dry Recyclables',
    binColor: 'Blue Bin',
    badgeTone: 'bg-blue-50 text-blue-700 border-blue-200',
    colorHex: '#1565C0',
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
    badgeTone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    colorHex: '#2E7D32',
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
    badgeTone: 'bg-purple-50 text-purple-800 border-purple-200',
    colorHex: '#6A3DB8',
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
    badgeTone: 'bg-red-50 text-red-800 border-red-200',
    colorHex: '#C62828',
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
    badgeTone: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    colorHex: '#5F6B63',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0E2A1F]/55 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-[620px] max-h-[90vh] bg-[var(--color-surface)] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-divider)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)] text-[var(--color-primary-strong)] flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="guide-title" className="text-base font-extrabold text-[var(--color-text)] tracking-tight">
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
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--color-surface-sunken)] active:scale-95 text-[var(--color-text-secondary)] transition-all shrink-0"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 shrink-0" />
          </button>
        </div>

        {/* Category Horizontal Segmented Tabs */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar shrink-0">
          {CATEGORY_KEYS.map((k) => {
            const isCur = selectedKey === k
            const th = CATEGORY_THEME[k]
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSelectedKey(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isCur
                    ? 'shadow-xs text-white'
                    : 'bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
                style={isCur ? { backgroundColor: th.ink } : {}}
              >
                <CategoryIcon categoryId={k} size={16} inheritColor={isCur} />
                <span>{th.label.split('/')[0].trim()}</span>
              </button>
            )
          })}
        </div>

        {/* Scrollable Category Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 pt-1">
          {/* Hero Banner for Category */}
          <div
            className="p-4 rounded-2xl border transition-all"
            style={{
              backgroundColor: `${theme.soft}40`,
              borderColor: `${theme.ink}30`,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className="text-[11px] font-black uppercase tracking-wider block"
                  style={{ color: theme.ink }}
                >
                  {active.binColor}
                </span>
                <h3 className="text-lg font-black text-[var(--color-text)] mt-0.5">
                  {active.title}
                </h3>
              </div>
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
                style={{ backgroundColor: '#FFFFFF', border: `1px solid ${theme.ink}30` }}
              >
                <CategoryIcon categoryId={selectedKey} size={22} />
              </div>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed">
              {active.tips}
            </p>
          </div>

          {/* Accepted Items List */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-success)] flex items-center gap-1.5">
              <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              <span>What Goes In This Bin</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {active.accepted.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-medium flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Contaminants to Avoid */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-warning)] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={2.25} />
              <span>Do Not Put In This Bin</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {active.notAccepted.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-950 font-medium flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ecological Fact */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)] text-xs text-[var(--color-text)] flex items-start gap-2.5">
            <Leaf className="w-4.5 h-4.5 text-[var(--color-primary-strong)] shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-[var(--color-primary-strong)] block text-[11px] uppercase tracking-wider">
                SDG 15 Conservation Impact
              </span>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {active.sdgFact}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--color-divider)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary px-5 py-2 text-xs font-bold"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryGuideModal
