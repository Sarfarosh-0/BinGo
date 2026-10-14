import React from 'react'
import { ScanLine, Image as ImageIcon, Camera } from 'lucide-react'
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
      className="card card-hero p-5 sm:p-6 flex flex-col items-center text-center relative overflow-hidden"
    >
      {/* Scan area */}
      <button
        type="button"
        onClick={ready && onCameraClick ? onCameraClick : undefined}
        disabled={!ready}
        aria-label={STRINGS.home.scanTitle}
        className="relative w-36 h-36 sm:w-40 sm:h-40 my-2 flex items-center justify-center rounded-[24px] bg-[var(--color-surface-sunken)] border border-[var(--color-border)] cursor-pointer group disabled:cursor-default focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] transition-all hover:border-[var(--color-border-strong)] hover:shadow-sm active:scale-95"
      >
        {/* Decorative corner marks */}
        <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[var(--color-primary-strong)] rounded-tl-md opacity-60" />
        <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[var(--color-primary-strong)] rounded-tr-md opacity-60" />
        <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[var(--color-primary-strong)] rounded-bl-md opacity-60" />
        <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[var(--color-primary-strong)] rounded-br-md opacity-60" />

        {/* Center icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[var(--color-border)] group-hover:scale-105 transition-transform">
            <ScanLine
              className="w-8 h-8 text-[var(--color-primary-strong)]"
              strokeWidth={1.75}
            />
          </div>
        </div>
      </button>

      {/* Heading */}
      <h2 className="text-xl font-bold text-[var(--color-text)] tracking-tight mt-3">
        {STRINGS.home.scanTitle}
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-[270px] leading-snug">
        {STRINGS.home.scanSubtitle}
      </p>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-2.5 mt-5">
        <button
          type="button"
          onClick={onCameraClick}
          disabled={!ready}
          className="btn btn-primary w-full flex items-center justify-center gap-2.5"
        >
          <Camera className="w-5 h-5" />
          <span>{STRINGS.home.btnCamera}</span>
        </button>

        <button
          type="button"
          onClick={onGalleryClick}
          disabled={!ready}
          className="btn btn-tonal w-full flex items-center justify-center gap-2.5"
        >
          <ImageIcon className="w-5 h-5" />
          <span>{STRINGS.home.btnGallery}</span>
        </button>
      </div>

      {/* Hint Pills */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4">
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] leading-snug">
          <span className="text-[var(--color-primary-strong)] shrink-0">💡</span>
          <span>{STRINGS.home.hintOneItem}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface-sunken)] border border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] leading-snug">
          <span className="text-[var(--color-primary-strong)] shrink-0">☀️</span>
          <span>{STRINGS.home.hintGoodLight}</span>
        </div>
      </div>

      {/* Model loading chip */}
      {!ready && (
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-[var(--color-primary-soft)] border border-[var(--color-primary-soft)] text-xs font-semibold text-[var(--color-primary-strong)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary-strong)]" style={{ animation: 'pulse-dot 1s ease-in-out infinite' }} />
          <span>{loadingText}</span>
        </div>
      )}
    </section>
  )
}

export default Scanner