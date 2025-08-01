export async function generateMarketInsights(coins: any[]) {
  try {
    const response = await fetch('/.netlify/functions/market-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coins }),
    });

    return await response.json();
  } catch (error) {
    console.error('Fallback used due to error:', error);
    return {
      summary: "Market analysis temporarily unavailable. Please try refreshing the data.",
      topPerformers: ["Bitcoin", "Ethereum", "BNB"],
      marketTrend: 'neutral',
      recommendations: [
        "Monitor market volatility for campaign timing",
        "Focus on stable cryptocurrencies for partnerships",
        "Track social sentiment for content strategy"
      ],
      riskLevel: 'medium'
    };
  }
}
