import { useState, useMemo, useCallback } from 'react'
import { getProgress, setProgress } from '../lib/storage'
import { localDateKey, dayDiff } from '../lib/date'

export function useStreak() {
  const [progress, setProgressState] = useState(() => getProgress())

  // Effective streak for display on Home screen:
  // If lastDate is today or yesterday, show count. If older, show 0 (inactive streak).
  const effectiveStreak = useMemo(() => {
    const { count, lastDate } = progress.streak
    if (!lastDate || count === 0) return 0
    const today = localDateKey(new Date())
    const diff = dayDiff(lastDate, today)
    if (diff === 0 || diff === 1) {
      return count
    }
    return 0
  }, [progress.streak])

  const recordConfidentScan = useCallback((categoryId) => {
    setProgressState((prev) => {
      const today = localDateKey(new Date())
      const { count: prevCount, lastDate: prevDate } = prev.streak

      let newCount = prevCount
      let newDate = prevDate

      if (!prevDate) {
        // First scan ever
        newCount = 1
        newDate = today
      } else {
        const diff = dayDiff(prevDate, today)
        if (diff === 0) {
          // Same day, streak count unchanged
          newDate = today
        } else if (diff === 1) {
          // Consecutive calendar day
          newCount = prevCount + 1
          newDate = today
        } else if (diff > 1) {
          // Missed a day or more, reset streak to 1
          newCount = 1
          newDate = today
        }
        // If diff < 0 (clock moved back), ignore streak modification
      }

      const updated = {
        totalSorted: prev.totalSorted + 1,
        byCategory: {
          ...prev.byCategory,
          [categoryId]: (prev.byCategory[categoryId] || 0) + 1,
        },
        streak: {
          count: newCount,
          lastDate: newDate,
        },
      }

      setProgress(updated)
      return updated
    })
  }, [])

  return {
    totalSorted: progress.totalSorted,
    streak: effectiveStreak,
    rawStreakCount: progress.streak.count,
    byCategory: progress.byCategory,
    recordConfidentScan,
  }
}

export default useStreak
