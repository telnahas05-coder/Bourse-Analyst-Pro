import React, { useState } from 'react';
import { analyzeSymbol } from './services/geminiService';
import { AnalysisStatus, FinancialReport } from './types';
import AnalysisChecklist from './components/AnalysisChecklist';
import FinancialSummary from './components/FinancialSummary';
import MarketAnalysis from './components/MarketAnalysis';

const App: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeSymbol(symbol);
      setReport(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err) {
      setStatus(AnalysisStatus.ERROR);
      setError(err instanceof Error ? err.message : "خطای ناشناخته در تحلیل");
    }
  };

  return (
    <div className="min-h-screen bg-bourse-dark text-gray-100 font-sans pb-10">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 py-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-bourse-accent to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <div>
                 <h1 className="text-xl font-black text-white tracking-wide">تحلیلگر هوشمند بورس</h1>
                 <p className="text-xs text-gray-400">مبتنی بر هوش مصنوعی Gemini 2.5</p>
             </div>
          </div>
          
           {/* Search Bar in Header for quick access */}
          <form onSubmit={handleAnalyze} className="hidden md:flex relative w-96">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="نماد بورسی (مثلا: فولاد، اهرم)..."
              className="w-full bg-slate-800 border border-slate-600 rounded-full py-2 px-4 pr-12 focus:outline-none focus:border-bourse-accent transition-colors text-white placeholder-gray-500"
              disabled={status === AnalysisStatus.ANALYZING}
            />
            <button 
                type="submit"
                disabled={status === AnalysisStatus.ANALYZING}
                className="absolute left-1 top-1 bottom-1 bg-bourse-accent hover:bg-blue-600 text-white px-4 rounded-full text-sm font-medium transition-colors"
            >
                {status === AnalysisStatus.ANALYZING ? '...' : 'تحلیل'}
            </button>
            <svg className="w-5 h-5 text-gray-500 absolute right-4 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        
        {/* Mobile Search - Visible only on small screens */}
        <div className="md:hidden mb-8">
            <form onSubmit={handleAnalyze} className="relative">
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="نماد بورسی را وارد کنید..."
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-white focus:border-bourse-accent outline-none"
                />
                <button 
                    type="submit" 
                    className="w-full mt-3 bg-bourse-accent py-3 rounded-lg font-bold text-white shadow-lg"
                    disabled={status === AnalysisStatus.ANALYZING}
                >
                    {status === AnalysisStatus.ANALYZING ? 'در حال بررسی...' : 'شروع تحلیل'}
                </button>
            </form>
        </div>

        {/* Initial State / Welcome */}
        {status === AnalysisStatus.IDLE && (
            <div className="text-center mt-20 opacity-50">
                <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-300 mb-2">آماده تحلیل نماد شما</h2>
                <p className="max-w-md mx-auto">نام نماد صندوق یا شرکت (مثل: آگاس، شستا) را وارد کنید تا هوش مصنوعی اطلاعات کدال، فیپیران و TSETMC را بررسی کند.</p>
            </div>
        )}

        {/* Loading State */}
        {status === AnalysisStatus.ANALYZING && (
            <div className="flex flex-col items-center justify-center mt-20">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-bourse-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white animate-pulse">در حال جمع‌آوری اطلاعات...</h3>
                <div className="mt-4 space-y-2 text-sm text-gray-400 text-center">
                    <p>بررسی آخرین گزارش‌های کدال...</p>
                    <p>چک کردن امیدنامه و پورتفوی...</p>
                    <p>آنالیز تابلوی معاملات TSETMC...</p>
                </div>
            </div>
        )}

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
            <div className="bg-red-900/20 border border-red-800 text-red-200 p-6 rounded-lg max-w-2xl mx-auto mt-10 text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="text-xl font-bold mb-2">خطا در تحلیل</h3>
                <p>{error}</p>
                <button 
                    onClick={() => setStatus(AnalysisStatus.IDLE)}
                    className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                >
                    بازگشت
                </button>
            </div>
        )}

        {/* Results Dashboard */}
        {status === AnalysisStatus.COMPLETED && report && (
            <div className="animate-fade-in-up">
                
                {/* Dashboard Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-700 pb-4">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">{report.companyName} <span className="text-bourse-accent text-2xl">({report.symbol})</span></h2>
                        <p className="text-gray-400 text-sm">آخرین بروزرسانی داده‌ها: {report.lastUpdate}</p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                        {report.summary.strengths.slice(0, 2).map((s, i) => (
                            <span key={i} className="bg-green-900/30 text-green-400 px-3 py-1 rounded text-xs border border-green-800/50">
                                + {s}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column: Financials & Charts (2/3 width) */}
                    <div className="xl:col-span-2 space-y-6">
                        <FinancialSummary data={report} />
                        <MarketAnalysis data={report} />
                    </div>

                    {/* Right Column: Checklist & Sources (1/3 width) */}
                    <div className="xl:col-span-1 space-y-6">
                         <AnalysisChecklist checklist={report.checklist} />
                         
                         {/* Sources Box */}
                         <div className="bg-bourse-card p-6 rounded-lg border border-slate-700">
                             <h4 className="font-bold text-gray-300 mb-3 text-sm">منابع بررسی شده:</h4>
                             <ul className="text-xs text-blue-400 space-y-2 break-all">
                                {report.sources && report.sources.length > 0 ? (
                                    report.sources.map((source, idx) => (
                                        <li key={idx} className="flex gap-2">
                                            <span>🔗</span>
                                            <a href={source} target="_blank" rel="noreferrer" className="hover:underline hover:text-blue-300">{source}</a>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">منبع مستقیمی یافت نشد (استفاده از دانش مدل)</li>
                                )}
                             </ul>
                         </div>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;