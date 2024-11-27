import axios from 'axios';
import type { Category, NewsArticle, CryptoPrice, TrendingTopic } from '../types';

const CRYPTO_BASE_URL = 'https://min-api.cryptocompare.com/data';
const CRYPTO_API_KEY = 'd7019dd9c4be2753e8f196ef673f196992f778b204bfc91aa84e0b6b80d17529';

const api = axios.create({
  baseURL: CRYPTO_BASE_URL,
  headers: {
    'Authorization': `Apikey ${CRYPTO_API_KEY}`
  }
});

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
    market: ['market', 'price', 'trading', 'analysis'],
    metaverse: ['metaverse', 'virtual', 'reality', 'avatar'],
    web3: ['web3', 'dao', 'decentralized', 'governance'],
    gaming: ['gaming', 'game', 'play-to-earn', 'p2e'],
    institutional: ['institutional', 'investment', 'fund', 'adoption']
  };

  const tags = new Set<string>();
  const lowercaseText = text.toLowerCase();

  Object.entries(commonTags).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      tags.add(category);
    }
  });

  const coinPattern = /\b(btc|eth|sol|ada|xrp|doge|dot)\b/gi;
  const coins = text.match(coinPattern) || [];
  coins.forEach(coin => tags.add(coin.toLowerCase()));

  return Array.from(tags);
}

// Simple sentiment analysis based on keyword matching
function analyzeSentiment(text: string): number {
  const positiveWords = [
    'bullish', 'surge', 'gain', 'rally', 'boost', 'soar', 'rise', 'growth',
    'positive', 'breakthrough', 'adoption', 'success', 'partnership', 'launch'
  ];
  const negativeWords = [
    'bearish', 'crash', 'drop', 'fall', 'decline', 'loss', 'risk', 'concern',
    'negative', 'fail', 'scam', 'hack', 'ban', 'regulation', 'warning'
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
  try {
    const categories: Record<Category, string> = {
      all: '',
      market: 'MARKET,TRADING,ANALYSIS',
      bitcoin: 'BTC',
      ethereum: 'ETH',
      altcoins: 'XRP,ADA,DOT,SOL',
      memecoins: 'DOGE,PEPE,FLOKI',
      mining: 'MINING',
      defi: 'DEFI',
      nft: 'NFT',
      regulation: 'REGULATION,POLICY',
      security: 'SCAM,HACK,SECURITY',
      blockchain: 'BLOCKCHAIN,TECHNOLOGY,DEVELOPMENT',
      exchange: 'EXCHANGE,BINANCE,COINBASE,KRAKEN',
      airdrops: 'AIRDROP,GIVEAWAY',
      ico: 'ICO,IDO,IEO,LAUNCH',
      institutional: 'INSTITUTIONAL,ADOPTION,INVESTMENT,BLACKROCK,GRAYSCALE',
      gaming: 'GAMING,P2E,GAMEFI,AXIE,SANDBOX',
      metaverse: 'METAVERSE,VIRTUAL,DECENTRALAND,SANDBOX,ROBLOX',
      community: 'COMMUNITY,EVENT,CONFERENCE,MEETUP,AMA',
      web3: 'WEB3,DAO,DECENTRALIZATION,GOVERNANCE'
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

    return response.data.Data.map((article: any) => ({
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
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
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

    return Object.entries(response.data.RAW).map(([symbol, data]: [string, any]) => ({
      symbol,
      price: data.USD.PRICE,
      change24h: data.USD.CHANGEPCT24HOUR,
      marketCap: data.USD.MKTCAP,
      volume24h: data.USD.VOLUME24HOUR,
    }));
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
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
        .filter((word: string) => word.length > 3 && !['this', 'that', 'with', 'from'].includes(word));

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

    return Array.from(topics.entries())
      .map(([topic, data]) => ({
        topic,
        sentiment: data.sentiment / data.count,
        volume: data.count,
        change24h: Math.random() * 200 - 100 // Simulated change
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  } catch (error) {
    console.error('Error in fetchTrendingTopics:', error);
    throw error;
  }
}