import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Tag as TagIcon, X, Bookmark, LineChart, MessageCircle } from 'lucide-react';
import { CategoryFilter } from './components/CategoryFilter';
import { DateFilter, type DateRange } from './components/DateFilter';
import { NewsCard } from './components/NewsCard';
import { ErrorMessage } from './components/ErrorMessage';
import { PriceOverview } from './components/PriceOverview';
import { SearchBar } from './components/SearchBar';
import { FavoritesList } from './components/FavoritesList';
import { AuthModal } from './components/AuthModal';
import { UserMenu } from './components/UserMenu';
import { ThemeToggle } from './components/ThemeToggle';
import { NewsCarousel } from './components/NewsCarousel';
import { FeedbackForm } from './components/NewsletterSignup';
import { ScrollToTop } from './components/ScrollToTop';
import { Footer } from './components/Footer';
import { CryptoAnalysis } from './pages/CryptoAnalysis';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CookiePolicy } from './pages/CookiePolicy';
import { Contact } from './pages/Contact';
import { CryptoCalculator } from './components/CryptoCalculator';
import { fetchNews, fetchCryptoPrices } from './services/api';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthProvider } from './contexts/AuthContext';
import type { Category, NewsArticle, ErrorState, UserPreferences, CryptoPrice } from './types';

function HomePage() {
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

  const handleToggleFavorite = useCallback((category: Category) => {
    setPreferences(prev => ({
      ...prev,
      favoriteCategories: prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter(c => c !== category)
        : [...prev.favoriteCategories, category]
    }));
  }, [setPreferences]);

  return (
    <>
      <header className="bg-white dark:bg-dark-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                The HODL News
              </h1>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/analysis"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600"
              >
                <LineChart className="w-4 h-4" />
                <span className="hidden sm:inline">Analysis</span>
              </Link>
              <button
                onClick={() => setShowFavorites(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Favorites</span>
              </button>
              <ThemeToggle />
              <UserMenu onOpenAuth={() => setShowAuthModal(true)} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <PriceOverview />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
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
              {selectedTag && (
                <div className="flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Filtered by tag:</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                    {selectedTag}
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                </div>
              )}
            </div>
            <CategoryFilter
              selectedCategory={category}
              onCategoryChange={setCategory}
              favoriteCategories={preferences.favoriteCategories}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
          <div className="lg:col-span-1">
            <CryptoCalculator prices={prices} />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-4 animate-pulse"
              >
                <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2" />
              </div>
            ))}
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

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<CryptoAnalysis />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AuthProvider>
  );
}