export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string | number;
  source: {
    name: string;
  };
  sentiment: number;
  tags: string[];
}

export interface TrendingTopic {
  topic: string;
  sentiment: number;
  volume: number;
  change24h: number;
}

export type Category = 
  | 'all' 
  | 'bitcoin' 
  | 'ethereum' 
  | 'altcoins' 
  | 'mining' 
  | 'defi' 
  | 'nft' 
  | 'regulation' 
  | 'market' 
  | 'security' 
  | 'blockchain' 
  | 'exchange' 
  | 'memecoins' 
  | 'airdrops' 
  | 'ico' 
  | 'institutional'
  | 'gaming'
  | 'metaverse'
  | 'community'
  | 'web3';

export interface ErrorState {
  message: string;
  code?: string;
}

export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export interface UserPreferences {
  favoriteCategories: Category[];
  priceAlerts: PriceAlert[];
}

export interface PriceAlert {
  id: string;
  symbol: string;
  type: 'above' | 'below';
  price: number;
  createdAt: number;
  triggered?: boolean;
}