export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface FinancialReport {
  symbol: string;
  companyName: string;
  lastUpdate: string;
  
  // Codal & Financials
  financials: {
    reportType: string; // e.g., Audited 6-month
    auditOpinion: string; // e.g., Unqualified, Qualified
    auditorNotes: string[];
    profitability: {
      netProfit: string;
      eps: string;
      growthRate: string;
    };
    balanceSheetHighlights: string[];
  };

  // Profit/Loss Analysis (New Requirement)
  analysis: {
    profitDrivers: string[]; // Items leading to profit
    lossDrivers: string[]; // Items leading to loss
    keyInvestmentPoints: string[];
  };

  // Compliance (Omidnameh)
  compliance: {
    portfolioMatch: number; // 0-100 percentage score
    violations: string[];
    adherenceNotes: string[];
    assetAllocation: { name: string; value: number }[];
  };

  // TSETMC Market Board
  marketBoard: {
    lastPrice: string;
    priceChange: string;
    volume: string;
    avgMonthVolume: string;
    volumeStatus: 'High' | 'Normal' | 'Low';
    institutionalBuy: string; // percentage
    institutionalSell: string; // percentage
    flowAnalysis: string;
  };

  // Technical Analysis
  technical: {
    support: string;
    resistance: string;
    trend: 'Bullish' | 'Bearish' | 'Neutral';
    volumeAnalysis: string;
  };

  // Overall
  summary: {
    investmentVerdict: string;
    strengths: string[];
  };

  checklist: {
    item: string;
    status: 'Checked' | 'Warning' | 'Failed';
    detail: string;
  }[];
  
  sources: string[];
}