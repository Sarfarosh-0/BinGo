import React, { useState, useRef } from 'react'
import { Backdrop } from './components/Backdrop'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import { ImpactBar } from './components/ImpactBar'
import { Scanner } from './components/Scanner'
import { History } from './components/History'
import { useStreak } from './hooks/useStreak'
import { useHistory } from './hooks/useHistory'
import { STRINGS } from './lib/strings'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'analyzing' | 'result' | 'history'
  const [isModelReady] = useState(true)

  const { totalSorted, streak } = useStreak()
  const { history } = useHistory()

  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)

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

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    console.log('Selected file for classification:', file.name, file.size)
    // Classification flow hooked up in Gate 3
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

      {/* Main Max-Width Mobile Frame (Clamped to 480px) */}
      <main className="w-full max-w-[480px] mx-auto flex-1 flex flex-col px-4 pt-4 pb-28 gap-4">
        {view === 'home' && (
          <>
            {/* Header Block */}
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

            {/* Impact Metric Bar with live streak and total */}
            <ImpactBar totalSorted={totalSorted} streak={streak} />

            {/* Scan Station Card */}
            <Scanner
              ready={isModelReady}
              onGalleryClick={handleOpenGallery}
              onCameraClick={handleOpenCamera}
            />
          </>
        )}

        {view === 'history' && (
          <div className="flex-1 flex flex-col">
            <TopBar title={STRINGS.history.title} />
            <History 
              items={history}
              onOpenItem={(item) => console.log('Open history item:', item.id)}
            />
          </div>
        )}
      </main>

      {/* Floating Glass Bottom Navigation */}
      <BottomNav
        active={view === 'history' ? 'history' : 'home'}
        onHome={() => setView('home')}
        onHistory={() => setView('history')}
        onScan={handleOpenCamera}
        scanDisabled={!isModelReady}
      />
    </div>
  )
}
