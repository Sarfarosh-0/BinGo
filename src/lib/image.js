import { IMAGE_CONFIG } from './config.js'
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
}
