import React from 'react'
import { Recycle, Lightbulb, Image as ImageIcon, Camera } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Scanner({
  ready = true,
  loadingText = STRINGS.home.loadingModel,
  onGalleryClick,
  onCameraClick,
}) {
  return (
    <section 
      aria-label="Scan Station"
      className="surface-glass rounded-3xl p-6 relative border border-white/20 flex flex-col items-center text-center"
    >
      {/* Decorative Viewfinder Bracket Frame */}
      <div 
        className="relative w-44 h-44 my-2 flex items-center justify-center cursor-pointer group"
        onClick={ready && onCameraClick ? onCameraClick : undefined}
        role={onCameraClick ? 'button' : undefined}
        tabIndex={onCameraClick ? 0 : undefined}
        aria-label="Open Camera"
      >
        {/* Four white corner brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/70 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/70 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/70 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/70 rounded-br-lg" />

        {/* Static glowing emerald scan line through center */}
        <div 
          className="absolute left-3 right-3 h-[2px] bg-[var(--emerald-400)] shadow-[0_0_12px_rgba(74,222,128,0.7)]" 
          aria-hidden="true"
        />

        {/* Center recycle icon */}
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Recycle className="w-10 h-10 text-[var(--emerald-400)] animate-pulse" strokeWidth={1.75} />
        </div>
      </div>

      {/* Headings */}
      <h2 className="text-xl font-bold text-white mt-3">
        {STRINGS.home.scanTitle}
      </h2>
      <p className="text-sm text-white/75 mt-1.5 max-w-[280px]">
        {STRINGS.home.scanSubtitle}
      </p>

      {/* Hints */}
      <div className="w-full space-y-2 mt-4 text-left">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
          <Lightbulb className="w-4 h-4 text-[var(--lime-mist)] shrink-0" />
          <span>{STRINGS.home.hintOneItem}</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
          <Lightbulb className="w-4 h-4 text-[var(--lime-mist)] shrink-0" />
          <span>{STRINGS.home.hintGoodLight}</span>
        </div>
      </div>

      {/* Gallery Button */}
      <div className="w-full mt-5">
        <button
          type="button"
          onClick={onGalleryClick}
          disabled={!ready}
          className="btn-glass rounded-2xl py-3.5 px-5 flex items-center justify-center gap-2.5 w-full font-medium text-sm border border-white/20 min-h-[44px]"
        >
          <ImageIcon className="w-4 h-4 text-[var(--emerald-400)]" />
          <span>{STRINGS.home.btnGallery}</span>
        </button>
      </div>

      {/* Model Loading Indicator */}
      {!ready && (
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-[var(--lime-mist)]">
          <span className="w-2 h-2 rounded-full bg-[var(--lime-mist)] animate-ping" />
          <span>{loadingText}</span>
        </div>
      )}
    </section>
  )
}

export default Scanner
