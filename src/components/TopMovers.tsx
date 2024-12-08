import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader } from 'lucide-react';
import { getTopMovers } from '../services/coingecko';
import toast from 'react-hot-toast';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  price_change_percentage_24h: number;
  current_price: number;
  image: string;
}

export function TopMovers() {
  const [topGainers, setTopGainers] = useState<Coin[]>([]);
  const [topLosers, setTopLosers] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTopMovers();
        
        // Sort by price change percentage
        const sorted = [...data].sort((a, b) => 
          b.price_change_percentage_24h - a.price_change_percentage_24h
        );
        
        setTopGainers(sorted.slice(0, 3));
        setTopLosers(sorted.slice(-3).reverse());
      } catch (error) {
        console.error('Failed to fetch top movers:', error);
        toast.error('Failed to load market movers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Gainers (24h)
          </h3>
        </div>
        <div className="space-y-4">
          {topGainers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {coin.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                    {coin.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-500 font-medium">
                  +{coin.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ${coin.current_price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Losers (24h)
          </h3>
        </div>
        <div className="space-y-4">
          {topLosers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {coin.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                    {coin.symbol}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-red-500 font-medium">
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ${coin.current_price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}