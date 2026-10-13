import { useState, useCallback } from 'react'
import { getHistory, safeSetHistory } from '../lib/storage'
import { HISTORY_MAX_ITEMS } from '../lib/config'

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `scan_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function useHistory() {
  const [history, setHistoryState] = useState(() => getHistory())

  const addEntry = useCallback(({ categoryId, confidence, thumb }) => {
    const newEntry = {
      id: generateId(),
      ts: Date.now(),
      categoryId,
      confidence,
      thumb: thumb || '',
      feedback: null,
    }

    setHistoryState((prev) => {
      const next = [newEntry, ...prev].slice(0, HISTORY_MAX_ITEMS)
      safeSetHistory(next)
      return next
    })

    return newEntry
  }, [])

  const setFeedback = useCallback((id, feedback) => {
    setHistoryState((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, feedback } : item
      )
      safeSetHistory(next)
      return next
    })
  }, [])

  return {
    history,
    addEntry,
    setFeedback,
  }
}

export default useHistory
