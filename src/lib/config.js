// App constants and configuration thresholds
export const CONFIDENCE_THRESHOLD = 0.60 // 60% confidence gate
export const HISTORY_MAX_ITEMS = 50

export const STORAGE_KEYS = {
  HISTORY: 'bingo:v1:history',
  PROGRESS: 'bingo:v1:progress',
}

export const CATEGORIES = [
  'recyclable',
  'organic',
  'ewaste',
  'hazardous',
  'general',
  'background', // hidden class
]

export const VISIBLE_CATEGORIES = [
  'recyclable',
  'organic',
  'ewaste',
  'hazardous',
  'general',
]

export const IMAGE_CONFIG = {
  INPUT_MAX_SIDE: 512,
  THUMB_MAX_SIDE: 100,
  THUMB_QUALITY: 0.60,
}
