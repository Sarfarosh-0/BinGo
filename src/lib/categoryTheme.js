// Category color and token mapping per Design-Document.md v2.1 Section 8.2
export const CATEGORY_THEME = {
  recyclable: {
    label: 'Recyclable',
    ink: 'var(--cat-recyclable)',
    soft: 'var(--cat-recyclable-soft)',
    icon: 'Recycle',
  },
  organic: {
    label: 'Organic',
    ink: 'var(--cat-organic)',
    soft: 'var(--cat-organic-soft)',
    icon: 'Sprout',
  },
  ewaste: {
    label: 'E-Waste',
    ink: 'var(--cat-ewaste)',
    soft: 'var(--cat-ewaste-soft)',
    icon: 'Smartphone',
  },
  hazardous: {
    label: 'Hazardous',
    ink: 'var(--cat-hazardous)',
    soft: 'var(--cat-hazardous-soft)',
    icon: 'TriangleAlert',
  },
  general: {
    label: 'General / Non-recyclable',
    ink: 'var(--cat-general)',
    soft: 'var(--cat-general-soft)',
    icon: 'Trash2',
  },
  not_sure: {
    label: 'Not sure',
    ink: 'var(--cat-not-sure)',
    soft: 'var(--cat-not-sure-soft)',
    icon: 'CircleHelp',
  },
}

export function getCategoryTheme(catId) {
  return CATEGORY_THEME[catId] || CATEGORY_THEME.not_sure
}
