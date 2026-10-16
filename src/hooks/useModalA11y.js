import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Modal accessibility helper.
 *
 * On open: move focus into the dialog, keep Tab cycling within it, close on
 * Escape, and (on close) restore focus to whatever opened the dialog.
 * Addresses WCAG 2.4.3 (Focus Order) and 2.1.2 (No Keyboard Trap).
 *
 * `onClose` is read through a ref so an unstable callback identity does not
 * re-run the effect (and yank focus) on every parent render.
 */
export function useModalA11y({ isOpen, onClose, containerRef }) {
  const previouslyFocused = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    previouslyFocused.current = document.activeElement
    const container = containerRef.current

    const getFocusable = () =>
      container
        ? Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
            (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
          )
        : []

    // Move focus into the dialog so keyboard/screen-reader users start inside it.
    const focusables = getFocusable()
    if (focusables.length > 0) {
      focusables[0].focus()
    } else if (container) {
      container.setAttribute('tabindex', '-1')
      container.focus()
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && onCloseRef.current) {
        event.stopPropagation()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab' || !container) return

      const items = getFocusable()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const outside = !container.contains(active)

      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const restoreTo = previouslyFocused.current
      if (restoreTo && typeof restoreTo.focus === 'function' && document.contains(restoreTo)) {
        restoreTo.focus()
      }
    }
  }, [isOpen, containerRef])
}
