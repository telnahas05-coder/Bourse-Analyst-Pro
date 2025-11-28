import React from 'react';
import { FinancialReport } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: FinancialReport;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const FinancialSummary: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      
      {/* Top Row: Financials & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Statements */}
        <div className="bg-bourse-card p-6 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-bourse-accent mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            صورت‌های مالی و حسابرسی
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-gray-400">نوع گزارش:</span>
                    <span className="text-white text-sm">{data.financials.reportType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-gray-400">نظر حسابرس:</span>
                    <span className={`font-bold text-sm ${data.financials.auditOpinion.includes('مقبول') ? 'text-bourse-green' : 'text-bourse-gold'}`}>
                        {data.financials.auditOpinion}
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="bg-slate-800 p-2 rounded border border-slate-700">
                        <div className="text-[10px] text-gray-400 mb-1">سود خالص</div>
                        <div className="font-bold text-white text-xs break-words">{data.financials.profitability.netProfit}</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded border border-slate-700">
                        <div className="text-[10px] text-gray-400 mb-1">EPS</div>
                        <div className="font-bold text-white text-xs">{data.financials.profitability.eps}</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded border border-slate-700">
                        <div className="text-[10px] text-gray-400 mb-1">رشد</div>
                        <div className={`font-bold text-xs ${data.financials.profitability.growthRate.includes('-') ? 'text-bourse-red' : 'text-bourse-green'}`}>
                            {data.financials.profitability.growthRate}
                        </div>
                    </div>
                </div>
                
                {data.financials.auditorNotes.length > 0 && (
                    <div className="mt-4 bg-yellow-900/10 border border-yellow-700/30 p-3 rounded">
                        <span className="text-bourse-gold text-xs font-bold block mb-2 flex items-center gap-1">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                             نکات مهم حسابرس (بند شرط):
                        </span>
                        <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 pr-1">
                            {data.financials.auditorNotes.map((note, i) => <li key={i}>{note}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>

        {/* Compliance & Assets */}
        <div className="bg-bourse-card p-6 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-bourse-accent flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    ترکیب دارایی و امیدنامه
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${data.compliance.portfolioMatch > 80 ? 'bg-bourse-green/20 text-bourse-green' : 'bg-bourse-red/20 text-bourse-red'}`}>
                    تطابق: {data.compliance.portfolioMatch}%
                </span>
            </div>
            
            <div className="h-40 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={data.compliance.assetAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.compliance.assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', fontSize: '12px' }}
                    />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center text-[11px] text-gray-500 flex flex-wrap justify-center gap-2">
                {data.compliance.assetAllocation.map((item, i) => (
                    <span key={i} className="flex items-center">
                        <span className="w-2 h-2 rounded-full ml-1" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                        {item.name}: {item.value}%
                    </span>
                ))}
            </div>

            {data.compliance.violations.length > 0 && (
                <div className="mt-4 bg-red-900/10 border border-red-700/30 p-3 rounded">
                    <span className="text-bourse-red text-xs font-bold block mb-1">عدم تطابق با اساسنامه:</span>
                    <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                        {data.compliance.violations.map((v, i) => <li key={i}>{v}</li>)}
                    </ul>
                </div>
            )}
        </div>
      </div>

      {/* New Section: Profit & Loss Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-lg border border-slate-700">
            <h4 className="text-bourse-green font-bold text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                بهترین موارد سودساز (Profit Drivers)
            </h4>
            <ul className="space-y-2">
                {data.analysis.profitDrivers.length > 0 ? (
                    data.analysis.profitDrivers.map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2 bg-slate-800/50 p-2 rounded">
                            <span className="text-bourse-green mt-1">●</span> {item}
                        </li>
                    ))
                ) : <span className="text-gray-500 text-xs">موردی یافت نشد</span>}
            </ul>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-lg border border-slate-700">
            <h4 className="text-bourse-red font-bold text-sm mb-3 flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                موارد زیان‌ده یا ریسکی (Loss Drivers)
            </h4>
            <ul className="space-y-2">
                {data.analysis.lossDrivers.length > 0 ? (
                    data.analysis.lossDrivers.map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2 bg-slate-800/50 p-2 rounded">
                            <span className="text-bourse-red mt-1">●</span> {item}
                        </li>
                    ))
                ) : <span className="text-gray-500 text-xs">موردی یافت نشد</span>}
            </ul>
        </div>
      </div>

    </div>
  );
};

export default FinancialSummary;