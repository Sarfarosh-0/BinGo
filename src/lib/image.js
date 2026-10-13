import { IMAGE_CONFIG } from './config.js'

/**
 * EXIF-aware decode + offscreen canvas resize + thumbnail generation.
 * Uses createImageBitmap with imageOrientation:'from-image' where available.
 */

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('decode_failed'))
    }
    img.src = url
  })
}

/** Decode a File/Blob into an upright HTMLImageElement or ImageBitmap. */
export async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // fall through to <img>
    }
  }
  return loadImageElement(file)
}

/** Validates file is an image MIME type. */
export function validateImageFile(file) {
  if (!file) throw new Error('Could not read that photo.')
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error("That file isn't an image. Please choose a photo.")
  }
  return true
}

/** Draw source to an offscreen canvas scaled so max side === maxSide. */
export function resizeToCanvas(source, maxSide) {
  const sw = source.width || source.naturalWidth
  const sh = source.height || source.naturalHeight
  if (!sw || !sh) throw new Error('invalid_source')

  const scale = Math.min(1, maxSide / Math.max(sw, sh))
  const w = Math.max(1, Math.round(sw * scale))
  const h = Math.max(1, Math.round(sh * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas_unavailable')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, w, h)
  return canvas
}

/** Resize to exact square model input (224x224) with cover-fit center crop. */
export function toModelCanvas(source, size = 224) {
  const sw = source.width || source.naturalWidth
  const sh = source.height || source.naturalHeight
  if (!sw || !sh) throw new Error('invalid_source')

  const scale = Math.max(size / sw, size / sh)
  const dw = Math.round(sw * scale)
  const dh = Math.round(sh * scale)
  const dx = Math.round((size - dw) / 2)
  const dy = Math.round((size - dh) / 2)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas_unavailable')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, dx, dy, dw, dh)
  return canvas
}

/** Generate compressed JPEG thumbnail data URL for history storage. */
export function makeThumbnail(source, maxSide = IMAGE_CONFIG.THUMB_MAX_SIDE, quality = IMAGE_CONFIG.THUMB_QUALITY) {
  const canvas = resizeToCanvas(source, maxSide)
  return canvas.toDataURL('image/jpeg', quality)
}

// Alias for backward compatibility
export const createThumbnail = makeThumbnail

/**
 * Full pipeline: decode file -> model canvas (224x224 square) + display canvas (≤512px) + thumbnail.
 * Returns { modelCanvas, displayCanvas, thumb, previewUrl, thumbUrl, canvas }
 */
export async function processImageFile(file) {
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('not_image')
  }
  const decoded = await decodeImage(file)
  const modelCanvas = toModelCanvas(decoded, 224)
  const displayCanvas = resizeToCanvas(decoded, IMAGE_CONFIG.INPUT_MAX_SIDE)
  const thumb = makeThumbnail(decoded)
  const previewUrl = displayCanvas.toDataURL('image/jpeg', 0.85)
  if (typeof decoded.close === 'function') decoded.close()
  return { modelCanvas, displayCanvas, thumb, previewUrl, thumbUrl: thumb, canvas: modelCanvas }
}
