import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'
import { initTelegram } from './lib/telegram'

// Initialize Telegram WebApp FIRST
initTelegram()

const root = createRoot(document.getElementById('root')!)

// Try to expand Telegram WebApp
try {
  if ((window as any).Telegram?.WebApp) {
    (window as any).Telegram.WebApp.ready()
    (window as any).Telegram.WebApp.expand()
    console.log('Telegram WebApp ready and expanded')
  }
} catch (e) {
  console.log('Telegram WebApp setup:', e)
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
