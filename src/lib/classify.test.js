import { describe, it, expect } from 'vitest'
import { evaluatePredictions } from './classify.js'

describe('evaluatePredictions', () => {
  it('returns not_sure/empty when there are no predictions', () => {
    expect(evaluatePredictions([])).toMatchObject({ kind: 'not_sure', reason: 'empty' })
  })

  it('returns not_sure when the hidden background class wins', () => {
    const result = evaluatePredictions([
      { className: 'background', probability: 0.9 },
      { className: 'recyclable', probability: 0.1 },
    ])
    expect(result).toMatchObject({ kind: 'not_sure', reason: 'background' })
  })

  it('returns not_sure when the top class is below the confidence gate', () => {
    const result = evaluatePredictions([{ className: 'recyclable', probability: 0.59 }])
    expect(result).toMatchObject({ kind: 'not_sure', reason: 'low_confidence' })
  })

  it('returns confident at the threshold and normalises the label', () => {
    const result = evaluatePredictions([{ className: ' Recyclable ', probability: 0.6 }])
    expect(result).toMatchObject({ kind: 'confident', categoryId: 'recyclable' })
  })

  it('ranks predictions by probability descending', () => {
    const result = evaluatePredictions([
      { className: 'organic', probability: 0.2 },
      { className: 'recyclable', probability: 0.9 },
    ])
    expect(result.sortedPredictions[0].className).toBe('recyclable')
  })
})
