/**
 * DST-safe local date key generation and difference calculation.
 * Immune to clock shifts, timezone offsets, and DST changes.
 */

import { STRINGS } from './strings.js'

export function localDateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Calculates calendar day difference between two 'YYYY-MM-DD' keys.
 * Uses UTC midnight values to guarantee exact integer day differences.
 */
export function dayDiff(dateKeyA, dateKeyB) {
  if (!dateKeyA || !dateKeyB) return 0
  const [y1, m1, d1] = dateKeyA.split('-').map(Number)
  const [y2, m2, d2] = dateKeyB.split('-').map(Number)

  const utcA = Date.UTC(y1, m1 - 1, d1)
  const utcB = Date.UTC(y2, m2 - 1, d2)

  const MS_PER_DAY = 1000 * 60 * 60 * 24
  return Math.round((utcB - utcA) / MS_PER_DAY)
}

/**
 * Formats a timestamp into a user-friendly string:
 * - "Today, 2:30 PM"
 * - "Yesterday, 6:15 PM"
 * - "13 Oct, 2:30 PM"
 */
export function formatDateDisplay(ts) {
  if (!ts) return ''
  const date = new Date(ts)
  const todayKey = localDateKey(new Date())
  const itemKey = localDateKey(date)
  const diff = dayDiff(itemKey, todayKey)

  const timeString = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  if (diff === 0) {
    return `${STRINGS.date.today}, ${timeString}`
  } else if (diff === 1) {
    return `${STRINGS.date.yesterday}, ${timeString}`
  } else {
    const dayMonth = date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
    })
    return `${dayMonth}, ${timeString}`
  }
}
