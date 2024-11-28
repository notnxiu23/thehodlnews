import { useState, useEffect } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { fetchCryptoList } from '../services/api';
import type { CryptoData } from '../types';
import toast from 'react-hot-toast';

interface PortfolioEntry {
  id: string;
  cryptoId: string;
  amount: number;
  buyPrice: number;
}

export function PortfolioTracker() {
  const [cryptoList, setCryptoList] = useState<CryptoData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCryptos = async () => {
      try {
        const data = await fetchCryptoList();
        setCryptoList(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading cryptocurrencies:', error);
        toast.error('Failed to load cryptocurrencies');
        setLoading(false);
      }
    };

    loadCryptos();
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCrypto || !amount || !buyPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    const newEntry: PortfolioEntry = {
      id: Date.now().toString(),
      cryptoId: selectedCrypto,
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice)
    };

    setPortfolio([...portfolio, newEntry]);
    setSelectedCrypto('');
    setAmount('');
    setBuyPrice('');
    toast.success('Added to portfolio');
  };

  const handleRemoveEntry = (id: string) => {
    setPortfolio(portfolio.filter(entry => entry.id !== id));
    toast.success('Removed from portfolio');
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, entry) => {
      const crypto = cryptoList.find(c => c.id === entry.cryptoId);
      if (!crypto) return total;
      return total + (crypto.price * entry.amount);
    }, 0);
  };

  const calculateTotalInvestment = () => {
    return portfolio.reduce((total, entry) => {
      return total + (entry.buyPrice * entry.amount);
    }, 0);
  };

  const totalValue = calculatePortfolioValue();
  const totalInvestment = calculateTotalInvestment();
  const totalProfit = totalValue - totalInvestment;
  const profitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Portfolio Tracker
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your cryptocurrency investments and monitor their performance.
        </p>
      </div>

      <form onSubmit={handleAddEntry} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cryptocurrency
          </label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select...</option>
            {cryptoList.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
            min="0"
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buy Price (USD)
          </label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
            min="0"
            step="any"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            ${totalValue.toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Investment</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            ${totalInvestment.toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Profit/Loss</div>
          <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ${totalProfit.toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Return</div>
          <div className={`text-xl font-bold ${profitPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {profitPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asset</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buy Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit/Loss</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
            {portfolio.map((entry) => {
              const crypto = cryptoList.find(c => c.id === entry.cryptoId);
              if (!crypto) return null;

              const currentValue = crypto.price * entry.amount;
              const investmentValue = entry.buyPrice * entry.amount;
              const profit = currentValue - investmentValue;
              const profitPercentage = (profit / investmentValue) * 100;

              return (
                <tr key={entry.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={crypto.image} alt={crypto.name} className="w-6 h-6 rounded-full mr-2" />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {crypto.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${entry.buyPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${crypto.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className={profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      ${profit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleRemoveEntry(entry.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {portfolio.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No assets in portfolio. Add some above!
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p>
          This portfolio tracker is for personal use only. Data is stored locally in your browser and will be lost if you clear your browser data. For more secure tracking, consider using a dedicated portfolio management service.
        </p>
      </div>
    </div>
  );
}