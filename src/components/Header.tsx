import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { useState } from 'react';
import { AuthModal } from './AuthModal';

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/analysis", label: "Analysis" },
    { to: "/memes", label: "Memes" },
    { to: "/glossary", label: "Glossary" },
  ];

  return (
    <header className="bg-indigo-600 text-white">
      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              The HODL News
            </h1>
          </Link>

          {/* Primary Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu onOpenAuth={() => setShowAuthModal(true)} />
          </div>
        </div>
      </nav>

      {/* Secondary Navigation - Mobile Only */}
      <div className="md:hidden border-t border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-3">
            <div className="flex items-center justify-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-white hover:text-indigo-100 transition-colors"
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