/**
 * Bundled "Try a sample" test photos (public/samples) for quick-trying the
 * TensorFlow.js classifier without a camera. Each sample key maps to a real
 * photo that flows through the exact same scan pipeline as a user upload.
 */

// Sample key -> file inside public/samples, served as a static asset.
const SAMPLE_IMAGE_FILES = {
  bottle: 'samples/bottle.jpg',
  organic: 'samples/organic.jpg',
  battery: 'samples/battery.jpg',
}

const BASE_URL = import.meta.env.BASE_URL || '/'

/** Resolve the public URL for a sample key, or null when the key is unknown. */
export function sampleImageUrl(type) {
  const rel = SAMPLE_IMAGE_FILES[type]
  return rel ? `${BASE_URL}${rel}` : null
}

/**
 * Fetch a bundled sample photo and wrap it as a File so it can be classified
 * just like a camera capture or gallery upload.
 */
export async function createSampleWasteFile(type = 'bottle') {
  const url = sampleImageUrl(type)
  if (!url) return null

  const res = await fetch(url, { cache: 'force-cache' })
  if (!res.ok) {
    throw new Error(`Failed to load sample image: ${res.status}`)
  }

  const blob = await res.blob()
  const name = url.split('/').pop() || `sample_${type}.jpg`
  return new File([blob], name, { type: blob.type || 'image/jpeg' })
}
