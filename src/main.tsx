import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'

import WebApp from '@twa-dev/sdk'

// Helper for logger since import might be async/later, we use window directly if available or console
const log = (msg: string) => {
  if (typeof window !== 'undefined' && window.logEvent) window.logEvent(msg)
  else console.log('[Main] ' + msg)
}

log('Main: Script executing')

// Initialize Telegram WebApp
try {
  WebApp.ready();
  log('WebApp.ready() called')
  WebApp.expand();
  const ver = Number((WebApp as unknown as { version?: string }).version || '0')
  if (WebApp.platform === 'ios' || WebApp.platform === 'android') {
    if (ver >= 8) { try { (WebApp as unknown as { requestFullscreen?: () => void }).requestFullscreen?.() } catch { void 0 } }
  }
  WebApp.setHeaderColor("bg_color");
} catch (e) {
  console.error('Telegram WebApp initialization failed', e);
  log('WebApp init failed: ' + e)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
