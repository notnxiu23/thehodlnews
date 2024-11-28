import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';

interface FearGreedData {
  value: number;
  classification: string;
  timestamp: string;
}

export function FearGreedIndex() {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.alternative.me/fng/');
        const result = await response.json();
        if (result.data && result.data[0]) {
          setData({
            value: parseInt(result.data[0].value),
            classification: result.data[0].value_classification,
            timestamp: result.data[0].timestamp
          });
        }
      } catch (error) {
        console.error('Failed to fetch Fear & Greed Index:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const getColor = (value: number) => {
    if (value >= 80) return 'text-green-600 dark:text-green-400';
    if (value >= 60) return 'text-green-500 dark:text-green-300';
    if (value >= 40) return 'text-yellow-500 dark:text-yellow-400';
    if (value >= 20) return 'text-orange-500 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getIcon = (value: number) => {
    if (value >= 50) {
      return <TrendingUp className="w-5 h-5" />;
    }
    return <TrendingDown className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-16"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Fear & Greed Index
        </h3>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`text-3xl font-bold ${getColor(data.value)}`}>
          {data.value}
        </span>
        <span className={`flex items-center gap-1 text-sm font-medium ${getColor(data.value)}`}>
          {getIcon(data.value)}
          {data.classification}
        </span>
      </div>
    </div>
  );
}