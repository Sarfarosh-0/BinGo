import { memo } from 'react'

function BackdropComponent() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--color-bg)]"
      aria-hidden="true"
    >
      {/* Top-center glow, tied to the brand token */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[400px] w-[600px] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-primary) 9%, transparent) 0%, transparent 70%)',
        }}
      />
      {/* Top tone band */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-60"
        style={{
          background: 'linear-gradient(to bottom, var(--color-bg-band) 0%, transparent 100%)',
        }}
      />
      {/* Faint bottom-corner accent for depth on large screens */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[360px] w-[360px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 35%, transparent) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

export const Backdrop = memo(BackdropComponent)
export default Backdrop