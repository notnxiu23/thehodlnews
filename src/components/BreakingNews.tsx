import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { fetchNews } from '../services/api';
import { LoadingAnimation } from './LoadingAnimation';
import type { NewsArticle } from '../types';

export function BreakingNews() {
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBreakingNews = async () => {
    try {
      setLoading(true);
      const news = await fetchNews('all');
      // Filter for breaking/important news based on criteria
      const important = news.filter(article => 
        article.title.toLowerCase().includes('breaking') ||
        article.title.toLowerCase().includes('urgent') ||
        article.sentiment > 0.5 || 
        article.sentiment < -0.5
      ).slice(0, 5);
      
      setBreakingNews(important);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch breaking news:', err);
      setError('Failed to load breaking news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBreakingNews();
    // Refresh breaking news every 5 minutes instead of every minute
    const interval = setInterval(loadBreakingNews, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (breakingNews.length > 0) {
      // Rotate through breaking news every 8 seconds instead of 5
      const rotationInterval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % breakingNews.length);
      }, 8000);
      return () => clearInterval(rotationInterval);
    }
  }, [breakingNews.length]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <LoadingAnimation size="sm" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (breakingNews.length === 0) {
    return null;
  }

  const currentNews = breakingNews[currentIndex];

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-2 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2 shrink-0">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <span className="font-bold uppercase text-sm">Breaking News</span>
          </div>
          <div className="flex-1 min-w-0 px-4">
            <a 
              href={currentNews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline block truncate"
            >
              {currentNews.title}
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs text-white/80">
            <span>{currentNews.source.name}</span>
            <span>•</span>
            <time dateTime={new Date(currentNews.publishedAt).toISOString()}>
              {new Date(currentNews.publishedAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full">
        <div 
          className="h-full bg-white/40 animate-[progress_8s_linear_infinite]"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}