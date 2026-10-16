// TensorFlow.js model loader — the ONLY module allowed to touch the tf global (Agent-Rules §4.1)
// TF.js is loaded via a self-hosted script tag in index.html (public/vendor/tf.min.js,
// vendored from the pinned npm package). We access the global here instead of importing
// the npm package so Vite does not bundle a second, redundant copy of the library.

/** @returns {typeof import('@tensorflow/tfjs')} */
const getTf = () => {
  const t = globalThis.tf
  if (!t) throw new Error('TensorFlow.js not loaded — check the /vendor/tf.min.js script tag in index.html')
  return t
}

const BASE = import.meta.env.BASE_URL || '/'
const MODEL_URL = `${BASE}model/model.json`
const METADATA_URL = `${BASE}model/metadata.json`
const INDEXEDDB_KEY = 'indexeddb://bingo-waste-model-v1'

// Global singleton cache so model is NEVER re-downloaded or re-parsed multiple times
let cachedModelPromise = null

/**
 * Loads the TF.js graph model + metadata.json with singleton promise & IndexedDB persistence.
 * Returns { model, metadata } where metadata.labels maps output indices to class IDs.
 */
export async function loadModel() {
  if (cachedModelPromise) {
    return cachedModelPromise
  }

  cachedModelPromise = (async () => {
    const tf = getTf()

    // 1. Fetch metadata in parallel
    const metadataPromise = fetch(METADATA_URL).then((r) => {
      if (!r.ok) throw new Error(`metadata HTTP ${r.status}`)
      return r.json()
    })

    // 2. Try loading model from IndexedDB first for instant, offline, zero-network load
    let model = null
    try {
      if ('indexedDB' in window) {
        model = await tf.loadGraphModel(INDEXEDDB_KEY)
      }
    } catch {
      model = null
    }

    // 3. If not in IndexedDB or failed, load from static HTTP path and save to IndexedDB
    if (!model) {
      model = await tf.loadGraphModel(MODEL_URL)
      try {
        if ('indexedDB' in window) {
          model.save(INDEXEDDB_KEY).catch((e) => {
            console.warn('Failed to cache model in IndexedDB (non-fatal):', e)
          })
        }
      } catch {
        /* IndexedDB save optional */
      }
    }

    const metadata = await metadataPromise

    if (!metadata?.labels?.length) {
      throw new Error('Model metadata missing labels')
    }

    // 4. Initial validation
    const blank = tf.zeros([1, 224, 224, 3])
    let out
    try {
      out = model.predict(blank)
    } catch {
      out = model.execute({ image: blank })
    }
    const outData = await out.data()
    if (outData.length !== metadata.labels.length) {
      out.dispose()
      blank.dispose()
      throw new Error(`Model output size ${outData.length} !== labels ${metadata.labels.length}`)
    }
    out.dispose()
    blank.dispose()

    return { model, metadata }
  })().catch((err) => {
    // Reset cache on hard failure so subsequent retries can succeed
    cachedModelPromise = null
    throw err
  })

  return cachedModelPromise
}

/**
 * Runs non-blocking asynchronous inference on a preprocessed canvas.
 * Disposes all intermediate tensors promptly to prevent WebGL memory leaks.
 * @param {object} model - loaded tf.GraphModel
 * @param {HTMLCanvasElement} canvas - 224×224 RGB canvas (pixels 0-255)
 * @returns {Promise<number[]>} probability array matching metadata.labels order
 */
export async function predict(model, canvas) {
  const tf = getTf()
  const tensor = tf.browser.fromPixels(canvas).toFloat().div(255.0)
  const batched = tensor.expandDims(0)
  let output
  try {
    output = model.predict(batched)
  } catch {
    output = model.execute({ image: batched })
  }

  // Non-blocking async GPU readback — does NOT freeze the browser main thread
  const data = await output.data()

  // Explicit cleanup of tensors
  tensor.dispose()
  batched.dispose()
  output.dispose()

  return Array.from(data)
}

/** Warmup inference with a blank 224×224 tensor (compiles WebGL shaders early). */
export async function warmup(model, labelCount) {
  const tf = getTf()
  const blank = tf.zeros([1, 224, 224, 3])
  let output
  try {
    output = model.predict(blank)
  } catch {
    output = model.execute({ image: blank })
  }
  const data = await output.data()
  blank.dispose()
  output.dispose()
  return data.length === labelCount
}

/** Force clears model cache if recovery or re-download is requested */
export function clearModelCache() {
  cachedModelPromise = null
}
