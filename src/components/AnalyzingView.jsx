import React from 'react'
import { X } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function AnalyzingView({ previewUrl, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image analysis in progress"
      className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col justify-between p-4 overflow-hidden"
    >
      {/* Top Bar */}
      <header className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cancel analysis"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] active:scale-95 text-[var(--color-text)] transition-all border border-[var(--color-border)]"
        >
          <X className="w-4.5 h-4.5" strokeWidth={2.25} />
        </button>

        <h1 className="text-[15px] font-bold text-[var(--color-text)] tracking-tight">
          {STRINGS.analyzing.title}
        </h1>

        <div className="w-10 h-10" aria-hidden="true" />
      </header>

      {/* Scan Frame */}
      <div className="flex-1 my-3 flex items-center justify-center relative min-h-0">
        <div className="scan-frame relative w-full max-w-[360px] h-full max-h-[420px] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-sunken)] flex items-center justify-center shadow-md">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Scan preview"
              className="w-full h-full object-contain"
            />
          )}
          <div className="scan-corner tl" />
          <div className="scan-corner tr" />
          <div className="scan-corner bl" />
          <div className="scan-corner br" />
          <div className="scan-line" />
        </div>
      </div>

      {/* Status Card */}
      <div
        role="status"
        className="card max-w-[360px] mx-auto w-full mb-2 p-4 border border-[var(--color-border)] shadow-sm"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="w-2 h-2 rounded-full bg-[var(--color-primary-strong)] shrink-0"
            style={{ animation: 'pulse-dot 1s ease-in-out infinite' }}
          />
          <span className="text-sm font-bold text-[var(--color-text)]">{STRINGS.analyzing.status}</span>
        </div>

        <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
          <li className="flex items-center gap-2">
            <span className="text-[var(--color-primary-strong)] shrink-0">💡</span>
            <span>{STRINGS.analyzing.hintOneItem}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[var(--color-primary-strong)] shrink-0">⏱</span>
            <span>{STRINGS.analyzing.hintTakesMoment}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AnalyzingView