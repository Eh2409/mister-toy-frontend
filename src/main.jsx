import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/style/main.css'
import RootCmp from './RootCmp.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <RootCmp />
  // </StrictMode>,
)
