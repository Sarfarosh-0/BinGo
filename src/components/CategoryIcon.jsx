import {
  Recycle,
  Sprout,
  Smartphone,
  TriangleAlert,
  Trash2,
  CircleHelp,
} from 'lucide-react'
import { getCategoryTheme } from '../lib/categoryTheme'

const ICON_MAP = {
  recyclable: Recycle,
  organic: Sprout,
  ewaste: Smartphone,
  hazardous: TriangleAlert,
  general: Trash2,
  not_sure: CircleHelp,
}

export function CategoryIcon({
  categoryId,
  iconName,
  size = 24,
  className = '',
  inheritColor = false,
  style = {},
}) {
  const key = (categoryId || iconName || 'not_sure').toLowerCase().trim()
  const Component = ICON_MAP[key] || CircleHelp
  const theme = getCategoryTheme(key)

  const iconStyle = inheritColor
    ? style
    : { color: theme.ink, ...style }

  return (
    <Component
      size={size}
      style={iconStyle}
      className={`shrink-0 ${className}`}
      strokeWidth={2}
      aria-hidden="true"
    />
  )
}

export default CategoryIcon
