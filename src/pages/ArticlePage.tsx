import { BackButton } from '../components/BackButton';
import { Tag, Heart, Clock, Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../contexts/ThemeContext';
import { ArticleSummarizer } from '../components/ArticleSummarizer';
import toast from 'react-hot-toast';
import type { NewsArticle } from '../types';

const fallbackImage = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800';

function SentimentIndicator({ sentiment }: { sentiment: number }) {
  if (sentiment > 0.2) {
    return (
      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium">Bullish</span>
      </div>
    );
  }
  if (sentiment < -0.2) {
    return (
      <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
        <TrendingDown className="w-4 h-4" />
        <span className="text-sm font-medium">Bearish</span>
      </div>
    );
  }
  return null;
}

export function ArticlePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { theme } = useTheme();
  const article = location.state?.article as NewsArticle;

  if (!article) {
    navigate('/');
    return null;
  }

  const handleToggleFavorite = () => {
    try {
      if (isFavorite(article)) {
        removeFromFavorites(article);
        toast.success('Removed from favorites');
      } else {
        addToFavorites(article);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const tagClass = theme === 'bull' 
    ? 'bg-bull-50 dark:bg-bull-900/20 text-bull-700 dark:text-bull-300'
    : theme === 'bear'
    ? 'bg-bear-50 dark:bg-bear-900/20 text-bear-700 dark:text-bear-300'
    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300';

  const publishDate = new Date(article.publishedAt);
  const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((publishDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden mt-6">
          <div className="relative">
            <img
              src={article.urlToImage || fallbackImage}
              alt={article.title}
              className="w-full aspect-video object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors ${
                isFavorite(article)
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:text-red-500'
              }`}
            >
              <Heart
                className="w-6 h-6"
                fill={isFavorite(article) ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {article.source.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <time dateTime={publishDate.toISOString()} title={publishDate.toLocaleString()}>
                  {timeAgo}
                </time>
              </div>
              <SentimentIndicator sentiment={article.sentiment} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {article.title}
            </h1>

            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-lg leading-relaxed">
                {article.description}
              </p>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${tagClass}`}
                  >
                    <Tag className="w-4 h-4" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t dark:border-dark-700 pt-6 space-y-6">
              <div className="flex flex-wrap gap-4">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium tracking-wide rounded-lg hover:bg-indigo-700 transition-colors uppercase"
                >
                  READ FULL ARTICLE ON {article.source.name}
                </a>
                <ArticleSummarizer text={article.description} />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}