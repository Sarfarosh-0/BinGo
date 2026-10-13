import React from 'react'
import {
  Recycle,
  Sprout,
  Smartphone,
  TriangleAlert,
  Trash2,
  CircleHelp,
} from 'lucide-react'

const ICON_MAP = {
  recyclable: Recycle,
  organic: Sprout,
  ewaste: Smartphone,
  hazardous: TriangleAlert,
  general: Trash2,
  not_sure: CircleHelp,
}

const TONE_COLOR_MAP = {
  recyclable: 'text-[var(--emerald-400)]',
  organic: 'text-[var(--lime-mist)]',
  ewaste: 'text-[var(--aqua-400)]',
  hazardous: 'text-[var(--coral-500)]',
  general: 'text-white/60',
  not_sure: 'text-[var(--amber-400)]',
}

export function CategoryIcon({
  categoryId = 'recyclable',
  size = 24,
  className = '',
  inheritColor = false,
}) {
  const normalizedKey = categoryId?.toLowerCase?.()?.trim?.() || 'not_sure'
  const Component = ICON_MAP[normalizedKey] || CircleHelp
  const toneClass = inheritColor ? '' : (TONE_COLOR_MAP[normalizedKey] || 'text-white/80')

  return (
    <Component
      size={size}
      className={`${toneClass} ${className}`}
      strokeWidth={2}
      aria-hidden="true"
    />
  )
}

export default CategoryIcon
