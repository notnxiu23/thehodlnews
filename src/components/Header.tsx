import { Link } from 'react-router-dom';
import { Home, LineChart, Wrench, Laugh, Book } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';
import { AuthModal } from './AuthModal';

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/analysis", label: "Analysis", icon: LineChart },
    { to: "/tools", label: "Tools", icon: Wrench },
    { to: "/memes", label: "Memes", icon: Laugh },
    { to: "/glossary", label: "Glossary", icon: Book },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              The HODL News
            </h1>
          </Link>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.to} className="relative group">
                  <Link
                    to={item.to}
                    className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm py-1 px-3 rounded-lg shadow-lg whitespace-nowrap border border-gray-200 dark:border-dark-700">
                      {item.label}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu onOpenAuth={() => setShowAuthModal(true)} />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-indigo-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-3">
            <div className="flex items-center justify-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-white hover:text-indigo-100 transition-colors text-center"
                >
                  {item.label}
                </Link>
              ))}
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