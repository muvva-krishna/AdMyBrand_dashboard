export async function handler(event, context) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  const { coins } = JSON.parse(event.body);

  const topCoins = coins.slice(0, 10);
  const marketData = topCoins.map(coin => ({
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price,
    change: coin.change,
    marketCap: coin.marketCap,
    rank: coin.rank
  }));

  const prompt = `You are an expert market analyst. Analyze the following cryptocurrency market data and return ONLY valid JSON (no extra text, explanations, or markdown):

${JSON.stringify(marketData, null, 2)}

Your JSON must strictly follow this structure:
{
  "summary": "2-3 sentence summary",
  "topPerformers": ["Coin1", "Coin2", "Coin3"],
  "marketTrend": "bullish" | "bearish" | "neutral",
  "recommendations": ["Rec1", "Rec2", "Rec3"],
  "riskLevel": "low" | "medium" | "high"
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/\{[\s\S]*\}/);
    const insights = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : null;

    return {
      statusCode: 200,
      body: JSON.stringify(insights),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        summary: "Market analysis temporarily unavailable. Please try refreshing the data.",
        topPerformers: ["Bitcoin", "Ethereum", "BNB"],
        marketTrend: 'neutral',
        recommendations: [
          "Monitor market volatility for campaign timing",
          "Focus on stable cryptocurrencies for partnerships",
          "Track social sentiment for content strategy"
        ],
        riskLevel: 'medium'
      }),
    };
  }
}

