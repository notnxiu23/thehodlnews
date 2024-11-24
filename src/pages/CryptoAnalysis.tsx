import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Lightbulb, Loader } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchHistoricalPrices, generateInsights } from '../services/analysis';
import { MarketOverview } from '../components/MarketOverview';
import toast from 'react-hot-toast';

interface PriceData {
  timestamp: number;
  price: number;
}

interface Insight {
  type: 'bullish' | 'bearish' | 'neutral';
  message: string;
}

export function CryptoAnalysis() {
  const [symbol, setSymbol] = useState('');
  const [searchedSymbol, setSearchedSymbol] = useState('');
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setSearchedSymbol(symbol.toUpperCase());

    try {
      const data = await fetchHistoricalPrices(symbol);
      setPriceData(data);
      
      setInsightLoading(true);
      const newInsights = await generateInsights(symbol, data);
      setInsights(newInsights);
    } catch (error) {
      toast.error('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setInsightLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackButton />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Crypto Analysis
        </h1>
      </div>

      <div className="space-y-8">
        {/* Market Overview Section */}
        <MarketOverview />

        {/* Price Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 mb-8">
              <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Enter crypto symbol (e.g., BTC)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </form>

              {searchedSymbol && (
                <div className="h-[400px]">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                  ) : priceData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                          stroke="#6B7280"
                        />
                        <YAxis
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                          stroke="#6B7280"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: 'none',
                            borderRadius: '0.5rem',
                            color: '#F3F4F6'
                          }}
                          formatter={(value: number) => [formatPrice(value), 'Price']}
                          labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#4F46E5"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No data available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Insights
                </h2>
              </div>

              {insightLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
              ) : insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-dark-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getInsightIcon(insight.type)}
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {insight.type} Signal
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {insight.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : searchedSymbol ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  Search for a crypto symbol to see AI insights
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}