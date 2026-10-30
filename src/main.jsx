import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Retira la pantalla de carga de index.html cuando la página ya cargó
// (mínimo ~1,6 s para que se vea la animación, máximo 4 s)
const splash = document.getElementById('splash')
if (splash && !document.documentElement.classList.contains('splash-seen')) {
  const started = performance.now()
  let done = false
  const hide = () => {
    if (done) return
    done = true
    const wait = Math.max(0, 1600 - (performance.now() - started))
    setTimeout(() => {
      splash.classList.add('splash-hide')
      setTimeout(() => splash.remove(), 700)
      try { sessionStorage.setItem('labrego-splash', '1') } catch { /* sin almacenamiento */ }
    }, wait)
  }
  if (document.readyState === 'complete') hide()
  else window.addEventListener('load', hide, { once: true })
  setTimeout(hide, 4000)
}
