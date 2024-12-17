import axios from 'axios';
import type { Category, NewsArticle, CryptoPrice, TrendingTopic } from '../types';

const CRYPTO_BASE_URL = 'https://min-api.cryptocompare.com/data';
const CRYPTO_API_KEY = '313123e26b203f6f4aea65879f90266a43120f657ed6ca8ff8c1e5702f03989a';

// Cache configuration
const CACHE_DURATION = {
  NEWS: 5 * 60 * 1000,      // 5 minutes
  PRICES: 2 * 60 * 1000,    // 2 minutes
  TRENDING: 15 * 60 * 1000  // 15 minutes
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = {
  news: new Map<string, CacheItem<NewsArticle[]>>(),
  prices: new Map<string, CacheItem<CryptoPrice[]>>(),
  trending: new Map<string, CacheItem<TrendingTopic[]>>()
};

const api = axios.create({
  baseURL: CRYPTO_BASE_URL,
  headers: {
    'Authorization': `Apikey ${CRYPTO_API_KEY}`
  }
});

// Cache helper functions
function getFromCache<T>(key: string, cacheMap: Map<string, CacheItem<T>>, duration: number): T | null {
  const cached = cacheMap.get(key);
  if (cached && Date.now() - cached.timestamp < duration) {
    return cached.data;
  }
  return null;
}

function setCache<T>(key: string, data: T, cacheMap: Map<string, CacheItem<T>>) {
  cacheMap.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Extract relevant tags from article text
function extractTags(text: string): string[] {
  const commonTags = {
    bitcoin: ['bitcoin', 'btc', 'satoshi'],
    ethereum: ['ethereum', 'eth', 'vitalik', 'buterin'],
    defi: ['defi', 'yield', 'lending', 'borrowing', 'liquidity'],
    nft: ['nft', 'opensea', 'collection', 'art'],
    mining: ['mining', 'miner', 'hash', 'pow'],
    regulation: ['regulation', 'sec', 'policy', 'compliance'],
    security: ['security', 'hack', 'exploit', 'vulnerability'],
    market: ['market', 'price', 'trading', 'analysis']
  };

  const tags = new Set<string>();
  const lowercaseText = text.toLowerCase();

  Object.entries(commonTags).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      tags.add(category);
    }
  });

  return Array.from(tags);
}

// Simple sentiment analysis based on keyword matching
function analyzeSentiment(text: string): number {
  const positiveWords = [
    'bullish', 'surge', 'gain', 'rally', 'boost', 'soar', 'rise', 'growth',
    'positive', 'breakthrough', 'adoption', 'success'
  ];
  const negativeWords = [
    'bearish', 'crash', 'drop', 'fall', 'decline', 'loss', 'risk', 'concern',
    'negative', 'fail', 'scam', 'hack', 'ban'
  ];

  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  let relevantWords = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) {
      score += 1;
      relevantWords++;
    }
    if (negativeWords.includes(word)) {
      score -= 1;
      relevantWords++;
    }
  });

  return relevantWords > 0 ? score / relevantWords : 0;
}

export async function fetchNews(category: Category): Promise<NewsArticle[]> {
  const cacheKey = `news-${category}`;
  const cachedNews = getFromCache(cacheKey, cache.news, CACHE_DURATION.NEWS);
  if (cachedNews) return cachedNews;

  try {
    const categories: Record<Category, string> = {
      all: '',
      market: 'MARKET,TRADING,ANALYSIS',
      bitcoin: 'BTC',
      ethereum: 'ETH',
      altcoins: 'XRP,ADA,DOT,SOL',
      memecoins: 'DOGE,SHIB',
      mining: 'MINING',
      defi: 'DEFI',
      nft: 'NFT',
      regulation: 'REGULATION',
      security: 'SECURITY',
      blockchain: 'BLOCKCHAIN',
      exchange: 'EXCHANGE',
      airdrops: 'AIRDROP',
      ico: 'ICO',
      institutional: 'INSTITUTIONAL',
      gaming: 'GAMING',
      metaverse: 'METAVERSE',
      community: 'COMMUNITY',
      web3: 'WEB3'
    };

    const response = await api.get('/v2/news/', {
      params: {
        lang: 'EN',
        categories: categories[category],
        excludeCategories: 'Sponsored',
        sortOrder: 'popular',
        extraParams: 'News',
        api_key: CRYPTO_API_KEY
      }
    });

    if (!response.data?.Data) {
      throw new Error('Invalid response format from news API');
    }

    const news = response.data.Data.map((article: any) => ({
      title: article.title,
      description: article.body,
      url: article.url,
      urlToImage: article.imageurl,
      publishedAt: article.published_on * 1000,
      source: {
        name: article.source
      },
      sentiment: analyzeSentiment(article.title + ' ' + article.body),
      tags: extractTags(article.title + ' ' + article.body)
    }));

    setCache(cacheKey, news, cache.news);
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  const cacheKey = 'prices';
  const cachedPrices = getFromCache(cacheKey, cache.prices, CACHE_DURATION.PRICES);
  if (cachedPrices) return cachedPrices;

  try {
    const symbols = ['BTC', 'ETH', 'XRP', 'SOL', 'ADA', 'DOGE', 'LINK', 'DOT'];
    const response = await api.get('/pricemultifull', {
      params: {
        fsyms: symbols.join(','),
        tsyms: 'USD',
        api_key: CRYPTO_API_KEY
      }
    });

    if (!response.data?.RAW) {
      throw new Error('Invalid response format from price API');
    }

    const prices = Object.entries(response.data.RAW).map(([symbol, data]: [string, any]) => ({
      symbol,
      price: data.USD.PRICE,
      change24h: data.USD.CHANGEPCT24HOUR,
      marketCap: data.USD.MKTCAP,
      volume24h: data.USD.VOLUME24HOUR,
    }));

    setCache(cacheKey, prices, cache.prices);
    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  const cacheKey = 'trending';
  const cachedTopics = getFromCache(cacheKey, cache.trending, CACHE_DURATION.TRENDING);
  if (cachedTopics) return cachedTopics;

  try {
    const response = await api.get('/v2/news/toplist', {
      params: {
        sortOrder: 'viral',
        lang: 'EN',
        limit: 10,
        api_key: CRYPTO_API_KEY
      }
    });

    if (!response.data?.Data?.length) {
      return [];
    }

    const topics = new Map<string, { count: number; sentiment: number; }>();
    
    response.data.Data.forEach((article: any) => {
      if (!article.title) return;
      
      const words = article.title
        .toLowerCase()
        .split(/\W+/)
        .filter((word: string) => word.length > 3);

      const sentiment = analyzeSentiment(article.title + ' ' + article.body);

      words.forEach((word: string) => {
        if (!topics.has(word)) {
          topics.set(word, { count: 0, sentiment: 0 });
        }
        const topic = topics.get(word)!;
        topic.count++;
        topic.sentiment += sentiment;
      });
    });

    const trendingTopics = Array.from(topics.entries())
      .map(([topic, data]) => ({
        topic,
        sentiment: data.sentiment / data.count,
        volume: data.count,
        change24h: Math.random() * 200 - 100 // Simulated change
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);

    setCache(cacheKey, trendingTopics, cache.trending);
    return trendingTopics;
  } catch (error) {
    console.error('Error in fetchTrendingTopics:', error);
    throw error;
  }
}