import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { CategoryFilter } from '../components/CategoryFilter';
import { DateFilter, type DateRange } from '../components/DateFilter';
import { NewsCard } from '../components/NewsCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { PriceOverview } from '../components/PriceOverview';
import { SearchBar } from '../components/SearchBar';
import { FavoritesList } from '../components/FavoritesList';
import { AuthModal } from '../components/AuthModal';
import { ScrollToTop } from '../components/ScrollToTop';
import { Footer } from '../components/Footer';
import { NewsCarousel } from '../components/NewsCarousel';
import { FeedbackForm } from '../components/NewsletterSignup';
import { CryptoCalculator } from '../components/CryptoCalculator';
import { fetchNews, fetchCryptoPrices } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Category, NewsArticle, ErrorState, UserPreferences, CryptoPrice } from '../types';

export function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [category, setCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('userPreferences', {
    favoriteCategories: [],
    priceAlerts: [],
  });

  const filterArticles = useCallback((
    articles: NewsArticle[],
    query: string,
    tag: string | null,
    range: DateRange,
    startDate: Date | null,
    endDate: Date | null
  ) => {
    let filtered = articles;

    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm)
      );
    }

    if (tag) {
      filtered = filtered.filter(article => 
        article.tags.includes(tag.toLowerCase())
      );
    }

    if (range !== 'all') {
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.publishedAt);
        
        if (range === 'custom' && startDate && endDate) {
          return articleDate >= startDate && articleDate <= endDate;
        }
        
        const now = new Date();
        let cutoff = now;
        
        switch (range) {
          case '24h':
            cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case '7d':
            cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        }
        
        return articleDate >= cutoff;
      });
    }

    return filtered;
  }, []);

  const handleSearch = useCallback(() => {
    setFilteredArticles(filterArticles(
      articles,
      searchQuery,
      selectedTag,
      dateRange,
      customStartDate,
      customEndDate
    ));
  }, [articles, searchQuery, selectedTag, dateRange, customStartDate, customEndDate, filterArticles]);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchNews(category);
      setArticles(data);
      setFilteredArticles(filterArticles(
        data,
        searchQuery,
        selectedTag,
        dateRange,
        customStartDate,
        customEndDate
      ));
    } catch (err) {
      const error = err as Error;
      setError({ 
        message: error.message,
        code: 'FETCH_ERROR'
      });
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery, selectedTag, dateRange, customStartDate, customEndDate, filterArticles]);

  const loadPrices = useCallback(async () => {
    try {
      const data = await fetchCryptoPrices();
      setPrices(data);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
  }, []);

  useEffect(() => {
    loadNews();
    loadPrices();
    const newsInterval = setInterval(loadNews, 300000); // 5 minutes
    const pricesInterval = setInterval(loadPrices, 30000); // 30 seconds

    return () => {
      clearInterval(newsInterval);
      clearInterval(pricesInterval);
    };
  }, [loadNews, loadPrices]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedTag, dateRange, customStartDate, customEndDate, handleSearch]);

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <PriceOverview />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 space-y-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
            />
            <DateFilter
              selectedRange={dateRange}
              onRangeChange={setDateRange}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDateChange={(start, end) => {
                setCustomStartDate(start);
                setCustomEndDate(end);
              }}
            />
            <CategoryFilter
              selectedCategory={category}
              onCategoryChange={setCategory}
              favoriteCategories={preferences.favoriteCategories}
              onToggleFavorite={(category) => {
                setPreferences(prev => ({
                  ...prev,
                  favoriteCategories: prev.favoriteCategories.includes(category)
                    ? prev.favoriteCategories.filter(c => c !== category)
                    : [...prev.favoriteCategories, category]
                }));
              }}
            />
          </div>
          <div className="lg:col-span-1">
            <CryptoCalculator prices={prices} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <ErrorMessage error={error} onRetry={loadNews} />
        ) : (
          <>
            {articles.length > 0 && (
              <div className="mb-8">
                <NewsCarousel articles={articles.slice(0, 5)} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <NewsCard
                  key={`${article.url}-${index}`}
                  article={article}
                  onTagClick={setSelectedTag}
                />
              ))}
            </div>
          </>
        )}

        <FeedbackForm />
      </main>

      <Footer />

      {showFavorites && (
        <FavoritesList
          isOpen={showFavorites}
          onClose={() => setShowFavorites(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <ScrollToTop show={showScrollTop} />
    </>
  );
}