import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Backdrop } from './components/Backdrop'
import { Header } from './components/Header'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import { Sidebar } from './components/Sidebar'
import { ImpactBar } from './components/ImpactBar'
import { Scanner } from './components/Scanner'
import { History } from './components/History'
import { ImpactCounter } from './components/ImpactCounter'
import { ScanSheet } from './components/ScanSheet'
import { CameraModal } from './components/CameraModal'
import { CategoryGuideModal } from './components/CategoryGuideModal'
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
import { createSampleWasteFile } from './lib/sampleImages'
import { STRINGS } from './lib/strings'
import { CATEGORY_THEME } from './lib/categoryTheme'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'

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
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [selectedGuideCategory, setSelectedGuideCategory] = useState('recyclable')

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
    // Use in-app camera if getUserMedia is available to prevent OS background killing
    if (navigator.mediaDevices?.getUserMedia) {
      setIsCameraModalOpen(true)
    } else if (cameraInputRef.current) {
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

  // Unified file processor for inputs, drag & drop, and sample waste items
  const processFile = useCallback(async (file) => {
    if (!file) return
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
        result = await classify(model, metadata, modelCanvas)
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
  }, [view, ready, model, metadata, rules, addEntry, recordConfidentScan])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) processFile(file)
  }

  const handleSelectSample = async (type) => {
    try {
      const file = await createSampleWasteFile(type)
      if (file) {
        processFile(file)
      }
    } catch (e) {
      console.error('Failed to create sample item file:', e)
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

  const isFullScreenView = view === 'analyzing'

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
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[var(--sidebar-w)]">
        {/* Full-screen Analyzing overlay */}
        {view === 'analyzing' && (
          <AnalyzingView
            previewUrl={analyzingPreview}
            onClose={handleCancelAnalysis}
          />
        )}

        {/* Responsive container: 480px on phone, 1020px on desktop bento grid */}
        <main className="w-full max-w-[480px] lg:max-w-[1020px] xl:max-w-[1120px] mx-auto flex-1 flex flex-col px-4 pt-4 sm:pt-6 pb-24 lg:pb-10 gap-4 sm:gap-6">
          {banner && (
            <Banner
              tone={banner.tone}
              message={banner.message}
              onRetry={banner.onRetry}
              onDismiss={dismissBanner}
            />
          )}

          {/* ================= HOME VIEW REDESIGN ================= */}
          {view === 'home' && (
            <div className="flex flex-col gap-4 sm:gap-6 view-enter">
              {/* Brand Header Banner */}
              <Header onOpenGuide={() => {
                setSelectedGuideCategory('recyclable')
                setIsGuideOpen(true)
              }} />

              {/* Responsive Bento Grid: 2 columns on desktop/tablet (7 cols left, 5 cols right), 1 column on phone */}
              <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
                {/* Left Column: Smart Scan Station (7 cols on desktop) */}
                <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
                  <Scanner
                    ready={ready}
                    loadingText={
                      modelStatus === 'error'
                        ? STRINGS.errors.modelLoadFail
                        : STRINGS.home.loadingModel
                    }
                    onGalleryClick={handleOpenGallery}
                    onCameraClick={handleOpenCamera}
                    onDropFile={processFile}
                    onSelectSample={handleSelectSample}
                  />
                </div>

                {/* Right Column: Impact Stats, Interactive Guide & Activity (5 cols on desktop) */}
                <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 mt-4 lg:mt-0">
                  {/* Stat & Streak Bento Tile */}
                  <ImpactBar
                    totalSorted={totalSorted}
                    streak={streak}
                    onViewAnalytics={() => setView('impact')}
                  />

                  {/* Interactive "What Goes Where" Legend Tile */}
                  <section className="card p-4 sm:p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)]">
                        {STRINGS.home.whatGoesWhere}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGuideCategory('recyclable')
                          setIsGuideOpen(true)
                        }}
                        className="text-xs font-bold text-[var(--color-primary-strong)] flex items-center gap-1.5 hover:underline"
                      >
                        <span>{STRINGS.home.fullGuide}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[var(--color-text-muted)] mb-3 leading-relaxed">
                      {STRINGS.home.whatGoesWhereHint}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {STATIC_CATEGORIES.map((catKey) => {
                        const theme = CATEGORY_THEME[catKey]
                        return (
                          <button
                            key={catKey}
                            type="button"
                            onClick={() => {
                              setSelectedGuideCategory(catKey)
                              setIsGuideOpen(true)
                            }}
                            className="chip py-1.5 px-3 transition-all hover:scale-105 active:scale-95 cursor-pointer border shadow-xs"
                            style={{
                              '--chip-ink': theme.ink,
                              '--chip-soft': theme.soft,
                            }}
                            title={STRINGS.home.guideChipTitle.replace('{label}', theme.label)}
                          >
                            <CategoryIcon categoryId={catKey} size={16} />
                            <span className="font-bold text-xs">{theme.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </section>

                  {/* Recent Scans Tile OR 3-Step "How BinGo Works" Guide */}
                  {history.length > 0 ? (
                    <section className="card p-4 sm:p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)]">
                          {STRINGS.home.recentScans}
                        </span>
                        <button
                          type="button"
                          onClick={() => setView('history')}
                          className="text-xs font-bold text-[var(--color-primary-strong)] flex items-center gap-1.5 hover:underline"
                        >
                          <span>{STRINGS.home.seeAll}</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                      <History
                        items={history.slice(0, 3)}
                        onOpenItem={handleOpenHistoryItem}
                        onScan={() => setIsScanSheetOpen(true)}
                      />
                    </section>
                  ) : (
                    <section className="card p-4 sm:p-5 border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-secondary)]">
                          {STRINGS.home.howItWorks}
                        </span>
                        <span className="text-[11px] font-semibold text-[var(--color-primary-strong)]">
                          {STRINGS.home.howItWorksBadge}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-[var(--color-text)]">{STRINGS.home.stepOneTitle}</h4>
                            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                              {STRINGS.home.stepOneDesc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-[var(--color-text)]">{STRINGS.home.stepTwoTitle}</h4>
                            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                              {STRINGS.home.stepTwoDesc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            3
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-[var(--color-text)]">{STRINGS.home.stepThreeTitle}</h4>
                            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                              {STRINGS.home.stepThreeDesc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= IMPACT VIEW ================= */}
          {view === 'impact' && (
            <ImpactCounter
              totalSorted={totalSorted}
              streak={streak}
              byCategory={byCategory}
              history={history}
              onOpenScanSheet={() => setIsScanSheetOpen(true)}
              onGoToHistory={() => setView('history')}
              onBackToHome={() => setView('home')}
            />
          )}

          {/* ================= HISTORY VIEW ================= */}
          {view === 'history' && (
            <div className="flex-1 flex flex-col view-enter">
              <TopBar title={STRINGS.history.title} onBack={() => setView('home')} />
              <History
                items={history}
                onOpenItem={handleOpenHistoryItem}
                onScan={() => setIsScanSheetOpen(true)}
              />
            </div>
          )}

          {/* ================= RESULT VIEW ================= */}
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
        {!isFullScreenView && view !== 'result' && (
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

      {/* Category Guide Modal */}
      <CategoryGuideModal
        isOpen={isGuideOpen}
        initialCategory={selectedGuideCategory}
        onClose={() => setIsGuideOpen(false)}
        rules={rules}
      />

      {/* Live In-App Camera Modal (foreground camera to avoid mobile tab kills) */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(file) => {
          setIsCameraModalOpen(false)
          processFile(file)
        }}
        onFallbackFilePicker={handleOpenGallery}
      />
    </div>
  )
}
