import React from 'react';
import { FinancialReport } from '../types';

interface Props {
  checklist: FinancialReport['checklist'];
}

const AnalysisChecklist: React.FC<Props> = ({ checklist }) => {
  return (
    <div className="bg-bourse-card rounded-lg p-6 border border-slate-700 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-white border-b border-slate-600 pb-2">
        چک‌لیست فرآیند تحلیل
      </h3>
      <div className="space-y-3">
        {checklist.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded text-sm">
            <div className="mt-1">
              {item.status === 'Checked' && (
                <svg className="w-5 h-5 text-bourse-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              )}
              {item.status === 'Warning' && (
                <svg className="w-5 h-5 text-bourse-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
              {item.status === 'Failed' && (
                <svg className="w-5 h-5 text-bourse-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-200">{item.item}</p>
              <p className="text-gray-400 text-xs mt-1">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisChecklist;