import { describe, it, expect } from 'vitest'
import { localDateKey, dayDiff, formatDateDisplay } from './date.js'
import { STRINGS } from './strings.js'

describe('date helpers', () => {
  it('formats a date as a zero-padded local key', () => {
    expect(localDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('computes exact whole-day differences across DST boundaries', () => {
    // US spring-forward and fall-back dates in 2026 — a naive hour/86_400_000
    // division would return a fractional day here.
    expect(dayDiff('2026-03-08', '2026-03-09')).toBe(1)
    expect(dayDiff('2026-10-31', '2026-11-01')).toBe(1)
    expect(dayDiff('2026-01-01', '2026-01-01')).toBe(0)
  })

  it('labels today and yesterday using strings.js', () => {
    expect(formatDateDisplay(Date.now()).startsWith(STRINGS.date.today)).toBe(true)
  })
})
