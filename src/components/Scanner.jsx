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
      className="card card-hero p-6 flex flex-col items-center text-center border border-[var(--color-border)] shadow-md relative overflow-hidden"
    >
      {/* Lens with Recycle glyph and static scan line */}
      <div
        className="relative w-40 h-40 my-2 flex items-center justify-center rounded-[28px] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] cursor-pointer group"
        onClick={ready && onCameraClick ? onCameraClick : undefined}
        role={onCameraClick ? 'button' : undefined}
        tabIndex={onCameraClick ? 0 : undefined}
        aria-label={STRINGS.home.scanTitle}
      >
        {/* Subtle static scan line */}
        <div
          className="absolute left-4 right-4 h-[2px] bg-[var(--color-primary)] opacity-60 shadow-sm"
          aria-hidden="true"
        />

        {/* Center recycle badge */}
        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[var(--color-border)] group-hover:scale-105 transition-transform">
          <Recycle
            className="w-10 h-10 text-[var(--color-primary-strong)] animate-pulse"
            strokeWidth={1.8}
          />
        </div>
      </div>

      {/* Headings */}
      <h2 className="text-xl font-bold text-[var(--color-text)] tracking-tight mt-3">
        {STRINGS.home.scanTitle}
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-[280px]">
        {STRINGS.home.scanSubtitle}
      </p>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-2.5 mt-5">
        <button
          type="button"
          onClick={onCameraClick}
          disabled={!ready}
          className="btn btn-primary w-full shadow-sm flex items-center justify-center gap-2.5"
        >
          <Camera className="w-5 h-5 text-white" />
          <span>{STRINGS.home.btnCamera}</span>
        </button>

        <button
          type="button"
          onClick={onGalleryClick}
          disabled={!ready}
          className="btn btn-tonal w-full flex items-center justify-center gap-2.5"
        >
          <ImageIcon className="w-5 h-5 text-[var(--color-primary-strong)]" />
          <span>{STRINGS.home.btnGallery}</span>
        </button>
      </div>

      {/* Hints */}
      <div className="w-full space-y-2 mt-5 text-left">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
          <Lightbulb className="w-4 h-4 text-[var(--color-primary-strong)] shrink-0" />
          <span>{STRINGS.home.hintOneItem}</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
          <Lightbulb className="w-4 h-4 text-[var(--color-primary-strong)] shrink-0" />
          <span>{STRINGS.home.hintGoodLight}</span>
        </div>
      </div>

      {/* Model Loading Status Chip */}
      {!ready && (
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)] text-xs font-semibold text-[var(--color-primary-strong)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary-strong)] animate-ping" />
          <span>{loadingText}</span>
        </div>
      )}
    </section>
  )
}

export default Scanner
