import { useState, useEffect } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import type { CryptoPrice } from '../types';

interface CryptoCalculatorProps {
  prices: CryptoPrice[];
}

export function CryptoCalculator({ prices }: CryptoCalculatorProps) {
  const [amount, setAmount] = useState<string>('1');
  const [fromCrypto, setFromCrypto] = useState<string>(prices[0]?.symbol || 'BTC');
  const [toFiat, setToFiat] = useState<string>('USD');
  const [result, setResult] = useState<number>(0);

  const fiats = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' }
  ];

  // Exchange rates (simplified for demo)
  const fiatRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.5
  };

  useEffect(() => {
    const cryptoPrice = prices.find(p => p.symbol === fromCrypto)?.price || 0;
    const fiatRate = fiatRates[toFiat as keyof typeof fiatRates];
    const calculatedResult = parseFloat(amount || '0') * cryptoPrice * fiatRate;
    setResult(calculatedResult);
  }, [amount, fromCrypto, toFiat, prices]);

  const formatFiatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Crypto Calculator
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From (Crypto)
            </label>
            <select
              value={fromCrypto}
              onChange={(e) => setFromCrypto(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {prices.map((crypto) => (
                <option key={crypto.symbol} value={crypto.symbol}>
                  {crypto.symbol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To (Fiat)
            </label>
            <select
              value={toFiat}
              onChange={(e) => setToFiat(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {fiats.map((fiat) => (
                <option key={fiat.code} value={fiat.code}>
                  {fiat.code} ({fiat.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 text-center text-lg font-semibold text-gray-900 dark:text-white">
            {amount} {fromCrypto}
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="flex-1 text-center text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {formatFiatAmount(result, toFiat)}
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Current {fromCrypto} price: {formatFiatAmount(prices.find(p => p.symbol === fromCrypto)?.price || 0, 'USD')}
        </div>
      </div>
    </div>
  );
}