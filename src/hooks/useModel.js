import { useState, useEffect, useCallback, useRef } from 'react'
import { loadModel, warmup } from '../lib/tm'

/**
 * Loads TF.js model + runs blank-tensor warmup.
 * Status: 'loading' | 'ready' | 'error'
 */
export function useModel() {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [model, setModel] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const mountedRef = useRef(true)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const { model: m, metadata: md } = await loadModel()
      if (!mountedRef.current) return
      try {
        warmup(m, md.labels.length)
      } catch (warmErr) {
        console.warn('Model warmup failed (non-fatal):', warmErr)
      }
      if (!mountedRef.current) return
      setModel(m)
      setMetadata(md)
      setStatus('ready')
    } catch (e) {
      console.error('Model load failed:', e)
      if (!mountedRef.current) return
      setError(e)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    load()
    return () => {
      mountedRef.current = false
    }
  }, [load])

  return {
    status,
    ready: status === 'ready',
    error,
    model,
    metadata,
    retry: load,
  }
}
