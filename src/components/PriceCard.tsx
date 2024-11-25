import { TrendingUp, TrendingDown } from 'lucide-react';
import type { CryptoPrice } from '../types';

interface PriceCardProps {
  crypto: CryptoPrice;
}

export function PriceCard({ crypto }: PriceCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return formatNumber(price);
    return `$${price.toFixed(2)}`;
  };

  const isPositive = crypto.change24h >= 0;

  return (
    <div className="market-card rounded-xl p-4 transition-all hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {crypto.symbol}/USD
        </span>
        <div className={`flex items-center gap-1 ${
          isPositive ? 'text-bull-600 dark:text-bull-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="font-medium text-sm sm:text-base">
            {crypto.change24h.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
        {formatPrice(crypto.price)}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <span className="block text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Market Cap
          </span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {formatNumber(crypto.marketCap)}
          </span>
        </div>
        <div className="space-y-1">
          <span className="block text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Volume (24h)
          </span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {formatNumber(crypto.volume24h)}
          </span>
        </div>
      </div>
    </div>
  );
}