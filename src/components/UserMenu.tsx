import { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/NetlifyAuthContext';

interface UserMenuProps {
  onOpenAuth: () => void;
}

export function UserMenu({ onOpenAuth }: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="relative">
      {!user ? (
        <button
          onClick={onOpenAuth}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Login</span>
        </button>
      ) : (
        <>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user.user_metadata?.full_name || user.email}
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}