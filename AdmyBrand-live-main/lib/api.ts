const API_BASE_URL = 'https://api.coinranking.com/v2';

export interface Coin {
  uuid: string;
  symbol: string;
  name: string;
  color: string | null;
  iconUrl: string;
  marketCap: string;
  price: string;
  listedAt: number;
  tier: number;
  change: string;
  rank: number;
  sparkline: string[];
  lowVolume: boolean;
  coinrankingUrl: string;
  '24hVolume': string;
  btcPrice: string;
}

export interface CoinsResponse {
  status: string;
  data: {
    stats: {
      total: number;
      totalCoins: number;
      totalMarkets: number;
      totalExchanges: number;
      totalMarketCap: string;
      total24hVolume: string;
    };
    coins: Coin[];
  };
}

export interface GlobalStats {
  total: number;
  totalCoins: number;
  totalMarkets: number;
  totalExchanges: number;
  totalMarketCap: string;
  total24hVolume: string;
}

export async function fetchCoins(limit: number = 50): Promise<CoinsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins?limit=${limit}&orderBy=marketCap&orderDirection=desc&offset=0`,
      {
        headers: {
          'x-access-token': process.env.NEXT_PUBLIC_COINRANKING_API_KEY || '',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
}

export async function fetchCoinHistory(uuid: string, timePeriod: string = '24h') {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coin/${uuid}/history?timePeriod=${timePeriod}`,
      {
        headers: {
          'x-access-token': process.env.NEXT_PUBLIC_COINRANKING_API_KEY || '',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coin history:', error);
    throw error;
  }
}

export async function fetchBitcoinHistory(timePeriod: string = '10m') {
  // Bitcoin UUID from CoinRanking API
  const bitcoinUuid = 'Qwsogvtv82FCd';
  return fetchCoinHistory(bitcoinUuid, timePeriod);
}

export function formatCurrency(value: string | number, currency: string = 'USD'): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numValue >= 1e12) {
    return `$${(numValue / 1e12).toFixed(2)}T`;
  } else if (numValue >= 1e9) {
    return `$${(numValue / 1e9).toFixed(2)}B`;
  } else if (numValue >= 1e6) {
    return `$${(numValue / 1e6).toFixed(2)}M`;
  } else if (numValue >= 1e3) {
    return `$${(numValue / 1e3).toFixed(2)}K`;
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(numValue);
  }
}

export function formatPercentage(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
}