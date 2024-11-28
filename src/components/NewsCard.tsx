import { ExternalLink, TrendingUp, TrendingDown, Minus, Tag, Heart, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../contexts/ThemeContext';
import { ShareButtons } from './ShareButtons';
import toast from 'react-hot-toast';
import type { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onTagClick?: (tag: string) => void;
}

function SentimentIndicator({ sentiment }: { sentiment: number }) {
  const { theme } = useTheme();
  const positiveClass = theme === 'bull' 
    ? 'text-bull-600 dark:text-bull-400' 
    : theme === 'bear'
    ? 'text-bear-600 dark:text-bear-400'
    : 'text-green-600 dark:text-green-400';

  if (sentiment > 0.2) {
    return (
      <div className={`flex items-center gap-1 ${positiveClass}`}>
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
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { theme } = useTheme();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleReadMore = () => {
    navigate('/article', { state: { article } });
  };

  const accentClass = theme === 'bull' 
    ? 'text-bull-600 dark:text-bull-400' 
    : theme === 'bear'
    ? 'text-bear-600 dark:text-bear-400'
    : 'text-indigo-600 dark:text-indigo-400';

  const tagClass = theme === 'bull' 
    ? 'bg-bull-50 dark:bg-bull-900/20 text-bull-700 dark:text-bull-300 hover:bg-bull-100 dark:hover:bg-bull-900/30'
    : theme === 'bear'
    ? 'bg-bear-50 dark:bg-bear-900/20 text-bear-700 dark:text-bear-300 hover:bg-bear-100 dark:hover:bg-bear-900/30'
    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600';

  return (
    <div className="market-card market-glow rounded-xl overflow-hidden transition-transform hover:scale-[1.02] flex flex-col">
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
          <span className={`text-sm font-medium truncate ${accentClass}`}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm transition-colors ${tagClass}`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReadMore}
              className={`inline-flex items-center gap-2 font-medium text-sm sm:text-base hover:opacity-80 uppercase ${accentClass}`}
            >
              Read More <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <ShareButtons
              url={article.url}
              title={article.title}
              source={article.source.name}
            />
          </div>
          <SentimentIndicator sentiment={article.sentiment} />
        </div>
      </div>
    </div>
  );
}