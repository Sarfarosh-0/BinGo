// TensorFlow.js model loader — the ONLY module allowed to import @tensorflow/tfjs (Agent-Rules §4.1)
import * as tf from '@tensorflow/tfjs'

const BASE = import.meta.env.BASE_URL || '/'
const MODEL_URL = `${BASE}model/model.json`
const METADATA_URL = `${BASE}model/metadata.json`

/**
 * Loads the TF.js graph model + metadata.json.
 * Returns { model, metadata } where metadata.labels maps output indices to class IDs.
 */
export async function loadModel() {
  const [model, metadata] = await Promise.all([
    tf.loadGraphModel(MODEL_URL),
    fetch(METADATA_URL).then((r) => {
      if (!r.ok) throw new Error(`metadata HTTP ${r.status}`)
      return r.json()
    }),
  ])

  if (!metadata?.labels?.length) {
    throw new Error('Model metadata missing labels')
  }

  // Warmup + validate output size
  const blank = tf.zeros([1, 224, 224, 3])
  let out
  try {
    out = model.predict(blank)
  } catch {
    out = model.execute({ image: blank })
  }
  const outData = await out.data()
  if (outData.length !== metadata.labels.length) {
    throw new Error(`Model output size ${outData.length} !== labels ${metadata.labels.length}`)
  }
  out.dispose()
  blank.dispose()

  return { model, metadata }
}

/**
 * Runs inference on a preprocessed canvas.
 * @param {tf.GraphModel} model
 * @param {HTMLCanvasElement} canvas - 224x224 RGB canvas with pixels 0-255
 * @returns {number[]} probabilities matching metadata.labels order
 */
export function predict(model, canvas) {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(canvas).toFloat().div(255.0)
    const batched = tensor.expandDims(0)
    // Graph models may need named inputs; fall back to single-tensor predict
    let output
    try {
      output = model.predict(batched)
    } catch {
      output = model.execute({ image: batched })
    }
    return Array.from(output.dataSync())
  })
}

/** Warmup inference with a blank 224x224 tensor (compiles WebGL shaders early). */
export function warmup(model, labelCount) {
  return tf.tidy(() => {
    const blank = tf.zeros([1, 224, 224, 3])
    let output
    try {
      output = model.predict(blank)
    } catch {
      output = model.execute({ image: blank })
    }
    return output.dataSync().length === labelCount
  })
}

export { tf }
