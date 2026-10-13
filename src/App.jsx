import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Backdrop } from './components/Backdrop'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import { Sidebar } from './components/Sidebar'
import { ImpactBar } from './components/ImpactBar'
import { Scanner } from './components/Scanner'
import { History } from './components/History'
import { ImpactCounter } from './components/ImpactCounter'
import { ScanSheet } from './components/ScanSheet'
import { AnalyzingView } from './components/AnalyzingView'
import { ResultCard } from './components/ResultCard'
import { Banner } from './components/Banner'
import { CategoryIcon } from './components/CategoryIcon'
import { useStreak } from './hooks/useStreak'
import { useHistory } from './hooks/useHistory'
import { useModel } from './hooks/useModel'
import { loadRules } from './lib/rules'
import { processImageFile } from './lib/image'
import { classify } from './lib/classify'
import { STRINGS } from './lib/strings'
import { CATEGORY_THEME } from './lib/categoryTheme'
import { ArrowRight } from 'lucide-react'

const STATIC_CATEGORIES = ['recyclable', 'organic', 'ewaste', 'hazardous', 'general']

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'analyzing' | 'result' | 'history' | 'impact'
  const [originTab, setOriginTab] = useState('home')
  const [banner, setBanner] = useState(null) // { tone, message, onRetry? }
  const [analyzingPreview, setAnalyzingPreview] = useState(null) // object URL or data URL
  const [activeResult, setActiveResult] = useState(null)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [rules, setRules] = useState(null)
  const [isScanSheetOpen, setIsScanSheetOpen] = useState(false)

  const { totalSorted, streak, byCategory, recordConfidentScan } = useStreak()
  const { history, addEntry, setFeedback } = useHistory()
  const {
    status: modelStatus,
    ready: isModelReady,
    model,
    metadata,
    retry: retryModel,
  } = useModel()

  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const runIdRef = useRef(0)
  const tempUrlRef = useRef(null)

  // Load rules.json on mount
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

  // Show model error banner
  useEffect(() => {
    if (modelStatus === 'error') {
      setBanner({
        tone: 'error',
        message: STRINGS.errors.modelLoadFail,
        onRetry: retryModel,
      })
    }
  }, [modelStatus, retryModel])

  // pushState when entering result view
  useEffect(() => {
    if (view === 'result') {
      window.history.pushState({ view: 'result' }, '')
    }
  }, [view])

  // popstate: browser back returns to origin tab
  useEffect(() => {
    const onPopState = () => {
      if (view === 'result') {
        setActiveResult(null)
        setView(originTab)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [view, originTab])

  // Cleanup any lingering object URLs on unmount
  useEffect(() => {
    return () => {
      if (tempUrlRef.current) {
        URL.revokeObjectURL(tempUrlRef.current)
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

  const handleCancelAnalysis = useCallback(() => {
    runIdRef.current += 1
    if (tempUrlRef.current) {
      URL.revokeObjectURL(tempUrlRef.current)
      tempUrlRef.current = null
    }
    setAnalyzingPreview(null)
    setView(originTab)
  }, [originTab])

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = '' // Allow same file again

    // Guard: don't start while already analyzing
    if (view === 'analyzing') return
    if (!ready || !model || !metadata || !rules) return

    const from = (view === 'history' || view === 'impact') ? view : 'home'
    setOriginTab(from)
    setBanner(null)

    const runId = ++runIdRef.current

    // Immediate low-latency preview via object URL
    const tempUrl = URL.createObjectURL(file)
    tempUrlRef.current = tempUrl
    setAnalyzingPreview(tempUrl)
    setView('analyzing')

    const startTime = performance.now()

    try {
      const { modelCanvas, displayCanvas, thumb, previewUrl } = await processImageFile(file)

      if (runId !== runIdRef.current) {
        URL.revokeObjectURL(tempUrl)
        return
      }

      // Upgrade to high-quality downscaled preview
      setAnalyzingPreview(previewUrl)
      URL.revokeObjectURL(tempUrl)
      tempUrlRef.current = null

      // Enforce minimum 500ms analyzing display (PRD §9.1)
      const elapsed = performance.now() - startTime
      if (elapsed < 500) {
        await new Promise((r) => setTimeout(r, 500 - elapsed))
      }
      if (runId !== runIdRef.current) return

      // Run classification
      let result
      try {
        result = classify(model, metadata, modelCanvas)
      } catch (inferErr) {
        console.error('Inference failed:', inferErr)
        if (runId !== runIdRef.current) return
        setAnalyzingPreview(null)
        setView(from)
        setBanner({ tone: 'error', message: STRINGS.errors.scanFail })
        return
      }

      // Build display preview URL
      let displayPreviewUrl = thumb
      try {
        displayPreviewUrl = displayCanvas.toDataURL('image/jpeg', 0.75)
      } catch {
        /* keep thumb */
      }

      if (result.kind === 'result') {
        const entry = addEntry({
          categoryId: result.categoryId,
          confidence: result.confidence,
          thumb,
        })
        recordConfidentScan(result.categoryId)

        setActiveResult({
          kind: 'confident',
          categoryId: result.categoryId,
          confidence: result.confidence,
          previewUrl: displayPreviewUrl,
          thumb,
          historyId: entry.id,
        })
      } else {
        setActiveResult({
          kind: 'not_sure',
          reason: result.reason,
          previewUrl: displayPreviewUrl,
        })
      }

      setCurrentFeedback(null)
      setAnalyzingPreview(null)
      setView('result')
    } catch (err) {
      if (runId !== runIdRef.current) return
      console.error('Scan pipeline failed:', err)
      if (tempUrlRef.current) {
        URL.revokeObjectURL(tempUrlRef.current)
        tempUrlRef.current = null
      }
      setAnalyzingPreview(null)
      setView(from)
      if (err.message === 'not_image') {
        setBanner({ tone: 'error', message: STRINGS.errors.notImage })
      } else {
        setBanner({ tone: 'error', message: STRINGS.errors.readFail })
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
    setOriginTab(view === 'impact' ? 'impact' : 'history')
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
    if (window.history.state?.view === 'result') {
      window.history.back()
    } else {
      setActiveResult(null)
      setView(originTab)
    }
  }

  const handleScanAnother = () => {
    setActiveResult(null)
    setView('home')
    setTimeout(() => handleOpenCamera(), 80)
  }

  const dismissBanner = () => setBanner(null)

  const isFullScreenView = view === 'analyzing' || view === 'result'

  return (
    <div className="relative min-h-[100dvh] flex bg-[var(--color-bg)] text-[var(--color-text)] font-sans antialiased overflow-x-hidden">
      <Backdrop />

      {/* Hidden native file inputs */}
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

      {/* Desktop Sidebar (1024px and up) */}
      {!isFullScreenView && (
        <Sidebar
          active={view}
          onHome={() => setView('home')}
          onHistory={() => setView('history')}
          onImpact={() => setView('impact')}
          onOpenScanSheet={() => setIsScanSheetOpen(true)}
          scanDisabled={!ready}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Full-screen Analyzing overlay */}
        {view === 'analyzing' && (
          <AnalyzingView
            previewUrl={analyzingPreview}
            onClose={handleCancelAnalysis}
          />
        )}

        {/* Main responsive container (centered 480px on mobile, responsive bento) */}
        <main className="w-full max-w-[480px] lg:max-w-[720px] mx-auto flex-1 flex flex-col px-4 pt-4 pb-36 gap-4">
          {banner && (
            <Banner
              tone={banner.tone}
              message={banner.message}
              onRetry={banner.onRetry}
              onDismiss={dismissBanner}
            />
          )}

          {/* Home View */}
          {view === 'home' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              {/* Brand Header */}
              <header className="pt-2 pb-1 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[var(--color-text)] tracking-tight flex items-center gap-2">
                    <span>{STRINGS.app.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-primary-soft)] text-[var(--color-primary-strong)]">
                      SDG 15
                    </span>
                  </h1>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {STRINGS.app.tagline}
                  </p>
                </div>
              </header>

              {/* Hero Scan Tile */}
              <Scanner
                ready={ready}
                loadingText={
                  modelStatus === 'error'
                    ? STRINGS.errors.modelLoadFail
                    : STRINGS.home.loadingModel
                }
                onGalleryClick={handleOpenGallery}
                onCameraClick={handleOpenCamera}
              />

              {/* Stat Strip (Side-by-side tiles) */}
              <ImpactBar totalSorted={totalSorted} streak={streak} />

              {/* What Goes Where Legend Tile */}
              <section className="card p-4 border border-[var(--color-border)] shadow-sm">
                <span className="text-xs font-bold text-[var(--color-text)]">
                  {STRINGS.home.whatGoesWhere}
                </span>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {STATIC_CATEGORIES.map((catKey) => {
                    const theme = CATEGORY_THEME[catKey]
                    return (
                      <div
                        key={catKey}
                        className="chip"
                        style={{
                          '--chip-ink': theme.ink,
                          '--chip-soft': theme.soft,
                        }}
                      >
                        <CategoryIcon categoryId={catKey} size={14} />
                        <span>{theme.label}</span>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Recent Scans Tile (2-3 newest entries; hidden if empty) */}
              {history.length > 0 && (
                <section className="card p-4 border border-[var(--color-border)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[var(--color-text)]">
                      {STRINGS.home.recentScans}
                    </span>
                    <button
                      type="button"
                      onClick={() => setView('history')}
                      className="text-xs font-bold text-[var(--color-primary-strong)] flex items-center gap-1 hover:underline"
                    >
                      <span>{STRINGS.home.seeAll}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <History
                    items={history.slice(0, 3)}
                    onOpenItem={handleOpenHistoryItem}
                  />
                </section>
              )}
            </div>
          )}

          {/* Impact Counter View */}
          {view === 'impact' && (
            <ImpactCounter
              totalSorted={totalSorted}
              streak={streak}
              byCategory={byCategory}
              history={history}
              onOpenScanSheet={() => setIsScanSheetOpen(true)}
              onGoToHistory={() => setView('history')}
            />
          )}

          {/* History View */}
          {view === 'history' && (
            <div className="flex-1 flex flex-col animate-in fade-in duration-200">
              <TopBar title={STRINGS.history.title} />
              <History items={history} onOpenItem={handleOpenHistoryItem} />
            </div>
          )}

          {/* Result View */}
          {view === 'result' && activeResult && (
            <ResultCard
              result={activeResult}
              rules={rules}
              feedback={currentFeedback}
              onFeedback={handleFeedback}
              onScanAnother={handleScanAnother}
              onBack={handleBackFromResult}
            />
          )}
        </main>

        {/* Floating Bottom Nav (Mobile/Tablet) — hidden on full-screen analyzing and result views */}
        {!isFullScreenView && (
          <BottomNav
            active={view === 'impact' ? 'impact' : view === 'history' ? 'history' : 'home'}
            onHome={() => setView('home')}
            onHistory={() => setView('history')}
            onImpact={() => setView('impact')}
            onOpenScanSheet={() => setIsScanSheetOpen(true)}
            scanDisabled={!ready}
          />
        )}
      </div>

      {/* ScanSheet Modal */}
      <ScanSheet
        isOpen={isScanSheetOpen}
        onClose={() => setIsScanSheetOpen(false)}
        onTakePhoto={handleOpenCamera}
        onChooseGallery={handleOpenGallery}
      />
    </div>
  )
}
