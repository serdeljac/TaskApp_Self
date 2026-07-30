/*
 * STEP 01 — the entry point. Vite loads index.html, index.html loads this file.
 *
 * `createRoot(...)` hands React one real DOM node to own — the <div id="root">
 * in index.html. From here down, React builds the DOM; we never touch it directly.
 *
 * The `!` after getElementById is TypeScript, not React: the DOM API says the
 * result may be null, and `!` asserts "trust me, it exists". It is safe here
 * only because that div is hard-coded in index.html.
 *
 * <StrictMode> is a development-only wrapper. It renders components twice to
 * surface unsafe side effects early, so seeing a console log appear twice in
 * dev is expected, not a bug.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
