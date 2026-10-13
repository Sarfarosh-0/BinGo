import { CONFIDENCE_THRESHOLD, VISIBLE_CATEGORIES } from './config.js'
import { predict } from './tm.js'

/**
 * Decision engine: sorts probabilities, applies background filter + confidence gate.
 * @returns {{ kind: 'result'|'not_sure', categoryId?: string, confidence?: number, reason?: string, ranked: Array }}
 */
export function classify(model, metadata, canvas) {
  const probs = predict(model, canvas)
  const labels = metadata.labels

  const ranked = labels
    .map((className, i) => ({ className, probability: probs[i] ?? 0 }))
    .sort((a, b) => b.probability - a.probability)

  const top = ranked[0]
  if (!top) {
    return { kind: 'not_sure', reason: 'empty', ranked }
  }

  // Hidden background class (if present in model labels) -> Not sure
  if (top.className === 'background') {
    return { kind: 'not_sure', reason: 'background', ranked }
  }

  // Unknown class not in visible set -> Not sure
  if (!VISIBLE_CATEGORIES.includes(top.className)) {
    return { kind: 'not_sure', reason: 'unknown_class', ranked }
  }

  // Confidence gate (>= threshold is confident)
  if (top.probability < CONFIDENCE_THRESHOLD) {
    return { kind: 'not_sure', reason: 'low_confidence', ranked }
  }

  return {
    kind: 'result',
    categoryId: top.className,
    confidence: top.probability,
    ranked,
  }
}
