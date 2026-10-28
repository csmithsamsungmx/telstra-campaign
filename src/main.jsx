import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Make sure this filename matches exactly what you named it in Step 1
import TelstraEsperance from './TelstraEsperance.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-900 font-sans text-xs">Campaign Active</div>} />
        
        {/* The dedicated link for Telstra Esperance */}
        <Route path="/esperance" element={<TelstraEsperance />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)