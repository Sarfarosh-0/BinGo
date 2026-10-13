<<<<<<< HEAD
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
=======
import { CONFIDENCE_THRESHOLD } from './config.js'

/**
 * Evaluates model predictions against the 60% confidence gate and background filter.
 *
 * @param {Array<{className: string, probability: number}>} predictions
 * @returns {{
 *   kind: 'confident' | 'not_sure',
 *   categoryId?: string,
 *   confidence?: number,
 *   reason?: 'background' | 'low_confidence' | 'empty',
 *   topProbability: number,
 *   sortedPredictions: Array<{className: string, probability: number}>
 * }}
 */
export function evaluatePredictions(predictions = []) {
  if (!Array.isArray(predictions) || predictions.length === 0) {
    return {
      kind: 'not_sure',
      reason: 'empty',
      topProbability: 0,
      sortedPredictions: [],
    }
  }

  // Sort descending by probability
  const sorted = [...predictions].sort((a, b) => b.probability - a.probability)
  const top = sorted[0]

  if (!top) {
    return {
      kind: 'not_sure',
      reason: 'empty',
      topProbability: 0,
      sortedPredictions: sorted,
    }
  }

  const normalizedClass = top.className.toLowerCase().trim()

  // 1. If top predicted class is background -> Not sure
  if (normalizedClass === 'background') {
    return {
      kind: 'not_sure',
      reason: 'background',
      topProbability: top.probability,
      sortedPredictions: sorted,
    }
  }

  // 2. If top probability is below 0.60 (60%) -> Not sure
  if (top.probability < CONFIDENCE_THRESHOLD) {
    return {
      kind: 'not_sure',
      reason: 'low_confidence',
      topProbability: top.probability,
      sortedPredictions: sorted,
    }
  }

  // 3. Confident classification (>= 60% and not background)
  return {
    kind: 'confident',
    categoryId: normalizedClass,
    confidence: top.probability,
    topProbability: top.probability,
    sortedPredictions: sorted,
>>>>>>> 34af0729ef93c0a988739df7f4f7c459280ae23a
  }
}
