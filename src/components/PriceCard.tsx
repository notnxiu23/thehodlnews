import { TrendingUp, TrendingDown } from 'lucide-react';
import type { CryptoPrice } from '../types';

interface PriceCardProps {
  crypto: CryptoPrice;
}

export function PriceCard({ crypto }: PriceCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const isPositive = crypto.change24h >= 0;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {crypto.symbol}/USD
        </span>
        <div
          className={`flex items-center gap-1 ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="font-medium">
            {crypto.change24h.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        {formatNumber(crypto.price)}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="block text-gray-500 dark:text-gray-400">Market Cap</span>
          <span className="text-gray-700 dark:text-gray-300">{formatNumber(crypto.marketCap)}</span>
        </div>
        <div>
          <span className="block text-gray-500 dark:text-gray-400">Volume (24h)</span>
          <span className="text-gray-700 dark:text-gray-300">{formatNumber(crypto.volume24h)}</span>
        </div>
      </div>
    </div>
  );
}