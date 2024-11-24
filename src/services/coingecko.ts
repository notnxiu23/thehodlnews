import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3'
});

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  market_cap: number;
  total_volume: number;
  current_price: number;
  price_change_percentage_24h: number;
}

export interface GlobalData {
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
}

export async function getTopCoins(limit = 50): Promise<MarketData[]> {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        sparkline: false
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch top coins:', error);
    throw error;
  }
}

export async function getGlobalData(): Promise<GlobalData> {
  try {
    const response = await api.get('/global');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch global data:', error);
    throw error;
  }
}

export async function getCoinHistory(id: string, days: number) {
  try {
    const response = await api.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
        interval: days > 30 ? 'daily' : 'hourly'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch coin history:', error);
    throw error;
  }
}