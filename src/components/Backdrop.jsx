import React, { memo } from 'react'

function BackdropComponent() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[var(--color-bg)]"
      aria-hidden="true"
    >
      {/* Soft top-center radial glow — gives depth without noise */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(15,157,88,0.07) 0%, transparent 70%)',
        }}
      />
      {/* Subtle top tone band */}
      <div
        className="absolute top-0 left-0 right-0 h-60 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, var(--color-bg-band) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}

export const Backdrop = memo(BackdropComponent)
export default Backdrop
