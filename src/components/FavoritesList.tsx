import { useState, useEffect } from 'react';
import { X, Bookmark } from 'lucide-react';
import { NewsCard } from './NewsCard';
import type { NewsArticle } from '../types';

interface FavoritesListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesList({ isOpen, onClose }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load favorites from localStorage
  const loadFavorites = () => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  };

  // Load favorites initially and when localStorage changes
  useEffect(() => {
    loadFavorites();
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  if (!isOpen) return null;

  const filteredFavorites = favorites.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Favorite Articles ({favorites.length})
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search favorites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-6 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No matching favorites found' : 'No favorite articles yet'}
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFavorites.map((article, index) => (
                <NewsCard
                  key={`${article.url}-${index}`}
                  article={article}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}