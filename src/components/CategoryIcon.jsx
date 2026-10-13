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
      aria-hidden="true"
    />
  )
}

export default CategoryIcon
