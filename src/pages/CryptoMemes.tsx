import { useState, useEffect } from 'react';
import { Laugh, ExternalLink, ArrowLeftCircle, ArrowRightCircle, RefreshCw, Loader } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { LoadingAnimation } from '../components/LoadingAnimation';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface RedditMeme {
  id: string;
  title: string;
  url: string;
  permalink: string;
  author: string;
  score: number;
  created: number;
}

export function CryptoMemes() {
  const [memes, setMemes] = useState<RedditMeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMemes = async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const subreddits = ['cryptocurrencymemes', 'bitcoinmemes', 'dogecoin'];
      const responses = await Promise.all(
        subreddits.map(subreddit =>
          axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5`)
        )
      );

      const allMemes = responses.flatMap(response =>
        response.data.data.children
          .filter((post: any) => {
            const url = post.data.url;
            return url.match(/\.(jpg|jpeg|png|gif)$/i);
          })
          .map((post: any) => ({
            id: post.data.id,
            title: post.data.title,
            url: post.data.url,
            permalink: `https://reddit.com${post.data.permalink}`,
            author: post.data.author,
            score: post.data.score,
            created: post.data.created_utc * 1000
          }))
      );

      const sortedMemes = allMemes
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setMemes(sortedMemes);
      setError(null);
      setLastRefresh(new Date());
      if (showToast) {
        toast.success('Memes refreshed successfully!');
      }
    } catch (err) {
      setError('Failed to load memes');
      console.error('Error fetching memes:', err);
      if (showToast) {
        toast.error('Failed to refresh memes');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMemes();
    const interval = setInterval(() => fetchMemes(true), 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const nextMeme = () => {
    setCurrentIndex((prev) => (prev + 1) % memes.length);
  };

  const previousMeme = () => {
    setCurrentIndex((prev) => (prev - 1 + memes.length) % memes.length);
  };

  const handleManualRefresh = () => {
    fetchMemes(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackButton />
      
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <Laugh className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Crypto Memes
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
            Last updated: {formatDistanceToNow(lastRefresh)} ago
          </span>
          <button
            onClick={handleManualRefresh}
            disabled={loading || isRefreshing}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {loading && memes.length === 0 ? (
        <div className="flex items-center justify-center h-[50vh] sm:h-[600px]">
          <LoadingAnimation size="lg" text="Loading memes..." />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[50vh] sm:h-[600px] text-gray-500 dark:text-gray-400">
          <Laugh className="w-12 h-12 mb-4" />
          <p>{error}</p>
        </div>
      ) : memes.length > 0 ? (
        <div className="market-card rounded-xl shadow-sm p-4 sm:p-6">
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg mb-4">
              <img
                src={memes[currentIndex].url}
                alt={memes[currentIndex].title}
                className="w-full h-full object-contain bg-gray-100 dark:bg-dark-700"
              />
            </div>

            <button
              onClick={previousMeme}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ArrowLeftCircle className="w-6 h-6" />
            </button>

            <button
              onClick={nextMeme}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ArrowRightCircle className="w-6 h-6" />
            </button>
          </div>

          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            {memes[currentIndex].title}
          </h4>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Posted by u/{memes[currentIndex].author}</span>
            <div className="flex items-center gap-4">
              <span>{formatDistanceToNow(memes[currentIndex].created)} ago</span>
              <a
                href={memes[currentIndex].permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {memes.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-indigo-600 dark:bg-indigo-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] sm:h-[600px] text-gray-500 dark:text-gray-400">
          <Laugh className="w-12 h-12 mb-4" />
          <p>No memes available</p>
        </div>
      )}
    </div>
  );
}