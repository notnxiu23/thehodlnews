import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader } from 'lucide-react';
import type { CryptoData, TimeRange } from '../types';
import { fetchCryptoHistory } from '../services/api';

interface CryptoChartProps {
  crypto: CryptoData;
}

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' },
  { label: 'ALL', value: 'all' }
];

interface ChartDataPoint {
  timestamp: number;
  price: number;
}

export function CryptoChart({ crypto }: CryptoChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCryptoHistory(crypto.id, timeRange);
        if (mounted) {
          setChartData(data);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load chart data');
          console.error('Chart data error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadChartData();

    return () => {
      mounted = false;
    };
  }, [crypto.id, timeRange]);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (timeRange) {
      case '24h':
        return date.toLocaleTimeString();
      case '7d':
      case '30d':
        return date.toLocaleDateString();
      default:
        return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {crypto.name} ({crypto.symbol})
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Current Price:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatValue(crypto.price)}
              </span>
              <span className={`${
                crypto.change24h >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                ({crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-white dark:bg-dark-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              stroke="#6B7280"
            />
            <YAxis
              tickFormatter={formatValue}
              stroke="#6B7280"
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
              formatter={(value: number) => [formatValue(value), 'Price']}
              labelFormatter={(timestamp) => formatDate(timestamp)}
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
      </div>
    </div>
  );
}