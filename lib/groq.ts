const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface MarketInsight {
  summary: string;
  topPerformers: string[];
  marketTrend: 'bullish' | 'bearish' | 'neutral';
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export async function generateMarketInsights(coins: any[]): Promise<MarketInsight> {
  try {
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

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from Groq API');
    }

    // ✅ Parse JSON safely
    let insights: MarketInsight;
    try {
      // Extract JSON if wrapped in markdown or includes extra text
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Groq response as JSON:', content);
      throw new Error('Invalid JSON response from Groq API');
    }

    return insights;
  } catch (error) {
    console.error('Error generating market insights:', error);
    // Return fallback insights
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
