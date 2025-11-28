export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface FinancialReport {
  symbol: string;
  companyName: string;
  entityType: 'Fund' | 'Company'; // New field to distinguish logic
  lastUpdate: string;
  
  // Codal & Financials
  financials: {
    reportType: string; // e.g., Audited 6-month, Monthly Activity
    auditOpinion: string; // e.g., Unqualified, Qualified
    auditorNotes: string[];
    profitability: {
      netProfit: string;
      eps: string;
      growthRate: string; // For companies: YoY Net Profit. For Funds: NAV Growth
    };
    balanceSheetHighlights: string[];
  };

  // Profit/Loss Analysis
  analysis: {
    profitDrivers: string[]; // Companies: Best selling products. Funds: Best performing sectors.
    lossDrivers: string[]; 
    keyInvestmentPoints: string[];
  };

  // Compliance (Funds) OR Sales Mix (Companies)
  compliance: {
    portfolioMatch: number; // Funds: 0-100 score. Companies: N/A (-1)
    violations: string[]; // Funds: Omidnameh violations. Companies: Auditor alerts.
    adherenceNotes: string[];
    // For Funds: Asset Allocation (Stocks, Bonds, Cash)
    // For Companies: Sales Mix (Product A, Product B...)
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
    // New Fields
    movingAverages: {
        status: 'Bullish' | 'Bearish' | 'Neutral'; 
        details: string; // e.g., "Price above SMA 50"
    };
    candlestickPatterns: string[]; // e.g. ["Hammer", "Engulfing"]
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