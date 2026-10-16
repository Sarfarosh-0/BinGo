import React from 'react'
import { AlertCircle, RotateCw } from 'lucide-react'
import { STRINGS } from '../lib/strings'

/**
 * Top-level error boundary.
 *
 * Without one, any error thrown while React renders unmounts the entire tree
 * and leaves the user looking at a blank page with no way to recover. This
 * catches that class of failure, keeps the details in the console for
 * debugging, and offers a one-tap reload. Scan history and streak live in
 * localStorage, so a reload does not lose the user's data.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info?.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="card w-full max-w-mobile p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-error-soft)]">
            <AlertCircle
              className="h-8 w-8 text-[var(--color-error)]"
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-4 text-lg font-extrabold text-[var(--color-text)]">
            {STRINGS.errors.crashTitle}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {STRINGS.errors.crashBody}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="btn btn-primary mt-5 w-full"
          >
            <RotateCw className="h-4 w-4 shrink-0" aria-hidden="true" />
            {STRINGS.errors.crashReload}
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
