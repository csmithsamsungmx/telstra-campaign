import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import TelstraEsperance from './TelstraEsperance.jsx'
import TelstraBelmont from './TelstraBelmont.jsx' // 1. Import Belmont

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-900 font-sans text-xs">Campaign Active</div>} />
        
        <Route path="/esperance" element={<TelstraEsperance />} />
        
        {/* 2. Add the dedicated link for Belmont */}
        <Route path="/belmont" element={<TelstraBelmont />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)