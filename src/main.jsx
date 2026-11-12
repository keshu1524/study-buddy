import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)

// ☁️ SW हटा दिया था (user की पसंद) — पुराना registration बचा हो तो भी browser खुद
// नया sw.js load करेगा जो खुद को unregister + caches साफ कर देगा (self-cleanup)
