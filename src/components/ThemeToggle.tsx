import { useState } from 'react';
import { Sun, Moon, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { mode, theme, setMode, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light', label: 'Light Theme', icon: Sun, mode: 'light', theme: 'default' },
    { id: 'dark', label: 'Dark Theme', icon: Moon, mode: 'dark', theme: 'default' },
    { id: 'bull', label: 'Bull Market', icon: TrendingUp, mode: 'light', theme: 'bull' },
    { id: 'bear', label: 'Bear Market', icon: TrendingDown, mode: 'light', theme: 'bear' },
    { id: 'dark-bull', label: 'Dark Bull', icon: TrendingUp, mode: 'dark', theme: 'bull' },
    { id: 'dark-bear', label: 'Dark Bear', icon: TrendingDown, mode: 'dark', theme: 'bear' }
  ];

  const getCurrentIcon = () => {
    if (theme === 'bull') return TrendingUp;
    if (theme === 'bear') return TrendingDown;
    return mode === 'dark' ? Moon : Sun;
  };

  const Icon = getCurrentIcon();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Toggle theme"
      >
        <Icon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
          {themes.map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.mode && theme === item.theme;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.mode);
                  setTheme(item.theme);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}