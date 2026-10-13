import { CONFIDENCE_THRESHOLD, VISIBLE_CATEGORIES } from './config.js'
import { predict } from './tm.js'

/**
 * Decision engine: runs model prediction on canvas, sorts probabilities,
 * applies background filter + 60% confidence gate.
 *
 * @param {object} model - Loaded TF.js graph model
 * @param {object} metadata - Model metadata with labels array
 * @param {HTMLCanvasElement} canvas - 224x224 input canvas
 * @returns {{
 *   kind: 'result' | 'not_sure',
 *   categoryId?: string,
 *   confidence?: number,
 *   reason?: 'background' | 'low_confidence' | 'empty' | 'unknown_class',
 *   ranked: Array<{ className: string, probability: number }>
 * }}
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

  // Hidden background class -> triggers Not sure
  if (top.className === 'background') {
    return { kind: 'not_sure', reason: 'background', ranked }
  }

  // Unknown class not in visible set -> triggers Not sure
  if (!VISIBLE_CATEGORIES.includes(top.className)) {
    return { kind: 'not_sure', reason: 'unknown_class', ranked }
  }

  // Confidence gate (>= 0.60 is confident)
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

/**
 * Evaluates pre-computed predictions against the 60% confidence gate and background filter.
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

  if (normalizedClass === 'background') {
    return {
      kind: 'not_sure',
      reason: 'background',
      topProbability: top.probability,
      sortedPredictions: sorted,
    }
  }

  if (top.probability < CONFIDENCE_THRESHOLD) {
    return {
      kind: 'not_sure',
      reason: 'low_confidence',
      topProbability: top.probability,
      sortedPredictions: sorted,
    }
  }

  return {
    kind: 'confident',
    categoryId: normalizedClass,
    confidence: top.probability,
    topProbability: top.probability,
    sortedPredictions: sorted,
  }
}
