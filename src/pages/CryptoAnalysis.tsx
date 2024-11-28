import { useState, useEffect } from 'react';
import { BackButton } from '../components/BackButton';
import { CryptoList } from '../components/CryptoList';
import { MarketOverview } from '../components/MarketOverview';
import { fetchCryptoList } from '../services/api';
import type { CryptoData } from '../types';
import { LoadingAnimation } from '../components/LoadingAnimation';

export function CryptoAnalysis() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCryptos = async () => {
      try {
        setLoading(true);
        const data = await fetchCryptoList();
        setCryptos(data);
      } catch (err) {
        setError('Failed to load cryptocurrency data');
        console.error('Error loading cryptos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCryptos();
    const interval = setInterval(loadCryptos, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Crypto Analysis
        </h1>
      </div>

      <div className="space-y-8">
        <MarketOverview />

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingAnimation size="lg" text="Loading cryptocurrencies..." />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400 py-8">
            {error}
          </div>
        ) : (
          <CryptoList
            cryptos={cryptos}
            onSelect={() => {}}
            selectedCrypto={undefined}
          />
        )}
      </div>
    </div>
  );
}