import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import TelstraEsperance from './TelstraEsperance.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Invisible base link for security */}
        <Route path="/" element={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-900 font-sans text-xs">Campaign Active</div>} />
        
        {/* The dedicated link for this specific store */}
        <Route path="/Telstra Esperance" element={<TelstraEsperance />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)