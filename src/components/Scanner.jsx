import React, { useState, useCallback } from 'react'
import {
  Camera,
  Image as ImageIcon,
  ScanLine,
  UploadCloud,
  CheckCircle2,
  Shield,
  Zap,
  Loader2,
} from 'lucide-react'
import { STRINGS } from '../lib/strings'
import { sampleImageUrl } from '../lib/sampleImages'

// Presentation data for the quick-try tiles. Handler keys are unchanged.
const SAMPLES = [
  {
    key: 'bottle',
    img: sampleImageUrl('bottle'),
    label: STRINGS.home.sampleBottleLabel,
    title: STRINGS.home.sampleBottleTitle,
    border: 'hover:border-[var(--cat-recyclable)]',
    text: 'group-hover:text-[var(--cat-recyclable)]',
  },
  {
    key: 'organic',
    img: sampleImageUrl('organic'),
    label: STRINGS.home.sampleOrganicLabel,
    title: STRINGS.home.sampleOrganicTitle,
    border: 'hover:border-[var(--cat-organic)]',
    text: 'group-hover:text-[var(--cat-organic)]',
  },
  {
    key: 'battery',
    img: sampleImageUrl('battery'),
    label: STRINGS.home.sampleBatteryLabel,
    title: STRINGS.home.sampleBatteryTitle,
    border: 'hover:border-[var(--cat-hazardous)]',
    text: 'group-hover:text-[var(--cat-hazardous)]',
  },
]

export function Scanner({
  ready = true,
  loadingText = STRINGS.home.loadingModel,
  onGalleryClick,
  onCameraClick,
  onDropFile,
  onSelectSample,
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!ready) return
    setIsDragOver(true)
  }, [ready])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (!ready) return

    const files = e.dataTransfer?.files
    if (files && files.length > 0 && onDropFile) {
      onDropFile(files[0])
    }
  }, [ready, onDropFile])

  return (
    <section
      aria-label={STRINGS.a11y.scanStation}
      className="card card-hero relative flex flex-col items-center overflow-hidden p-5 text-center sm:p-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 bg-[color-mix(in_srgb,var(--color-primary-strong)_94%,transparent)] p-3 text-white backdrop-blur-sm">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-[var(--radius-xl)] border-2 border-dashed border-white/70 p-6">
            <UploadCloud className="mb-3 h-14 w-14 animate-bounce text-white" />
            <h3 className="text-xl font-black tracking-tight">{STRINGS.scanner.dropHere}</h3>
            <p className="mt-1 text-sm text-white/90">
              {STRINGS.scanner.dropSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Scan Aperture — decorative lens. The labelled buttons below are the
          only capture controls, matching Design-Document D4 / PRD §2. */}
      <div
        aria-hidden="true"
        className="relative my-2 flex h-40 w-40 select-none items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[radial-gradient(circle_at_50%_35%,var(--color-surface)_0%,var(--color-surface-sunken)_100%)] shadow-[var(--shadow-xs)] sm:h-44 sm:w-44"
      >
        {/* Corner brackets */}
        <span className="absolute left-3.5 top-3.5 h-4 w-4 rounded-tl-md border-l-2 border-t-2 border-[var(--color-primary-strong)] opacity-70" />
        <span className="absolute right-3.5 top-3.5 h-4 w-4 rounded-tr-md border-r-2 border-t-2 border-[var(--color-primary-strong)] opacity-70" />
        <span className="absolute bottom-3.5 left-3.5 h-4 w-4 rounded-bl-md border-b-2 border-l-2 border-[var(--color-primary-strong)] opacity-70" />
        <span className="absolute bottom-3.5 right-3.5 h-4 w-4 rounded-br-md border-b-2 border-r-2 border-[var(--color-primary-strong)] opacity-70" />

        {/* Center emblem */}
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] sm:h-[72px] sm:w-[72px]">
          <ScanLine className="h-8 w-8 text-[var(--color-primary-strong)]" strokeWidth={2} />
        </div>
      </div>

      {/* Heading */}
      <h2 className="mt-3 text-xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-2xl">
        {STRINGS.home.scanTitle}
      </h2>
      <p className="mt-1.5 max-w-[320px] text-sm leading-snug text-[var(--color-text-secondary)]">
        {STRINGS.home.scanSubtitle}
      </p>

      {/* Action Buttons */}
      <div className="mt-5 flex w-full flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onCameraClick}
          disabled={!ready}
          className="btn btn-primary flex-1 gap-2.5 text-sm"
        >
          <Camera className="h-5 w-5 shrink-0 text-white" />
          <span>{STRINGS.home.btnCamera}</span>
        </button>

        <button
          type="button"
          onClick={onGalleryClick}
          disabled={!ready}
          className="btn btn-tonal flex-1 gap-2.5 text-sm"
        >
          <ImageIcon className="h-5 w-5 shrink-0 text-[var(--color-primary-strong)]" />
          <span>{STRINGS.home.btnGallery}</span>
        </button>
      </div>

      {/* Quick-Try Samples */}
      {onSelectSample && (
        <div className="mt-5 w-full border-t border-[var(--color-divider)] pt-4">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <span className="text-left text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
              {STRINGS.home.samplesTitle}
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary-strong)]">
              <Zap className="h-3.5 w-3.5 shrink-0" />
              {STRINGS.home.samplesBadge}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => onSelectSample(s.key)}
                disabled={!ready}
                title={s.title}
                className={`group flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-2.5 text-[var(--color-text)] transition-all duration-150 hover:bg-[var(--color-surface-alt)] active:scale-95 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] ${s.border}`}
              >
                <span
                  className="h-9 w-9 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)]"
                  aria-hidden="true"
                >
                  <img
                    src={s.img}
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    decoding="async"
                  />
                </span>
                <span className={`w-full truncate text-center text-xs font-semibold transition-colors ${s.text}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-strong)]" />
          <span>{STRINGS.scanner.trustPrivate}</span>
        </span>
        <span className="hidden xs:inline" aria-hidden="true">·</span>
        <span className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-strong)]" />
          <span>{STRINGS.scanner.trustZeroLag}</span>
        </span>
        <span className="hidden xs:inline" aria-hidden="true">·</span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-strong)]" />
          <span>{STRINGS.scanner.trustSdg}</span>
        </span>
      </div>

      {/* Model loading chip */}
      {!ready && (
        <div className="mt-4 inline-flex animate-pulse items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-primary-strong)_20%,transparent)] bg-[var(--color-surface-alt)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-primary-strong)]">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          <span>{loadingText}</span>
        </div>
      )}
    </section>
  )
}

export default Scanner