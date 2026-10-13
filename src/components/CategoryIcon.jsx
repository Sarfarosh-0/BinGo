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

/**
 * Renders the appropriate Lucide icon for a waste category.
 * Accepts `categoryId` (e.g. "recyclable") which is the canonical prop.
 * For legacy callers passing `iconName` it falls back gracefully.
 */
export function CategoryIcon({
  categoryId,
  iconName,       // legacy compat
  tone,           // legacy compat (ignored; color derived from categoryId)
  size = 24,
  className = '',
  inheritColor = false,
}) {
  const key = (categoryId || iconName || 'not_sure').toLowerCase().trim()
  const Component = ICON_MAP[key] || CircleHelp
  const toneClass = inheritColor ? '' : (TONE_COLOR_MAP[key] || 'text-white/80')

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
