import React from 'react'
import { Leaf } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Header() {
  return (
    <header className="w-full bg-[#FFFFFF] rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-[#DCE8DF] shadow-[0_4px_24px_rgba(15,157,88,0.06)] relative overflow-hidden transition-all">


      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Logo + Brand Name + SDG Badge + Tagline */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Rounded-Square Green Logo Container */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-[0_4px_14px_rgba(15,157,88,0.25)] border border-[#C6D9CC] shrink-0">
            <img
              src="/logo.png"
              alt="BinGo recycling leaf logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Typography block */}
          <div className="min-w-0">
            {/* Top row: Brand + Divider + SDG 15 Badge + Life on Land */}
            <div className="flex items-center flex-wrap gap-y-1 gap-x-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                <span className="text-[#0E2A1F]">Bin</span>
                <span className="text-[#0F9D58]">Go</span>
              </h1>

              {/* Vertical divider */}
              <span className="h-4 w-px bg-[#C6D9CC] mx-0.5 hidden xs:inline-block" aria-hidden="true" />

              {/* LIFE ON LAND caption */}
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#52665A] shrink-0">
                LIFE ON LAND
              </span>
            </div>

            {/* Tagline */}
            <p className="text-xs sm:text-sm font-medium text-[#52665A] mt-1 tracking-normal">
              {STRINGS.app.tagline}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
