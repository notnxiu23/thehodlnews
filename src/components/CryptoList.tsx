import { useState } from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import type { CryptoData } from '../types';

interface CryptoListProps {
  cryptos: CryptoData[];
  onSelect: (crypto: CryptoData) => void;
  selectedCrypto?: CryptoData;
}

export function CryptoList({ cryptos }: CryptoListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CryptoData;
    direction: 'asc' | 'desc';
  }>({ key: 'marketCap', direction: 'desc' });

  const handleSort = (key: keyof CryptoData) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const formatPrice = (price: number) => {
    // For very small numbers (less than 0.01)
    if (price < 0.01) {
      return `$${price.toFixed(9)}`;
    }
    // For small numbers (less than 1)
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    // For regular numbers
    if (price < 1000) {
      return `$${price.toFixed(2)}`;
    }
    // For larger numbers
    if (price >= 1e9) return `$${(price / 1e9).toFixed(2)}B`;
    if (price >= 1e6) return `$${(price / 1e6).toFixed(2)}M`;
    if (price >= 1e3) return `$${(price / 1e3).toFixed(2)}K`;
    return `$${price.toFixed(2)}`;
  };

  const formatMarketCap = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const filteredAndSortedCryptos = cryptos
    .filter((crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      return (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1) * multiplier;
    });

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b dark:border-dark-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cryptocurrencies..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  Price
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('marketCap')}>
                <div className="flex items-center gap-1">
                  Market Cap
                  {sortConfig.key === 'marketCap' && (
                    sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Supply
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('change24h')}>
                <div className="flex items-center gap-1">
                  24h Change
                  {sortConfig.key === 'change24h' && (
                    sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
            {filteredAndSortedCryptos.map((crypto) => (
              <tr
                key={crypto.id}
                className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {crypto.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {crypto.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                  {formatPrice(crypto.price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatMarketCap(crypto.marketCap)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="text-gray-900 dark:text-white">
                    {formatSupply(crypto.circulatingSupply)}
                  </div>
                  {crypto.maxSupply && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Max: {formatSupply(crypto.maxSupply)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center gap-1 ${
                    crypto.change24h >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}