import { STORAGE_KEYS, HISTORY_MAX_ITEMS } from './config.js'

// In-memory fallback for private browsing / blocked storage
const memoryStore = new Map()

let isStorageAvailable = null

function checkStorage() {
  if (isStorageAvailable !== null) return isStorageAvailable
  try {
    const testKey = '__bingo_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    isStorageAvailable = true
  } catch (e) {
    console.warn('LocalStorage unavailable. Using in-memory fallback.', e)
    isStorageAvailable = false
  }
  return isStorageAvailable
}

export function getRawItem(key) {
  if (checkStorage()) {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return memoryStore.get(key) || null
    }
  }
  return memoryStore.get(key) || null
}

export function setRawItem(key, value) {
  if (checkStorage()) {
    try {
      window.localStorage.setItem(key, value)
      return true
    } catch (e) {
      // Quota or access error, keep in memory store as fallback
      memoryStore.set(key, value)
      throw e
    }
  }
  memoryStore.set(key, value)
  return true
}

export function getHistory() {
  try {
    const raw = getRawItem(STORAGE_KEYS.HISTORY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.slice(0, HISTORY_MAX_ITEMS)
    }
    return []
  } catch (e) {
    console.warn('Corrupt history in storage, resetting to empty array:', e)
    return []
  }
}

/**
 * Persists history array. If localStorage quota is exceeded,
 * automatically drops oldest items iteratively until the write succeeds.
 */
export function safeSetHistory(items) {
  if (!Array.isArray(items)) return false
  let currentItems = items.slice(0, HISTORY_MAX_ITEMS)

  while (currentItems.length > 0) {
    try {
      const serialized = JSON.stringify(currentItems)
      setRawItem(STORAGE_KEYS.HISTORY, serialized)
      return true
    } catch (e) {
      console.warn('Storage write failed (possible quota). Dropping oldest entry:', e)
      currentItems.pop() // Drop oldest item from end of array
    }
  }

  // If even 1 item failed, store in memory fallback
  memoryStore.set(STORAGE_KEYS.HISTORY, JSON.stringify(items.slice(0, HISTORY_MAX_ITEMS)))
  return false
}

export function getDefaultProgress() {
  return {
    totalSorted: 0,
    byCategory: {
      recyclable: 0,
      organic: 0,
      ewaste: 0,
      hazardous: 0,
      general: 0,
    },
    streak: {
      count: 0,
      lastDate: null,
    },
  }
}

export function getProgress() {
  try {
    const raw = getRawItem(STORAGE_KEYS.PROGRESS)
    if (!raw) return getDefaultProgress()
    const parsed = JSON.parse(raw)
    return {
      totalSorted: typeof parsed.totalSorted === 'number' ? parsed.totalSorted : 0,
      byCategory: {
        ...getDefaultProgress().byCategory,
        ...(parsed.byCategory || {}),
      },
      streak: {
        count: typeof parsed?.streak?.count === 'number' ? parsed.streak.count : 0,
        lastDate: typeof parsed?.streak?.lastDate === 'string' ? parsed.streak.lastDate : null,
      },
    }
  } catch (e) {
    console.warn('Corrupt progress in storage, resetting to default:', e)
    return getDefaultProgress()
  }
}

export function setProgress(progress) {
  try {
    setRawItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
    return true
  } catch (e) {
    console.warn('Failed to save progress to storage:', e)
    memoryStore.set(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
    return false
  }
}
