import React, { memo } from 'react'

function BackdropComponent() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" 
      aria-hidden="true"
    >
      {/* Base forest canopy diagonal gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, var(--forest-900) 0%, var(--forest-800) 50%, var(--forest-700) 100%)',
        }}
      />

      {/* Bokeh radial patch top right */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(141, 185, 160, 0.15) 0%, rgba(47, 191, 113, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* Bokeh radial patch mid-left */}
      <div 
        className="absolute top-1/3 -left-32 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.10) 0%, rgba(11, 46, 37, 0.05) 60%, transparent 80%)',
        }}
      />

      {/* Bokeh radial patch bottom center */}
      <div 
        className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(207, 234, 138, 0.08) 0%, rgba(47, 191, 113, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* Subtle organic noise/overlay */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}

export const Backdrop = memo(BackdropComponent)
export default Backdrop
