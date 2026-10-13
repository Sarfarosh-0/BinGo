import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Backdrop } from './components/Backdrop'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import { ImpactBar } from './components/ImpactBar'
import { Scanner } from './components/Scanner'
import { History } from './components/History'
import { AnalyzingView } from './components/AnalyzingView'
import { ResultCard } from './components/ResultCard'
import { Banner } from './components/Banner'
import { useStreak } from './hooks/useStreak'
import { useHistory } from './hooks/useHistory'
import { useModel } from './hooks/useModel'
import { loadRules } from './lib/rules'
import { processImageFile } from './lib/image'
import { classify } from './lib/classify'
import { STRINGS } from './lib/strings'

export default function App() {
  const [view, setView] = useState('home')
  const [originTab, setOriginTab] = useState('home')
  const [banner, setBanner] = useState(null) // { tone, message, onRetry? }
  const [analyzingCanvas, setAnalyzingCanvas] = useState(null)
  const [current, setCurrent] = useState(null) // ScanResult for ResultCard
  const [rules, setRules] = useState(null)

  const { totalSorted, streak, recordConfidentScan } = useStreak()
  const { history, addEntry, setFeedback } = useHistory()
  const { status: modelStatus, ready: isModelReady, error: modelError, model, metadata, retry: retryModel } = useModel()

  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const runIdRef = useRef(0)
  const displayUrlRef = useRef(null)

  // Load rules.json
  useEffect(() => {
    let cancelled = false
    loadRules()
      .then((r) => {
        if (!cancelled) setRules(r)
      })
      .catch((e) => {
        console.error('Rules load failed:', e)
        if (!cancelled) {
          setBanner({ tone: 'error', message: STRINGS.errors.rulesLoadFail })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Model load error banner
  useEffect(() => {
    if (modelStatus === 'error') {
      setBanner({
        tone: 'error',
        message: STRINGS.errors.modelLoadFail,
        onRetry: retryModel,
      })
    }
  }, [modelStatus, retryModel])

  // Browser history: pushState when entering result, popstate returns to origin tab
  useEffect(() => {
    if (view === 'result') {
      window.history.pushState({ view: 'result' }, '')
    }
  }, [view])

  useEffect(() => {
    const onPopState = (e) => {
      if (view === 'result') {
        // Revoke display object URL
        if (displayUrlRef.current) {
          URL.revokeObjectURL(displayUrlRef.current)
          displayUrlRef.current = null
        }
        setCurrent(null)
        setView(originTab)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [view, originTab])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (displayUrlRef.current) {
        URL.revokeObjectURL(displayUrlRef.current)
      }
    }
  }, [])

  const ready = isModelReady && !!rules

  const handleOpenCamera = useCallback(() => {
    if (!ready) return
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
      cameraInputRef.current.click()
    }
  }, [ready])

  const handleOpenGallery = useCallback(() => {
    if (!ready) return
    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
      galleryInputRef.current.click()
    }
  }, [ready])

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = '' // Allow same file again

    if (!ready || !model || !metadata || !rules) return

    // Ignore rapid multi-tap while already analyzing
    if (view === 'analyzing') return

    const runId = ++runIdRef.current
    setBanner(null)

    // Record origin for back navigation
    const from = view === 'history' ? 'history' : 'home'
    setOriginTab(from)

    try {
      const { modelCanvas, displayCanvas, thumb } = await processImageFile(file)

      if (runId !== runIdRef.current) return // canceled

      setAnalyzingCanvas(displayCanvas)

      // Minimum 500ms analyzing display (PRD §9.1)
      const minDisplay = new Promise((r) => setTimeout(r, 500))

      let result
      try {
        result = classify(model, metadata, modelCanvas)
      } catch (inferErr) {
        console.error('Inference failed:', inferErr)
        if (runId !== runIdRef.current) return
        setView(from)
        setBanner({ tone: 'error', message: STRINGS.errors.scanFail })
        return
      }

      await minDisplay
      if (runId !== runIdRef.current) return

      if (result.kind === 'result') {
        // Persist: thumbnail + history + counters
        const entry = addEntry({
          categoryId: result.categoryId,
          confidence: result.confidence,
          thumb,
        })
        recordConfidentScan(result.categoryId)

        // Build display URL for result photo
        let thumbUrl = thumb
        try {
          thumbUrl = displayCanvas.toDataURL('image/jpeg', 0.75)
        } catch {
          /* keep thumb */
        }

        setCurrent({
          ...result,
          id: entry.id,
          feedback: null,
          thumbUrl,
        })
      } else {
        // Not sure — not saved to history
        let thumbUrl = thumb
        try {
          thumbUrl = displayCanvas.toDataURL('image/jpeg', 0.75)
        } catch {
          /* keep thumb */
        }
        setCurrent({ ...result, thumbUrl })
      }

      setView('result')
    } catch (err) {
      if (runId !== runIdRef.current) return
      console.error('Scan pipeline failed:', err)
      setView(from)
      if (err.message === 'not_image') {
        setBanner({ tone: 'error', message: STRINGS.errors.notImage })
      } else {
        setBanner({ tone: 'error', message: STRINGS.errors.readFail })
      }
    }
  }

  const handleCancelAnalyzing = () => {
    runIdRef.current++ // discard late predictions
    setAnalyzingCanvas(null)
    setView(originTab)
  }

  const handleScanAnother = () => {
    runIdRef.current++
    setCurrent(null)
    setAnalyzingCanvas(null)
    setView('home')
    // Launch camera immediately
    setTimeout(() => {
      if (cameraInputRef.current) {
        cameraInputRef.current.value = ''
        cameraInputRef.current.click()
      }
    }, 80)
  }

  const handleResultBack = () => {
    // Trigger browser back so popstate handler cleans up consistently
    if (window.history.state?.view === 'result') {
      window.history.back()
    } else {
      setCurrent(null)
      setView(originTab)
    }
  }

  const handleFeedback = (val) => {
    if (current?.id) {
      setFeedback(current.id, val)
      setCurrent((prev) => (prev ? { ...prev, feedback: val } : prev))
    }
  }

  const dismissBanner = () => setBanner(null)

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between overflow-x-hidden text-white font-sans">
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

      {/* Main Max-Width Mobile Frame */}
      <main className="w-full max-w-[480px] mx-auto flex-1 flex flex-col px-4 pt-4 pb-28 gap-4">
        {banner && (
          <Banner
            tone={banner.tone}
            message={banner.message}
            onRetry={banner.onRetry}
            onDismiss={dismissBanner}
          />
        )}

        {view === 'home' && (
          <>
            <header className="pt-2 pb-1">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{STRINGS.app.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--emerald-500)]/20 border border-[var(--emerald-400)]/30 text-[var(--emerald-400)]">
                  SDG 15
                </span>
              </h1>
              <p className="text-xs text-white/70 mt-0.5">{STRINGS.app.tagline}</p>
            </header>

            <ImpactBar totalSorted={totalSorted} streak={streak} />

            <Scanner
              ready={ready}
              loadingText={modelStatus === 'error' ? STRINGS.errors.modelLoadFail : STRINGS.home.loadingModel}
              onGalleryClick={handleOpenGallery}
              onCameraClick={handleOpenCamera}
            />
          </>
        )}

        {view === 'analyzing' && (
          <AnalyzingView photoCanvas={analyzingCanvas} onClose={handleCancelAnalyzing} />
        )}

        {view === 'result' && current && rules && (
          <ResultCard
            current={current}
            rules={rules}
            onFeedback={handleFeedback}
            onScanAnother={handleScanAnother}
            onBack={handleResultBack}
          />
        )}

        {view === 'history' && (
          <div className="flex-1 flex flex-col">
            <TopBar title={STRINGS.history.title} />
            <History
              items={history}
              onOpenItem={(item) => {
                // Open that scan's confident result from history
                const cat = rules?.categories?.[item.categoryId]
                if (!cat) return
                setOriginTab('history')
                setCurrent({
                  kind: 'result',
                  categoryId: item.categoryId,
                  confidence: item.confidence,
                  id: item.id,
                  feedback: item.feedback,
                  thumbUrl: item.thumb || '',
                })
                setView('result')
              }}
            />
          </div>
        )}
      </main>

      {/* Floating Glass Bottom Navigation — hidden on analyzing/result full views handled per design */}
      {view !== 'analyzing' && (
        <BottomNav
          active={view === 'history' ? 'history' : 'home'}
          onHome={() => {
            setCurrent(null)
            setView('home')
          }}
          onHistory={() => {
            setCurrent(null)
            setView('history')
          }}
          onScan={handleOpenCamera}
          scanDisabled={!ready}
        />
      )}
    </div>
  )
}
