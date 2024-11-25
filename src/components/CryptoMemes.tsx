import { useState, useEffect } from 'react';
import { Laugh, ExternalLink, ArrowLeftCircle, ArrowRightCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

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

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
        setError('Failed to load memes');
        console.error('Error fetching memes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
    const interval = setInterval(fetchMemes, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const nextMeme = () => {
    setCurrentIndex((prev) => (prev + 1) % memes.length);
  };

  const previousMeme = () => {
    setCurrentIndex((prev) => (prev - 1 + memes.length) % memes.length);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-[400px]">
          <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (error || memes.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
          <Laugh className="w-12 h-12 mb-4" />
          <p>{error || 'No memes available'}</p>
        </div>
      </div>
    );
  }

  const currentMeme = memes[currentIndex];

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Laugh className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Crypto Memes
          </h3>
        </div>
        <a
          href={currentMeme.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-lg mb-4">
          <img
            src={currentMeme.url}
            alt={currentMeme.title}
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
        {currentMeme.title}
      </h4>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Posted by u/{currentMeme.author}</span>
        <span>{formatDistanceToNow(currentMeme.created)} ago</span>
      </div>

      <div className="mt-4 flex justify-center">
        {memes.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full mx-1 transition-colors ${
              index === currentIndex
                ? 'bg-indigo-600 dark:bg-indigo-400'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}