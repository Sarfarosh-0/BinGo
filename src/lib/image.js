import { IMAGE_CONFIG } from './config.js'
<<<<<<< HEAD

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
  ctx.drawImage(source, dx, dy, dw, dh)
  return canvas
}

/** Generate compressed JPEG thumbnail data URL for history storage. */
export function makeThumbnail(source, maxSide = IMAGE_CONFIG.THUMB_MAX_SIDE, quality = IMAGE_CONFIG.THUMB_QUALITY) {
  const canvas = resizeToCanvas(source, maxSide)
  return canvas.toDataURL('image/jpeg', quality)
}

/** Full pipeline: decode file -> model canvas + display canvas + thumbnail. */
export async function processImageFile(file) {
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('not_image')
  }
  const decoded = await decodeImage(file)
  const modelCanvas = toModelCanvas(decoded, 224)
  const displayCanvas = resizeToCanvas(decoded, IMAGE_CONFIG.INPUT_MAX_SIDE)
  const thumb = makeThumbnail(decoded)
  if (typeof decoded.close === 'function') decoded.close()
  return { modelCanvas, displayCanvas, thumb }
=======
import { STRINGS } from './strings.js'

/**
 * Validates that the selected file is an image.
 */
export function validateImageFile(file) {
  if (!file) throw new Error(STRINGS.errors.readFail)
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error(STRINGS.errors.notImage)
  }
  return true
}

/**
 * Decodes an image file with EXIF orientation awareness
 * and scales it to fit within maxSide offscreen canvas.
 */
export async function processImageFile(file, maxSide = IMAGE_CONFIG.INPUT_MAX_SIDE) {
  validateImageFile(file)

  let sourceWidth, sourceHeight, drawSource, cleanupSource

  // 1. Try modern createImageBitmap with EXIF auto-orientation
  if (typeof window.createImageBitmap === 'function') {
    try {
      const bitmap = await window.createImageBitmap(file, {
        imageOrientation: 'from-image',
      })
      sourceWidth = bitmap.width
      sourceHeight = bitmap.height
      drawSource = bitmap
      cleanupSource = () => bitmap.close?.()
    } catch {
      // Fall through to HTMLImageElement fallback
    }
  }

  // 2. Fallback to HTMLImageElement
  if (!drawSource) {
    const objectUrl = URL.createObjectURL(file)
    const img = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error(STRINGS.errors.readFail))
      image.src = objectUrl
    })
    sourceWidth = img.naturalWidth || img.width
    sourceHeight = img.naturalHeight || img.height
    drawSource = img
    cleanupSource = () => URL.revokeObjectURL(objectUrl)
  }

  // Calculate clamped dimensions
  let targetWidth = sourceWidth
  let targetHeight = sourceHeight

  if (targetWidth > maxSide || targetHeight > maxSide) {
    if (targetWidth >= targetHeight) {
      targetHeight = Math.round((sourceHeight * maxSide) / sourceWidth)
      targetWidth = maxSide
    } else {
      targetWidth = Math.round((sourceWidth * maxSide) / sourceHeight)
      targetHeight = maxSide
    }
  }

  // Render to offscreen canvas
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')

  // Smooth scaling
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(drawSource, 0, 0, targetWidth, targetHeight)

  // Generate thumbnail and preview URL
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
  const thumbUrl = createThumbnail(canvas)

  cleanupSource?.()

  return {
    canvas,
    previewUrl: dataUrl,
    thumbUrl,
    width: targetWidth,
    height: targetHeight,
  }
}

/**
 * Creates a lightweight compressed JPEG thumbnail (max side 100px, quality 0.60)
 * Consumes ~3-5 KB for safe localStorage storage.
 */
export function createThumbnail(sourceCanvas, maxThumbSide = IMAGE_CONFIG.THUMB_MAX_SIDE) {
  let w = sourceCanvas.width
  let h = sourceCanvas.height

  if (w > maxThumbSide || h > maxThumbSide) {
    if (w >= h) {
      h = Math.round((h * maxThumbSide) / w)
      w = maxThumbSide
    } else {
      w = Math.round((w * maxThumbSide) / h)
      h = maxThumbSide
    }
  }

  const thumbCanvas = document.createElement('canvas')
  thumbCanvas.width = Math.max(1, w)
  thumbCanvas.height = Math.max(1, h)
  const ctx = thumbCanvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'medium'
  ctx.drawImage(sourceCanvas, 0, 0, thumbCanvas.width, thumbCanvas.height)

  return thumbCanvas.toDataURL('image/jpeg', IMAGE_CONFIG.THUMB_QUALITY)
>>>>>>> 34af0729ef93c0a988739df7f4f7c459280ae23a
}
