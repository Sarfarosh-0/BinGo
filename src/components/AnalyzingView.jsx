import React, { useEffect, useRef } from 'react'
import { Lightbulb } from 'lucide-react'
import { TopBar } from './TopBar'
import { STRINGS } from '../lib/strings'

const MIN_DISPLAY_MS = 500

export function AnalyzingView({ photoCanvas, onClose }) {
  const imgRef = useRef(null)
  const startedRef = useRef(Date.now())

  useEffect(() => {
    startedRef.current = Date.now()
    if (photoCanvas && imgRef.current) {
      try {
        imgRef.current.src = photoCanvas.toDataURL('image/jpeg', 0.85)
      } catch {
        /* tainted canvas — ignore */
      }
    }
  }, [photoCanvas])

  const handleClose = () => {
    const elapsed = Date.now() - startedRef.current
    const wait = Math.max(0, MIN_DISPLAY_MS - elapsed)
    if (wait > 0) {
      setTimeout(onClose, wait)
    } else {
      onClose()
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title={STRINGS.analyzing.title} onClose={handleClose} />

      <div className="flex-1 flex flex-col px-4 py-4 gap-4 min-h-0">
        {/* Viewfinder with corner brackets + sweeping scan line */}
        <div className="relative w-full flex-1 min-h-[220px] rounded-3xl overflow-hidden bg-black/40 border border-white/15">
          <img
            ref={imgRef}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Four white corner brackets */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-white/80 rounded-tl-xl" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-[3px] border-r-[3px] border-white/80 rounded-tr-xl" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-[3px] border-l-[3px] border-white/80 rounded-bl-xl" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-white/80 rounded-br-xl" />

          {/* Glowing scan line */}
          <div className="animate-scan-line" aria-hidden="true" />
        </div>

        {/* Status panel */}
        <section className="surface-glass rounded-3xl p-4 border border-white/20">
          <h2 className="text-base font-bold text-white mb-2">
            {STRINGS.analyzing.status}
          </h2>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-white/75">
              <Lightbulb className="w-3.5 h-3.5 text-[var(--lime-mist)] shrink-0" />
              <span>{STRINGS.analyzing.hintOneItem}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/75">
              <Lightbulb className="w-3.5 h-3.5 text-[var(--lime-mist)] shrink-0" />
              <span>{STRINGS.analyzing.hintTakesMoment}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AnalyzingView
