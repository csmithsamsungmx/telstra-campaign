import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';

export default function IncentiveDashboard() {
  const [consultants, setConsultants] = useState([
    { id: 1, name: 'Alex', w9: 0, u2: 0, w8c: 0 },
    { id: 2, name: 'Jordan', w9: 0, u2: 0, w8c: 0 },
    { id: 3, name: 'Taylor', w9: 0, u2: 0, w8c: 0 },
    { id: 4, name: 'Sam', w9: 0, u2: 0, w8c: 0 },
    { id: 5, name: 'Casey', w9: 0, u2: 0, w8c: 0 },
  ]);

  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Paste your FULL Google Sheets CSV link right here:
  const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmROehzdA36zOT4bodXQIXmOq2Uiewr5qGeM7l9xYXWSbVxzoU12jVCVCiEETZrPuFfA0MXQbJB4tm/pub?gid=0&single=true&output=csv";

  // Fetch data using robust PapaParse
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
    // Initial fetch when the board loads
    fetchSheetData(GOOGLE_SHEET_CSV_URL);

    // Auto-refresh every 60 seconds for store displays
    const intervalId = setInterval(() => {
      fetchSheetData(GOOGLE_SHEET_CSV_URL);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const totalStoreSales = useMemo(() => {
    return consultants.reduce((acc, curr) => acc + curr.w9 + curr.u2 + curr.w8c, 0);
  }, [consultants]);

  const targetUnits = 4;
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
      {/* SECTION 1: DIGITAL POSTER (HERO) */}
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
          
          <div className="max-w-xl mx-auto mt-4