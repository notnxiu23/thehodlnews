import { useEffect, useState, memo } from 'react';
import { fetchCryptoPrices } from '../services/api';
import { PriceCard } from './PriceCard';
import { PriceAlerts } from './PriceAlerts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CryptoPrice, PriceAlert, UserPreferences } from '../types';

export function PriceOverview() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('userPreferences', {
    favoriteCategories: [],
    priceAlerts: [],
  });

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const data = await fetchCryptoPrices();
        setPrices(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch crypto prices';
        setError(errorMessage);
        console.error('Failed to fetch crypto prices:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAddAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    try {
      const newAlert: PriceAlert = {
        ...alert,
        id: Math.random().toString(36).substring(2),
        createdAt: Date.now(),
      };

      setPreferences((prev) => ({
        ...prev,
        priceAlerts: [...(prev.priceAlerts || []), newAlert],
      }));
    } catch (err) {
      console.error('Failed to add alert:', err);
    }
  };

  const handleRemoveAlert = (id: string) => {
    try {
      setPreferences((prev) => ({
        ...prev,
        priceAlerts: (prev.priceAlerts || []).filter((alert) => alert.id !== id),
      }));
    } catch (err) {
      console.error('Failed to remove alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 animate-pulse"
          >
            <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-32 mb-2"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 bg-gray-200 dark:bg-dark-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-dark-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Overview</h2>
        <PriceAlerts
          prices={prices}
          alerts={preferences.priceAlerts || []}
          onAddAlert={handleAddAlert}
          onRemoveAlert={handleRemoveAlert}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {prices.map((crypto) => (
          <PriceCard key={crypto.symbol} crypto={crypto} />
        ))}
      </div>
    </div>
  );
}