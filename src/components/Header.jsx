import React from 'react'
import { Leaf } from 'lucide-react'
import { STRINGS } from '../lib/strings'

export function Header() {
  return (
    <header className="w-full bg-[#FFFFFF] rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-[#DCE8DF] shadow-[0_4px_24px_rgba(15,157,88,0.06)] relative overflow-hidden transition-all">
      {/* Decorative organic background graphics on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Soft pale-green circular aura 1 */}
        <div className="absolute -right-10 -top-12 w-52 h-52 rounded-full bg-[#E3F5E9]/75 blur-md" />
        {/* Soft pale-green circular aura 2 */}
        <div className="absolute right-16 -bottom-16 w-44 h-44 rounded-full bg-[#D9F99D]/40 blur-md" />
        {/* Subtle curved botanical shape / ring */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#0F9D58]/15" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Logo + Brand Name + SDG Badge + Tagline */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Rounded-Square Green Logo Container */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#10B981] via-[#0F9D58] to-[#0B6E4F] flex items-center justify-center shadow-[0_4px_14px_rgba(15,157,88,0.3)] border border-white/40 shrink-0 group">
            {/* White recycling loop + vibrant leaf inside */}
            <svg
              viewBox="0 0 36 36"
              className="w-7 h-7 sm:w-8 sm:h-8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="BinGo recycling leaf logo"
            >
              {/* Outer Mobius recycling loop arrows */}
              <path
                d="M18 5L21 9H16.5C12.91 9 10 11.91 10 15.5V17L7 17V15.5C7 10.25 11.25 6 16.5 6L18 5Z"
                fill="#FFFFFF"
              />
              <path
                d="M27.5 14L30.5 18L26.5 20.5L25 18C23.21 15.11 19.5 14 16.5 15.5L15 13C19.5 10.75 25 12.25 27.5 16L27.5 14Z"
                fill="#FFFFFF"
                opacity="0.95"
              />
              <path
                d="M19.5 31L16.5 27H21C24.59 27 27.5 24.09 27.5 20.5V19L30.5 19V20.5C30.5 25.75 26.25 30 21 30L19.5 31Z"
                fill="#FFFFFF"
              />
              <path
                d="M8.5 22L5.5 18L9.5 15.5L11 18C12.79 20.89 16.5 22 19.5 20.5L21 23C16.5 25.25 11 23.75 8.5 20L8.5 22Z"
                fill="#FFFFFF"
                opacity="0.95"
              />
              {/* Inner stylized leaf */}
              <path
                d="M18 10C18 10 24 12 24 18C24 23 19 25 18 25C17 25 12 23 12 18C12 12 18 10 18 10Z"
                fill="#D9F99D"
                opacity="0.9"
              />
              <path
                d="M18 12V24M18 16C19.5 17 21 17.5 22 17M18 19C16.5 20 15 20.5 14 20"
                stroke="#0B6E4F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
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

              {/* SDG 15 pale-green rounded badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E3F5E9] border border-[#C6D9CC] text-[#0B7A44] font-bold text-xs shrink-0 shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-[#0F9D58]" strokeWidth={2.5} />
                <span>SDG 15</span>
              </div>

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

        {/* Right Section: Artwork with handwritten slogan & globe */}
        <div
          className="relative z-10 flex items-center gap-3 sm:gap-4 shrink-0 self-end sm:self-center pr-1"
          aria-hidden="true"
        >
          {/* Handwritten slogan */}
          <div className="text-right">
            <span
              className="block font-semibold text-[#0B7A44] text-xs sm:text-sm tracking-wide leading-tight"
              style={{
                fontFamily: "'Caveat', cursive, 'Brush Script MT', 'Playpen Sans', var(--font-sans)",
                fontSize: '15px',
                transform: 'rotate(-2deg)',
              }}
            >
              Cleaner Today,
            </span>
            <span
              className="block font-bold text-[#0F9D58] text-xs sm:text-sm tracking-wide leading-tight"
              style={{
                fontFamily: "'Caveat', cursive, 'Brush Script MT', 'Playpen Sans', var(--font-sans)",
                fontSize: '15px',
                transform: 'rotate(-2deg)',
              }}
            >
              Greener Tomorrow
            </span>
          </div>

          {/* Environmental Graphic: Partially visible globe with continents & leaves */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
            {/* Globe SVG */}
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Globe ocean circle */}
              <circle cx="32" cy="32" r="28" fill="#E8F6EA" stroke="#C6D9CC" strokeWidth="1.5" />

              {/* Latitude and Longitude subtle curved grid lines */}
              <ellipse cx="32" cy="32" rx="28" ry="12" stroke="#DCE8DF" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="32" y1="4" x2="32" y2="60" stroke="#DCE8DF" strokeWidth="1" strokeDasharray="2 2" />

              {/* Stylized green landmasses / continents */}
              <path
                d="M20 18C22 14 28 12 32 14C35 15 36 19 33 22C30 25 25 24 22 22C19 20 18 20 20 18Z"
                fill="#2E7D32"
                opacity="0.85"
              />
              <path
                d="M38 20C42 19 48 23 46 28C45 31 40 33 37 30C34 27 35 22 38 20Z"
                fill="#0F9D58"
                opacity="0.8"
              />
              <path
                d="M16 28C19 27 24 30 23 35C22 39 17 44 14 40C11 36 13 30 16 28Z"
                fill="#16834A"
                opacity="0.85"
              />
              <path
                d="M28 36C33 35 40 39 42 45C44 51 38 54 32 52C27 50 25 44 28 36Z"
                fill="#0F9D58"
                opacity="0.8"
              />

              {/* Decorative green botanical branch curling from edge */}
              <path
                d="M48 10C51 14 54 22 51 30"
                stroke="#0B7A44"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M50 14C53 13 56 16 54 18C52 20 49 17 50 14Z"
                fill="#7BE8A4"
              />
              <path
                d="M52 22C56 22 58 26 55 28C53 30 50 26 52 22Z"
                fill="#0F9D58"
              />
              <path
                d="M49 28C52 30 53 34 50 35C48 36 46 32 49 28Z"
                fill="#16834A"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
