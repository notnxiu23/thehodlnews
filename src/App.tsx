import { Routes, Route } from 'react-router-dom';
import { LoadingAnimation } from './components/LoadingAnimation';
import { HomePage } from './pages/HomePage';
import { CryptoAnalysis } from './pages/CryptoAnalysis';
import { CryptoMemes } from './pages/CryptoMemes';
import { Glossary } from './pages/Glossary';
import { Tools } from './pages/Tools';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CookiePolicy } from './pages/CookiePolicy';
import { Contact } from './pages/Contact';
import { ArticlePage } from './pages/ArticlePage';
import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <LoadingAnimation size="lg" text="Loading The HODL News..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analysis" element={<CryptoAnalysis />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/memes" element={<CryptoMemes />} />
      <Route path="/glossary" element={<Glossary />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/article" element={<ArticlePage />} />
    </Routes>
  );
}

export default App;