// ... (previous types remain the same)

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  explorerUrl: string;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';