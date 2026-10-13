import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Backdrop } from './components/Backdrop'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import { ImpactBar } from './components/ImpactBar'
import { Scanner } from './components/Scanner'
import { History } from './components/History'
import { AnalyzingView } from './components/AnalyzingView'
import { ResultCard } from './components/ResultCard'
import { useStreak } from './hooks/useStreak'
import { useHistory } from './hooks/useHistory'
import { processImageFile, validateImageFile } from './lib/image'
import { evaluatePredictions } from './lib/classify'
import { STRINGS } from './lib/strings'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'analyzing' | 'result' | 'history'
  const [rules, setRules] = useState(null)
  const [isModelReady, setIsModelReady] = useState(true)
  const [analyzingPreview, setAnalyzingPreview] = useState(null)
  const [activeResult, setActiveResult] = useState(null)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const { totalSorted, streak, recordConfidentScan } = useStreak()
  const { history, addEntry, setFeedback } = useHistory()

  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const runIdRef = useRef(0)
  const originatingTabRef = useRef('home')

  // Load rules.json on app mount
  useEffect(() => {
    fetch('/rules.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch rules.json')
        return res.json()
      })
      .then((data) => setRules(data))
      .catch((err) => {
        console.warn('Could not load public/rules.json, using fallback:', err)
      })
  }, [])

  // Browser history popstate handler for back navigation
  useEffect(() => {
    const handlePopState = (e) => {
      if (view === 'result' || view === 'analyzing') {
        setView(originatingTabRef.current || 'home')
        setActiveResult(null)
        setAnalyzingPreview(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [view])

  const handleOpenCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
      cameraInputRef.current.click()
    }
  }

  const handleOpenGallery = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
      galleryInputRef.current.click()
    }
  }

  const handleCancelAnalysis = useCallback(() => {
    runIdRef.current += 1 // Increment runId to invalidate in-flight promises
    setAnalyzingPreview(null)
    setView(originatingTabRef.current || 'home')
  }, [])

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage(null)

    try {
      validateImageFile(file)
    } catch (err) {
      setErrorMessage(err.message || STRINGS.errors.notImage)
      return
    }

    // Set origin before changing view
    originatingTabRef.current = view === 'history' ? 'history' : 'home'
    const currentRunId = ++runIdRef.current

    // Create immediate local object URL for preview
    const tempUrl = URL.createObjectURL(file)
    setAnalyzingPreview(tempUrl)
    setView('analyzing')

    const startTime = performance.now()

    try {
      // Process and downscale image offscreen (max side 512px)
      const { canvas, previewUrl, thumbUrl } = await processImageFile(file)

      // If user canceled during image decoding, abort
      if (runIdRef.current !== currentRunId) {
        URL.revokeObjectURL(tempUrl)
        return
      }

      // Update preview to scaled high-quality URL
      setAnalyzingPreview(previewUrl)
      URL.revokeObjectURL(tempUrl)

      // --- Model Classification ---
      // In Gate 4 this delegates to useModel/tm.js.
      // For Gate 3 flow testing, we run a simulated inference:
      let rawPredictions = []
      if (window.tmImageModel && typeof window.tmImageModel.predict === 'function') {
        rawPredictions = await window.tmImageModel.predict(canvas)
      } else {
        // High quality simulated demo prediction cycling waste classes
        const classes = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']
        const chosen = classes[Math.floor(Math.random() * classes.length)]
        rawPredictions = [
          { className: chosen, probability: 0.88 },
          { className: 'background', probability: 0.05 },
          { className: 'general', probability: 0.07 },
        ]
      }

      // Ensure minimum 500ms analyzing display time to prevent layout flicker
      const elapsed = performance.now() - startTime
      if (elapsed < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsed))
      }

      // Check if user canceled during inference wait
      if (runIdRef.current !== currentRunId) return

      // Evaluate through 60% confidence gate & background check
      const evaluated = evaluatePredictions(rawPredictions)

      if (evaluated.kind === 'confident') {
        // Persist to history (FIFO 50 max)
        const savedItem = addEntry({
          categoryId: evaluated.categoryId,
          confidence: evaluated.confidence,
          thumb: thumbUrl,
        })

        // Update lifetime count and streak
        recordConfidentScan(evaluated.categoryId)

        setActiveResult({
          kind: 'confident',
          categoryId: evaluated.categoryId,
          confidence: evaluated.confidence,
          previewUrl,
          thumb: thumbUrl,
          historyId: savedItem.id,
        })
      } else {
        // Not sure (no history or streak update)
        setActiveResult({
          kind: 'not_sure',
          reason: evaluated.reason,
          previewUrl,
        })
      }

      setCurrentFeedback(null)
      setView('result')
      window.history.pushState({ view: 'result' }, '')
    } catch (err) {
      console.error('Classification pipeline failed:', err)
      URL.revokeObjectURL(tempUrl)
      if (runIdRef.current === currentRunId) {
        setView(originatingTabRef.current || 'home')
        setErrorMessage(STRINGS.errors.scanFail)
      }
    }
  }

  const handleFeedback = (val) => {
    setCurrentFeedback(val)
    if (activeResult?.historyId) {
      setFeedback(activeResult.historyId, val)
    }
  }

  const handleOpenHistoryItem = (item) => {
    originatingTabRef.current = 'history'
    setActiveResult({
      kind: 'confident',
      categoryId: item.categoryId,
      confidence: item.confidence,
      previewUrl: item.thumb,
      thumb: item.thumb,
      historyId: item.id,
    })
    setCurrentFeedback(item.feedback)
    setView('result')
    window.history.pushState({ view: 'result' }, '')
  }

  const handleBackFromResult = () => {
    setView(originatingTabRef.current || 'home')
    setActiveResult(null)
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between overflow-x-hidden text-white font-sans">
      {/* Persistent Atmospheric Backdrop */}
      <Backdrop />

      {/* Hidden native HTML file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Transient Full-Screen Analyzing Screen */}
      {view === 'analyzing' && (
        <AnalyzingView
          previewUrl={analyzingPreview}
          onClose={handleCancelAnalysis}
        />
      )}

      {/* Main Max-Width Mobile Frame (Clamped to 480px) */}
      <main className="w-full max-w-[480px] mx-auto flex-1 flex flex-col px-4 pt-4 pb-28 gap-4">
        {/* Inline Error Notification Banner */}
        {errorMessage && (
          <div className="surface-glass rounded-2xl p-3 border border-[var(--coral-500)]/40 bg-[var(--coral-500)]/15 text-xs text-white flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Home Screen View */}
        {view === 'home' && (
          <>
            <header className="pt-2 pb-1">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{STRINGS.app.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--emerald-500)]/20 border border-[var(--emerald-400)]/30 text-[var(--emerald-400)]">
                  SDG 15
                </span>
              </h1>
              <p className="text-xs text-white/70 mt-0.5">
                {STRINGS.app.tagline}
              </p>
            </header>

            <ImpactBar totalSorted={totalSorted} streak={streak} />

            <Scanner
              ready={isModelReady}
              onGalleryClick={handleOpenGallery}
              onCameraClick={handleOpenCamera}
            />
          </>
        )}

        {/* History Screen View */}
        {view === 'history' && (
          <div className="flex-1 flex flex-col">
            <TopBar title={STRINGS.history.title} />
            <History
              items={history}
              onOpenItem={handleOpenHistoryItem}
            />
          </div>
        )}

        {/* Result Screen View */}
        {view === 'result' && activeResult && (
          <ResultCard
            result={activeResult}
            rules={rules}
            feedback={currentFeedback}
            onFeedback={handleFeedback}
            onScanAnother={handleOpenCamera}
            onBack={handleBackFromResult}
          />
        )}
      </main>

      {/* Floating Glass Bottom Navigation (Hidden on Analyzing and Result views) */}
      {view !== 'analyzing' && view !== 'result' && (
        <BottomNav
          active={view === 'history' ? 'history' : 'home'}
          onHome={() => setView('home')}
          onHistory={() => setView('history')}
          onScan={handleOpenCamera}
          scanDisabled={!isModelReady}
        />
      )}
    </div>
  )
}
