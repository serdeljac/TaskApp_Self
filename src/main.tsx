//Use for Error Handling, Wrap Arround the App
import { StrictMode } from 'react'

//Use to create a root to display the React components in the DOM
import { createRoot } from 'react-dom/client'

//Apply this CSS file to ALL Components
import './index.css'

//The Main Components (Often called 'App')
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
