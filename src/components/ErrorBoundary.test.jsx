import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import { STRINGS } from '../lib/strings'

function Boom() {
  throw new Error('boom')
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('all good')).toBeInTheDocument()
  })

  it('renders the recovery card when a child throws', () => {
    // React logs the caught error; silence it so the test output stays readable.
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByText(STRINGS.errors.crashTitle)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: new RegExp(STRINGS.errors.crashReload) }),
    ).toBeInTheDocument()
  })
})
