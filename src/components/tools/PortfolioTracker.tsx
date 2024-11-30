import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCryptoPrices } from '../../services/api';
import type { CryptoPrice } from '../../types';

interface Asset {
  id: string;
  symbol: string;
  amount: number;
  buyPrice: number;
}

export function PortfolioTracker() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    amount: '',
    buyPrice: ''
  });

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const data = await fetchCryptoPrices();
        setPrices(data);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
        toast.error('Failed to fetch current prices');
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getCurrentPrice = (symbol: string): number => {
    const price = prices.find(p => p.symbol === symbol.toUpperCase());
    return price?.price || 0;
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.symbol || !newAsset.amount || !newAsset.buyPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    const currentPrice = getCurrentPrice(newAsset.symbol);
    if (!currentPrice) {
      toast.error('Invalid cryptocurrency symbol');
      return;
    }

    const asset: Asset = {
      id: Date.now().toString(),
      symbol: newAsset.symbol.toUpperCase(),
      amount: parseFloat(newAsset.amount),
      buyPrice: parseFloat(newAsset.buyPrice)
    };

    setAssets(prev => [...prev, asset]);
    setNewAsset({ symbol: '', amount: '', buyPrice: '' });
    toast.success('Asset added successfully');
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
    toast.success('Asset removed');
  };

  const calculateTotalValue = () => {
    return assets.reduce((total, asset) => {
      const currentPrice = getCurrentPrice(asset.symbol);
      return total + (currentPrice * asset.amount);
    }, 0);
  };

  const calculateTotalProfit = () => {
    return assets.reduce((total, asset) => {
      const currentPrice = getCurrentPrice(asset.symbol);
      const profit = (currentPrice - asset.buyPrice) * asset.amount;
      return total + profit;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Portfolio Value
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${calculateTotalValue().toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Total Profit/Loss
          </h3>
          <div className="flex items-center gap-2">
            {calculateTotalProfit() >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <p className={`text-2xl font-bold ${
              calculateTotalProfit() >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ${Math.abs(calculateTotalProfit()).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddAsset} className="flex flex-wrap gap-4">
        <input
          type="text"
          value={newAsset.symbol}
          onChange={e => setNewAsset(prev => ({ ...prev, symbol: e.target.value }))}
          placeholder="Symbol (e.g., BTC)"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="number"
          value={newAsset.amount}
          onChange={e => setNewAsset(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Amount"
          step="any"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="number"
          value={newAsset.buyPrice}
          onChange={e => setNewAsset(prev => ({ ...prev, buyPrice: e.target.value }))}
          placeholder="Buy Price ($)"
          step="any"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-5 h-5" />
          Add Asset
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b dark:border-dark-700">
              <th className="pb-3 text-gray-500 dark:text-gray-400">Asset</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Amount</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Buy Price</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Current Price</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Profit/Loss</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => {
              const currentPrice = getCurrentPrice(asset.symbol);
              const profit = (currentPrice - asset.buyPrice) * asset.amount;
              const profitPercentage = ((currentPrice - asset.buyPrice) / asset.buyPrice) * 100;

              return (
                <tr key={asset.id} className="border-b dark:border-dark-700">
                  <td className="py-4 font-medium text-gray-900 dark:text-white">
                    {asset.symbol}
                  </td>
                  <td className="py-4 text-gray-700 dark:text-gray-300">
                    {asset.amount}
                  </td>
                  <td className="py-4 text-gray-700 dark:text-gray-300">
                    ${asset.buyPrice.toLocaleString()}
                  </td>
                  <td className="py-4 text-gray-700 dark:text-gray-300">
                    ${currentPrice.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <div className={`flex items-center gap-1 ${
                      profit >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {profit >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>${Math.abs(profit).toLocaleString()}</span>
                      <span className="text-sm">
                        ({profitPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handleRemoveAsset(asset.id)}
                      className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}