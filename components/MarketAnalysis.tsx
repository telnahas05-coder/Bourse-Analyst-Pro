import React from 'react';
import { FinancialReport } from '../types';

interface Props {
  data: FinancialReport;
}

const MarketAnalysis: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* TSETMC & Flows */}
      <div className="bg-bourse-card p-6 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
         <h3 className="text-lg font-bold text-bourse-accent mb-4 flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
           تابلوخوانی و جریان پول (TSETMC)
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-800 p-3 rounded text-center border border-slate-700">
                <div className="text-xs text-gray-400">آخرین قیمت</div>
                <div className="text-xl font-bold text-white mt-1">{data.marketBoard.lastPrice}</div>
                <div className={`text-xs mt-1 ${data.marketBoard.priceChange.includes('-') ? 'text-bourse-red' : 'text-bourse-green'}`} dir="ltr">
                    {data.marketBoard.priceChange}
                </div>
            </div>
             <div className="bg-slate-800 p-3 rounded text-center border border-slate-700">
                <div className="text-xs text-gray-400">حجم معاملات</div>
                <div className="text-lg font-bold text-white mt-1">{data.marketBoard.volume}</div>
                <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${data.marketBoard.volumeStatus === 'High' ? 'bg-bourse-green/20 text-bourse-green' : 'bg-slate-700 text-gray-400'}`}>
                    {data.marketBoard.volumeStatus === 'High' ? 'حجم مشکوک' : 'عادی'}
                </div>
            </div>
        </div>
        
        <div className="space-y-3 mt-6">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">ورود پول حقیقی:</span>
                <div className="flex-1 mx-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-bourse-green" style={{ width: data.marketBoard.institutionalBuy.replace('%', '') + '%' }}></div>
                </div>
                <span className="text-white w-14 text-left font-mono text-xs">{data.marketBoard.institutionalBuy}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">خروج پول حقوقی:</span>
                <div className="flex-1 mx-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-bourse-red" style={{ width: data.marketBoard.institutionalSell.replace('%', '') + '%' }}></div>
                </div>
                <span className="text-white w-14 text-left font-mono text-xs">{data.marketBoard.institutionalSell}</span>
             </div>
             <div className="mt-4 p-3 bg-slate-800/50 rounded border-r-2 border-bourse-accent">
                <p className="text-xs text-gray-300 leading-relaxed">
                    {data.marketBoard.flowAnalysis}
                </p>
             </div>
        </div>
      </div>

      {/* Technicals */}
      <div className="bg-bourse-card p-6 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
            <h3 className="text-lg font-bold text-bourse-accent mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                تحلیل تکنیکال و سطوح حجمی
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-green-900/10 border border-green-800/40 p-3 rounded text-center">
                    <span className="text-green-500 text-xs block mb-1 font-bold">حمایت معتبر</span>
                    <span className="text-white font-mono text-md">{data.technical.support}</span>
                 </div>
                 <div className="bg-red-900/10 border border-red-800/40 p-3 rounded text-center">
                    <span className="text-red-500 text-xs block mb-1 font-bold">مقاومت سنگین</span>
                    <span className="text-white font-mono text-md">{data.technical.resistance}</span>
                 </div>
            </div>

            <div className="mb-4 flex items-center justify-between bg-slate-800 p-2 rounded">
                 <span className="text-gray-400 text-sm">روند کلی نمودار: </span>
                 <span className={`font-bold px-3 py-1 rounded text-sm ${data.technical.trend === 'Bullish' ? 'bg-green-900/30 text-bourse-green' : data.technical.trend === 'Bearish' ? 'bg-red-900/30 text-bourse-red' : 'bg-slate-700 text-gray-200'}`}>
                    {data.technical.trend === 'Bullish' ? 'صعودی ↗' : data.technical.trend === 'Bearish' ? 'نزولی ↘' : 'خنثی ↔'}
                 </span>
            </div>
            
             <p className="text-xs text-gray-300 leading-relaxed border-t border-slate-700 pt-3">
                {data.technical.volumeAnalysis}
            </p>
        </div>
        
        <div className="mt-6 pt-4 border-t-2 border-slate-600/50">
             <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-bourse-gold rounded-full animate-pulse"></span>
                نتیجه‌گیری نهایی سرمایه‌گذاری:
             </h4>
             <p className="text-sm text-gray-200 bg-slate-800 p-3 rounded-r-lg border-r-4 border-bourse-gold shadow-inner">
                {data.summary.investmentVerdict}
             </p>
        </div>
      </div>

    </div>
  );
};

export default MarketAnalysis;