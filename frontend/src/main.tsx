import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'

const root = createRoot(document.getElementById('root')!)

try {
  ;(window as any).Telegram?.WebApp?.ready()
  ;(window as any).Telegram?.WebApp?.expand()
} catch {}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
