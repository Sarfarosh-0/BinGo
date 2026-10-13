import React, { memo } from 'react'

function BackdropComponent() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[var(--color-bg)]" 
      aria-hidden="true"
    >
      {/* Top subtle tone band */}
      <div 
        className="absolute top-0 left-0 right-0 h-72 bg-[var(--color-bg-band)] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        }}
      />
    </div>
  )
}

export const Backdrop = memo(BackdropComponent)
export default Backdrop
