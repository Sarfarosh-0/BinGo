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
<<<<<<< HEAD
  Recycle,
  Sprout,
  Smartphone,
  TriangleAlert,
  Trash2,
  CircleHelp,
}

const TONE_COLORS = {
  accent: 'var(--emerald-400)',
  highlight: 'var(--lime-mist)',
  info: 'var(--aqua-400)',
  error: 'var(--coral-500)',
  muted: 'rgba(255,255,255,0.62)',
  warning: 'var(--amber-400)',
}

export function CategoryIcon({ iconName, tone, size = 24, className = '' }) {
  const Icon = ICON_MAP[iconName] || Recycle
  const color = TONE_COLORS[tone] || TONE_COLORS.accent
  return (
    <Icon
      className={className}
      style={{ color, width: size, height: size }}
      strokeWidth={1.75}
=======
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
>>>>>>> 34af0729ef93c0a988739df7f4f7c459280ae23a
      aria-hidden="true"
    />
  )
}

export default CategoryIcon
