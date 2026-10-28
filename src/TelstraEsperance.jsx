import React, { useState, useMemo, useEffect } from 'react';

// This is a React JSX component for the Telstra Esperance Dashboard
export default function IncentiveDashboard() {
  // State for the consultants and data source
  const [consultants, setConsultants] = useState([
    { id: 1, name: 'Alex', w9: 0, u2: 0, w8c: 0 },
    { id: 2, name: 'Jordan', w9: 0, u2: 0, w8c: 0 },
    { id: 3, name: 'Taylor', w9: 0, u2: 0, w8c: 0 },
    { id: 4, name: 'Sam', w9: 0, u2: 0, w8c: 0 },
    { id: 5, name: 'Casey', w9: 0, u2: 0, w8c: 0 },
  ]);

  const [sheetUrl, setSheetUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch data from published Google Sheet CSV
  const fetchSheetData = async (url) => {
    if (!url) return;
    setIsFetching(true);
    setErrorMsg('');
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const csvText = await response.text();
      
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) throw new Error('Spreadsheet needs a header row and at least one data row.');
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const parsedData = lines.slice(1).map((line, index) => {
        // Handle basic CSV parsing
        const values = line.split(',').map(v => v.trim());
        const row = { id: index + 1, name: `Consultant ${index+1}`, w9: 0, u2: 0, w8c: 0 };
        
        headers.forEach((h, i) => {
          if (h.includes('name')) row.name = values[i];
          if (h.includes('9')) row.w9 = parseInt(values[i], 10) || 0;
          if (h.includes('ultra') || h.includes('2')) row.u2 = parseInt(values[i], 10) || 0;
          if (h.includes('8')) row.w8c = parseInt(values[i], 10) || 0;
        });
        return row;
      });
      
      setConsultants(parsedData);
    } catch (err) {
      setErrorMsg('Failed to load data. Make sure it is a valid Google Sheets published CSV URL.');
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // Attempt to load saved URL from local storage on mount
    const savedUrl = localStorage.getItem('esperanceSheetUrl');
    if (savedUrl) {
      setSheetUrl(savedUrl);
      fetchSheetData(savedUrl);
    }
  }, []);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('esperanceSheetUrl', sheetUrl);
    fetchSheetData(sheetUrl);
  };

  // Derived calculations
  const totalStoreSales = useMemo(() => {
    return consultants.reduce((acc, curr) => acc + curr.w9 + curr.u2 + curr.w8c, 0);
  }, [consultants]);

  const targetUnits = 4;
  const isUnlocked = totalStoreSales >= targetUnits;
  const progressPercentage = Math.min((totalStoreSales / targetUnits) * 100, 100);

  // Sort consultants by total sales
  const sortedConsultants = useMemo(() => {
    return [...consultants].sort((a, b) => {
      const totalA = a.w9 + a.u2 + a.w8c;
      const totalB = b.w9 + b.u2 + b.w8c;
      return totalB - totalA;
    });
  }, [consultants]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* 
        ===================================================================
        SECTION 1: DIGITAL POSTER (HERO)
        ===================================================================
      */}
      <div className="bg-gradient-to-br from-[#0066FF] to-[#1428A0] text-white shadow-xl">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center items-center space-x-4 mb-6 text-sm md:text-base font-semibold tracking-widest text-blue-200">
            <span>TELSTRA ESPERANCE</span>
            <span>✕</span>
            <span>SAMSUNG</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-md uppercase italic">
            Watch Out, Esperance!
          </h1>
          
          <p className="text-xl md:text-2xl font-light text-blue-100 mb-8 max-w-2xl mx-auto">
            The November Galaxy Watch Challenge
          </p>

          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold mb-2 text-yellow-400">THE GOAL: LUNCH ON SAMSUNG</h2>
            <p className="text-lg text-blue-50 font-medium">
              4 units across the store unlocks the prize. <br className="hidden md:block" />
              The top-selling consultant takes it all.
            </p>
            <p className="text-sm text-blue-200 mt-4 italic">
              "More confidence. More conversations. More Galaxy Watches."
            </p>
          </div>
          
          {/* Store Progress Bar */}
          <div className="max-w-xl mx-auto mt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-lg">Store Minimum Target</span>
              <span className="font-bold text-2xl">{totalStoreSales} / {targetUnits} Units</span>
            </div>
            <div className="h-6 w-full bg-blue-950/50 rounded-full overflow-hidden border border-white/20 relative">
              <div 
                className={`h-full transition-all duration-700 ease-out flex items-center justify-end px-2
                  ${isUnlocked ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`}
                style={{ width: `${progressPercentage}%` }}
              >
              </div>
            </div>
            {isUnlocked && (
              <div className="mt-3 text-emerald-400 font-bold text-xl animate-pulse flex items-center justify-center space-x-2">
                <span>🎉 PRIZE UNLOCKED! BATTLE FOR 1ST PLACE BEGINS 🎉</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 
        ===================================================================
        SECTION 2: INTERACTIVE LEADERBOARD
        ===================================================================
      */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        
        {/* Device Legend / Quick Rules */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
           <div className="font-semibold text-slate-700">Eligible Devices:</div>
           <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-blue-50 text-[#1428A0] rounded-lg text-sm font-bold border border-blue-100">Galaxy Watch 9 LTE</span>
              <span className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold border border-slate-700">Watch Ultra 2</span>
              <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-300">Watch 8 Classic LTE</span>
           </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="space-y-4">
          {sortedConsultants.map((consultant, index) => {
            const total = consultant.w9 + consultant.u2 + consultant.w8c;
            const isFirst = index === 0 && total > 0;
            const isSecond = index === 1 && total > 0;
            const isThird = index === 2 && total > 0;
            
            return (
              <div 
                key={consultant.id} 
                className={`bg-white rounded-xl shadow-sm border transition-all duration-300 flex flex-col md:flex-row overflow-hidden
                  ${isFirst ? 'border-yellow-400 ring-2 ring-yellow-400/20 shadow-yellow-100' : 'border-slate-200 hover:border-blue-300'}`}
              >
                {/* Rank & Name Profile */}
                <div className={`p-6 md:w-1/3 flex items-center space-x-4 
                  ${isFirst ? 'bg-yellow-50/50' : isSecond ? 'bg-slate-50/50' : isThird ? 'bg-orange-50/50' : 'bg-transparent'}`}>
                  
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl flex-shrink-0
                    ${isFirst ? 'bg-yellow-400 text-yellow-900 shadow-md' : 
                      isSecond ? 'bg-slate-300 text-slate-700 shadow-sm' : 
                      isThird ? 'bg-orange-300 text-orange-900 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-800">{consultant.name}</h3>
                    <div className="text-sm font-medium text-slate-500">Total Units: <span className="text-slate-900 text-lg">{total}</span></div>
                  </div>
                </div>

                {/* Device Counters - Read Only */}
                <div className="p-6 md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-100 bg-white">
                  
                  {/* Watch 9 LTE */}
                  <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                    <span className="text-sm font-semibold text-[#1428A0]">Watch 9 LTE</span>
                    <div className="flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 w-12 py-1">
                      <span className="font-bold text-slate-700">{consultant.w9}</span>
                    </div>
                  </div>

                  {/* Watch Ultra 2 */}
                  <div className="flex items-center justify-between bg-slate-100/50 p-3 rounded-lg border border-slate-200/50">
                    <span className="text-sm font-semibold text-slate-800">Ultra 2</span>
                    <div className="flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 w-12 py-1">
                      <span className="font-bold text-slate-700">{consultant.u2}</span>
                    </div>
                  </div>

                  {/* Watch 8 Classic LTE */}
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                    <span className="text-sm font-semibold text-slate-600">Watch 8 Cl.</span>
                    <div className="flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 w-12 py-1">
                      <span className="font-bold text-slate-700">{consultant.w8c}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Data Source Configuration */}
        <div className="mt-12 bg-slate-800 text-white p-6 rounded-xl shadow-md border border-slate-700">
          <h3 className="text-lg font-bold mb-2 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Live Data Sync</span>
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            Link a Google Sheet to automatically update this leaderboard. In Google Sheets, go to <strong>File &gt; Share &gt; Publish to web</strong>. Choose <strong>Comma-separated values (.csv)</strong> and paste the link below. Ensure your headers include words like: <em>Name, 9, Ultra, 8</em>.
          </p>
          
          <form onSubmit={handleUrlSubmit} className="flex flex-col md:flex-row gap-3">
            <input 
              type="url" 
              placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv" 
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="flex-grow px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] text-white"
            />
            <button 
              type="submit"
              disabled={isFetching}
              className="w-full md:w-auto px-6 py-2 bg-[#0066FF] hover:bg-blue-600 disabled:bg-slate-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isFetching ? <span>Syncing...</span> : <span>Sync Data</span>}
            </button>
          </form>
          {errorMsg && <p className="text-red-400 text-sm mt-3">{errorMsg}</p>}
        </div>

      </div>
    </div>
  );
}