import { useEffect, useState, memo } from 'react';
import { TrendingUp, Zap, AlertCircle, RefreshCw, TrendingDown, Minus } from 'lucide-react';
import { fetchTrendingTopics } from '../services/api';
import type { TrendingTopic } from '../types';

function SentimentBadge({ sentiment }: { sentiment: number }) {
  let color = 'bg-gray-100 text-gray-600';
  let Icon = Minus;

  if (sentiment > 0.2) {
    color = 'bg-green-100 text-green-600';
    Icon = TrendingUp;
  } else if (sentiment < -0.2) {
    color = 'bg-red-100 text-red-600';
    Icon = TrendingDown;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {sentiment > 0.2 ? 'Bullish' : sentiment < -0.2 ? 'Bearish' : 'Neutral'}
    </span>
  );
}

function TrendingTopicsComponent() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrendingTopics();
      setTopics(data);
    } catch (err) {
      setError('Unable to load trending topics');
      console.error('Failed to fetch trending topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
    const interval = setInterval(loadTopics, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={loadTopics}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!topics.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
        </div>
        <p className="text-gray-600 text-center">No trending topics available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
      </div>
      <div className="space-y-3">
        {topics.map((topic) => (
          <div
            key={topic.topic}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="space-y-1">
              <span className="font-medium text-gray-900 capitalize block">
                {topic.topic}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {topic.volume} mentions
                </span>
                <SentimentBadge sentiment={topic.sentiment} />
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium
              ${topic.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              <TrendingUp className="w-4 h-4" />
              {Math.abs(topic.change24h).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(TrendingTopicsComponent);