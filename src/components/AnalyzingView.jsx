import React from 'react'
import { X, Lightbulb } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function AnalyzingView({ previewUrl, onClose }) {
  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Image analysis in progress"
      className="fixed inset-0 z-40 bg-[var(--forest-900)]/95 flex flex-col justify-between p-4 overflow-hidden"
    >
      {/* Top Bar with Cancel X */}
      <header className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel analysis"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/15"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        <h1 className="text-lg font-semibold text-white tracking-wide">
          {STRINGS.analyzing.title}
        </h1>

        <div className="w-11 h-11" aria-hidden="true" />
      </header>

      {/* Center Viewfinder Container (~55% height) */}
      <div className="flex-1 my-3 flex items-center justify-center relative min-h-0">
        <div className="relative w-full max-w-[360px] h-full max-h-[420px] rounded-3xl overflow-hidden border border-white/20 surface-glass flex items-center justify-center shadow-glass">
          {/* User Photo Preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Scan preview"
              className="w-full h-full object-contain"
            />
          )}

          {/* Viewfinder Target Framing Brackets */}
          <div className="absolute inset-6 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-white/80 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-white/80 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-white/80 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-white/80 rounded-br-xl" />

            {/* Glowing animated sweeping scan line */}
            <div className="animate-scan-line" />
          </div>
        </div>
      </div>

      {/* Status & Hints Panel */}
      <div className="surface-glass rounded-3xl p-4 border border-white/20 max-w-[360px] mx-auto w-full mb-2">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--emerald-400)] animate-pulse" />
          <span>{STRINGS.analyzing.status}</span>
        </h2>

        <div className="space-y-1.5 text-xs text-white/75">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[var(--lime-mist)] shrink-0" />
            <span>{STRINGS.analyzing.hintOneItem}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[var(--lime-mist)] shrink-0" />
            <span>{STRINGS.analyzing.hintTakesMoment}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyzingView
