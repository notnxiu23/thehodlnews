import { Link } from 'react-router-dom';
import { LineChart, Laugh, Book, User, Calculator } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { useState } from 'react';
import { AuthModal } from './AuthModal';

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="bg-white dark:bg-dark-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
              The HODL News
            </h1>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/analysis"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600"
            >
              <LineChart className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Crypto Analysis</span>
            </Link>
            <Link
              to="/tools"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600"
            >
              <Calculator className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Tools</span>
            </Link>
            <Link
              to="/memes"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600"
            >
              <Laugh className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Memes</span>
            </Link>
            <Link
              to="/glossary"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600"
            >
              <Book className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Glossary</span>
            </Link>
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <ThemeToggle />
              <UserMenu onOpenAuth={() => setShowAuthModal(true)} />
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}