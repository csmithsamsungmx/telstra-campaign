import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';

export default function IncentiveDashboard() {
  const [consultants, setConsultants] = useState([
  ]);

  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Paste your FULL Google Sheets CSV link right here:
  const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR761aa3YGANGwCTj0xxfZXBCpSjW_peKj65rL7qvXaaOEQ6nf1DUPeaxoNT18c-20tyuTFuQ_Zxil6/pub?gid=0&single=true&output=csv";

  const fetchSheetData = (url) => {
    if (!url) return;
    setIsFetching(true);
    setErrorMsg('');

    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setErrorMsg('Sheet found, but it has no data rows beneath the headers.');
          setIsFetching(false);
          return;
        }

        const parsedData = results.data.map((row, index) => {
          let name = `Consultant ${index + 1}`;
          let w9 = 0, u2 = 0, w8c = 0;

          Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('name')) name = row[key];
            if (lowerKey.includes('9')) w9 = parseInt(row[key], 10) || 0;
            if (lowerKey.includes('ultra') || lowerKey.includes('2')) u2 = parseInt(row[key], 10) || 0;
            if (lowerKey.includes('8')) w8c = parseInt(row[key], 10) || 0;
          });

          return { id: index + 1, name, w9, u2, w8c };
        });

        setConsultants(parsedData);
        setIsFetching(false);
      },
      error: (err) => {
        console.error("Parse Error:", err);
        setErrorMsg('Access blocked. Ensure "Require viewers to sign in" is UNCHECKED in Google Sheets Publish settings.');
        setIsFetching(false);
      }
    });
  };

  useEffect(() => {
    fetchSheetData(GOOGLE_SHEET_CSV_URL);

    const intervalId = setInterval(() => {
      fetchSheetData(GOOGLE_SHEET_CSV_URL);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const totalStoreSales = useMemo(() => {
    return consultants.reduce((acc, curr) => acc + curr.w9 + curr.u2 + curr.w8c, 0);
  }, [consultants]);

  const targetUnits = 18;
  const isUnlocked = totalStoreSales >= targetUnits;
  const progressPercentage = Math.min((totalStoreSales / targetUnits) * 100, 100);

  const sortedConsultants = useMemo(() => {
    return [...consultants].sort((a, b) => {
      const totalA = a.w9 + a.u2 + a.w8c;
      const totalB = b.w9 + b.u2 + b.w8c;
      return totalB - totalA;
    });
  }, [consultants]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <div className="bg-gradient-to-br from-[#FF7700] to-[#D95C00] text-white shadow-xl">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center items-center space-x-4 mb-6 text-sm md:text-base font-semibold tracking-widest text-orange-200">
            <span>TELSTRA BELMONT</span>
            <span>✕</span>
            <span>SAMSUNG</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-md uppercase italic">
            Time To Delivery, Belmont!
          </h1>
          
          <p className="text-xl md:text-2xl font-light text-orange-100 mb-8 max-w-2xl mx-auto">
            The November Galaxy Watch Challenge
          </p>

          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold mb-2 text-yellow-400">THE GOAL: TEAM LUNCH ON SAMSUNG</h2>
            <p className="text-lg text-orange-50 font-medium">
              18 Units across the store unlocks the team lunch. Let's work together to hit the target! <br className="hidden md:block" />
            </p>
            <p className="text-sm text-orange-200 mt-4 italic">
              "More confidence. More conversations. More Galaxy Watches."
            </p>
          </div>
          
          <div className="max-w-xl mx-auto mt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-lg">Store Minimum Target</span>
              <span className="font-bold text-2xl">{totalStoreSales} / {targetUnits} Units</span>
            </div>
            <div className="h-6 w-full bg-orange-950/50 rounded-full overflow-hidden border border-white/20 relative">
              <div 
                className={`h-full transition-all duration-700 ease-out flex items-center justify-end px-2
                  ${isUnlocked ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-orange-400 to-yellow-400'}`}
                style={{ width: `${progressPercentage}%` }}
              >
              </div>
            </div>
            {isUnlocked && (
              <div className="mt-3 text-emerald-400 font-bold text-xl animate-pulse flex items-center justify-center space-x-2">
                <span>🎉 PRIZE UNLOCKED! BATTLE FOR WATCH CHAMPION BEGINS 🎉</span>
              </div>
            )}
            {errorMsg && <p className="text-red-300 font-bold mt-4">{errorMsg}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-slate-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
           <div className="font-semibold text-slate-700">Eligible Devices:</div>
           <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-orange-50 text-[#D95C00] rounded-lg text-sm font-bold border border-orange-200">Galaxy Watch 9 LTE</span>
              <span className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold border border-slate-700">Watch Ultra 2</span>
              <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-300">Watch 8 Classic LTE</span>
           </div>
        </div>

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
                  ${isFirst ? 'border-yellow-400 ring-2 ring-yellow-400/20 shadow-yellow-100' : 'border-slate-200 hover:border-orange-400'}`}
              >
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

                <div className="p-6 md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-100 bg-white">
                  <div className="flex items-center justify-between bg-orange-50/50 p-3 rounded-lg border border-orange-100/50">
                    <span className="text-sm font-semibold text-[#D95C00]">Watch 9 LTE</span>
                    <div className="flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 w-12 py-1">
                      <span className="font-bold text-slate-700">{consultant.w9}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-100/50 p-3 rounded-lg border border-slate-200/50">
                    <span className="text-sm font-semibold text-slate-800">Ultra 2</span>
                    <div className="flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 w-12 py-1">
                      <span className="font-bold text-slate-700">{consultant.u2}</span>
                    </div>
                  </div>

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
      </div>
    </div>
  );
}