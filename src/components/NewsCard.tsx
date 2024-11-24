import { ExternalLink, TrendingUp, TrendingDown, Minus, Tag, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import toast from 'react-hot-toast';
import type { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onTagClick?: (tag: string) => void;
}

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
  return (
    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
      <Minus className="w-4 h-4" />
      <span className="text-sm font-medium">Neutral</span>
    </div>
  );
}

const fallbackImage = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800';

export function NewsCard({ article, onTagClick }: NewsCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

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

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] flex flex-col">
      <div className="aspect-video w-full relative overflow-hidden bg-gray-100 dark:bg-dark-700">
        <img
          src={article.urlToImage || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full shadow-lg transition-colors ${
            isFavorite(article)
              ? 'bg-red-500 text-white'
              : 'bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
          }`}
        >
          <Heart
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill={isFavorite(article) ? 'currentColor' : 'none'}
          />
        </button>
      </div>
      
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate">
            {article.source.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0 ml-2">
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm sm:text-base">
          {article.description}
        </p>
        
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm sm:text-base"
          >
            Read More <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <SentimentIndicator sentiment={article.sentiment} />
        </div>
      </div>
    </div>
  );
}