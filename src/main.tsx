import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './brand/tokens.css' // brand tokens first — single source of colour
// Self-hosted fonts (no Google CDN — the user's IP never leaves for a font).
// Inter carries the wordmark; Hanken Grotesk is the UI face, Fraunces the display.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/600.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
