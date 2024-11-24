import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { NewsArticle } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<NewsArticle[]>('favorites', []);
  const [loading, setLoading] = useState(false);

  const addToFavorites = useCallback((article: NewsArticle) => {
    setLoading(true);
    try {
      setFavorites(prev => {
        const exists = prev.some(fav => fav.url === article.url);
        if (!exists) {
          return [...prev, article];
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  }, [setFavorites]);

  const removeFromFavorites = useCallback((article: NewsArticle) => {
    setLoading(true);
    try {
      setFavorites(prev => prev.filter(fav => fav.url !== article.url));
    } finally {
      setLoading(false);
    }
  }, [setFavorites]);

  const isFavorite = useCallback((article: NewsArticle): boolean => {
    return favorites.some(fav => fav.url === article.url);
  }, [favorites]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
}