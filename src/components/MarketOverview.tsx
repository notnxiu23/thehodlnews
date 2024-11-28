import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { schemeSet3 } from 'd3';
import { Loader } from 'lucide-react';
import { getGlobalData, type GlobalData } from '../services/coingecko';

export function MarketOverview() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGlobalData();
        setGlobalData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !globalData) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 py-8">
        {error || 'Unable to load market data'}
      </div>
    );
  }

  const dominanceData = Object.entries(globalData.market_cap_percentage)
    .map(([name, value]) => ({
      name: name.toUpperCase(),
      value: Number(value.toFixed(2))
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const formatValue = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Market Overview
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Dominance Chart */}
        <div className="h-80">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Market Dominance
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dominanceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name} ${value}%`}
              >
                {dominanceData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={schemeSet3[index % schemeSet3.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Market Stats */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              Market Statistics
            </h4>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Market Cap
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatValue(globalData.total_market_cap.usd)}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  24h Trading Volume
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatValue(globalData.total_volume.usd)}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Market Cap Change (24h)
                </div>
                <div className={`text-xl font-semibold ${
                  globalData.market_cap_change_percentage_24h_usd >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}