import { GoogleGenAI } from "@google/genai";
import { FinancialReport } from "../types";

export const analyzeSymbol = async (symbol: string): Promise<FinancialReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  // Define the structure we want as a plain object to stringify for the prompt
  // This avoids the API error when combining tools + responseSchema
  const targetStructure = {
    symbol: "String (e.g., فولاد)",
    companyName: "String",
    lastUpdate: "String (Persian Date)",
    financials: {
      reportType: "String (e.g., 6 Month Audited)",
      auditOpinion: "String (e.g., Maqbool, Mashroot)",
      auditorNotes: ["String (List of key 'Bande Shart' from auditor)"],
      profitability: {
        netProfit: "String",
        eps: "String",
        growthRate: "String"
      },
      balanceSheetHighlights: ["String"]
    },
    analysis: {
      profitDrivers: ["String (Best items leading to profit)"],
      lossDrivers: ["String (Items leading to loss/risk)"],
      keyInvestmentPoints: ["String"]
    },
    compliance: {
      portfolioMatch: 0, // Number 0-100
      violations: ["String (List violations of Omidnameh/Statutes)"],
      adherenceNotes: ["String"],
      assetAllocation: [{ name: "String", value: 0 }]
    },
    marketBoard: {
      lastPrice: "String",
      priceChange: "String",
      volume: "String",
      avgMonthVolume: "String",
      volumeStatus: "High | Normal | Low",
      institutionalBuy: "String (%)",
      institutionalSell: "String (%)",
      flowAnalysis: "String (Analysis of Haghighi/Hoghooghi moves)"
    },
    technical: {
      support: "String (Price level)",
      resistance: "String (Price level)",
      trend: "Bullish | Bearish | Neutral",
      volumeAnalysis: "String"
    },
    summary: {
      investmentVerdict: "String (Final conclusion)",
      strengths: ["String (Key strengths of the symbol)"]
    },
    checklist: [
      {
        item: "String (Action taken, e.g., 'Checked Codal')",
        status: "Checked | Warning | Failed",
        detail: "String (Result of check)"
      }
    ]
  };

  const prompt = `
    Act as a professional senior financial analyst for the Iranian Stock Market (TSE).
    Analyze the symbol: "${symbol}".
    
    You MUST perform these steps using Google Search:
    1.  **Codal.ir Analysis**: Find the latest financial statements (Audited preferred). 
        -   Extract Net Profit, EPS, and Auditor Opinion.
        -   IMPORTANT: If Audited, list specific Auditor Notes (Bande Shart).
        -   Identify what caused the most Profit (profitDrivers) and Loss (lossDrivers).
    2.  **Compliance Check**: Compare the latest Portfolio (Portfoy) or Operations against the Fund's Prospectus (Omidnameh) or Company Statutes.
        -   Calculate a match percentage.
        -   List any asset allocation violations.
    3.  **TSETMC Market Analysis**: Check current price, volume vs monthly average, and Institutional/Individual (Haghighi/Hoghooghi) flow.
    4.  **Technical Analysis**: Identify Support/Resistance based on volume clusters.
    
    **OUTPUT FORMAT**:
    Return strictly valid JSON matching exactly the structure below. 
    Do NOT use Markdown code blocks. 
    Do NOT add any text before or after the JSON.
    
    Target JSON Structure:
    ${JSON.stringify(targetStructure, null, 2)}
    
    Ensure all text fields are in Persian (Farsi).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // NOTE: responseMimeType: "application/json" is REMOVED to avoid conflict with tools
      }
    });

    let text = response.text;
    if (!text) throw new Error("Empty response from AI");

    // Clean up potential markdown formatting (```json ... ```)
    text = text.replace(/^```json\s*/g, '').replace(/^```\s*/g, '').replace(/```$/g, '').trim();
    
    let data: FinancialReport;
    try {
        data = JSON.parse(text) as FinancialReport;
    } catch (e) {
        console.error("Failed to parse JSON:", text);
        throw new Error("Failed to generate valid report format. Please try again.");
    }
    
    // Add source chunks if available from search
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (grounding) {
        const links = (grounding as any[])
          .map((c: any) => c.web?.uri)
          .filter((uri: any): uri is string => typeof uri === 'string');
        // Deduplicate links
        data.sources = [...new Set(links)];
    }

    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};