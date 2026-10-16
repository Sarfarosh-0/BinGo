import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/manrope'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
