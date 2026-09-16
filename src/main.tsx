import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter keeps deep links working on any static host (Vercel/Netlify). */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
