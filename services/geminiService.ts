import { GoogleGenAI } from "@google/genai";
import { FinancialReport } from "../types";

export const analyzeSymbol = async (symbol: string): Promise<FinancialReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  // Define target structure for JSON parsing
  const targetStructure = {
    symbol: "String",
    companyName: "String",
    entityType: "Fund | Company",
    lastUpdate: "String (Persian Date)",
    financials: {
      reportType: "String (e.g., 6 Month Audited / Monthly Activity)",
      auditOpinion: "String (e.g., Maqbool, Mashroot)",
      auditorNotes: ["String (CRITICAL: Extract specific 'Bande Shart' regarding violations, liquidity, or fraud)"],
      profitability: {
        netProfit: "String",
        eps: "String",
        growthRate: "String"
      },
      balanceSheetHighlights: ["String"]
    },
    analysis: {
      profitDrivers: ["String (Best performing items/products)"],
      lossDrivers: ["String (Loss making items/risks)"],
      keyInvestmentPoints: ["String"]
    },
    compliance: {
      portfolioMatch: 0, // Number 0-100 (Use -1 for Companies)
      violations: ["String (Omidnameh violations OR Regulatory issues)"],
      adherenceNotes: ["String"],
      assetAllocation: [{ name: "String", value: 0 }] // Assets for Funds, Product Mix for Companies
    },
    marketBoard: {
      lastPrice: "String",
      priceChange: "String",
      volume: "String",
      avgMonthVolume: "String",
      volumeStatus: "High | Normal | Low",
      institutionalBuy: "String (%)",
      institutionalSell: "String (%)",
      flowAnalysis: "String (Haghighi/Hoghooghi Analysis)"
    },
    technical: {
      support: "String",
      resistance: "String",
      trend: "Bullish | Bearish | Neutral",
      volumeAnalysis: "String",
      movingAverages: {
        status: "Bullish | Bearish | Neutral",
        details: "String (e.g. Price above SMA50, Golden Cross)"
      },
      candlestickPatterns: ["String (e.g. Hammer, Doji, Engulfing)"]
    },
    summary: {
      investmentVerdict: "String",
      strengths: ["String"]
    },
    checklist: [
      {
        item: "String",
        status: "Checked | Warning | Failed",
        detail: "String"
      }
    ]
  };

  const prompt = `
    Act as a senior Iranian Stock Market (TSE) analyst. Analyze symbol: "${symbol}".
    
    **PHASE 1: IDENTIFY TYPE**
    Determine if this is a **FUND (ETF/Mutual)** or a **COMPANY (Sahami)**.
    
    **PHASE 2: EXECUTE RESEARCH (Use Google Search)**
    
    1.  **CODAL.IR (Financials - CRITICAL)**:
        *   **AUDITOR CHECK**: Search for the latest **AUDITED** Financial Statement (Soorat Mali Hesabresi Shode).
            *   **MUST EXTRACT**: Any "Bande Shart" (Qualifications) regarding:
                *   Financial violations (Takhalofat).
                *   Liquidity cycles (Charkhe Naghdinegi).
                *   Regulatory non-compliance.
            *   If the opinion is "Mashroot" or "Mardood", list the reasons clearly in 'auditorNotes'.
        *   **IF FUND**: Search for "Omidnameh", "Asasnameh", and latest "Portfoy". Check asset limits vs Omidnameh.
        *   **IF COMPANY**: Search for latest "Monthly Activity Report". Analyze Sales Mix (Best/Worst products).
    
    2.  **MARKET DATA (TSETMC)**:
        *   Get Last Price, Volume, Monthly Avg Volume.
        *   Analyze "Haghighi/Hoghooghi" (Individual/Institutional) buy/sell percentages.
    
    3.  **TECHNICAL ANALYSIS (Rahavard 365, Bourse24, Agah)**:
        *   Identify Support/Resistance levels.
        *   **INDICATORS**: Check Moving Averages (SMA 20, SMA 50). Is price above or below?
        *   **PATTERNS**: Look for recent Candlestick patterns (e.g., Hammer, Doji, Engulfing, Head & Shoulders) on Daily timeframe.
    
    **PHASE 3: GENERATE REPORT (JSON)**
    
    Map findings to this logic:
    *   **entityType**: 'Fund' or 'Company'.
    *   **compliance.portfolioMatch**: Calculate for Funds (0-100). For Companies, put -1.
    *   **technical**: Fill 'movingAverages' and 'candlestickPatterns' based on technical findings.
    
    **OUTPUT FORMAT**:
    Return ONLY valid JSON matching this structure. No Markdown. All text must be in **PERSIAN (Farsi)**.
    
    ${JSON.stringify(targetStructure)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text;
    if (!text) throw new Error("Empty response from AI");

    // Clean up potential markdown formatting
    text = text.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/```$/g, '').trim();
    
    let data: FinancialReport;
    try {
        data = JSON.parse(text) as FinancialReport;
    } catch (e) {
        // Fallback cleanup if JSON is dirty
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            data = JSON.parse(jsonMatch[0]) as FinancialReport;
        } else {
             throw new Error("Failed to parse analysis report.");
        }
    }
    
    // Process sources
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (grounding) {
        const links = (grounding as any[])
          .map((c: any) => c.web?.uri)
          .filter((uri: any): uri is string => typeof uri === 'string');
        data.sources = [...new Set(links)];
    }

    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("خطا در ارتباط با سرور تحلیل. لطفا مجدد تلاش کنید.");
  }
};