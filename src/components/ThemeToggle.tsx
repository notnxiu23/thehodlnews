import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, TrendingUp, TrendingDown, Palette, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const themes = [
  { id: 'light', label: 'Light Theme', icon: Sun, mode: 'light', theme: 'default' },
  { id: 'dark', label: 'Dark Theme', icon: Moon, mode: 'dark', theme: 'default' },
  { id: 'bull', label: 'Bull Market Theme', icon: TrendingUp, mode: 'light', theme: 'bull' },
  { id: 'bear', label: 'Bear Market Theme', icon: TrendingDown, mode: 'light', theme: 'bear' },
  { id: 'dark-bull', label: 'Dark Bull Theme', icon: TrendingUp, mode: 'dark', theme: 'bull' },
  { id: 'dark-bear', label: 'Dark Bear Theme', icon: TrendingDown, mode: 'dark', theme: 'bear' },
];

export function ThemeToggle() {
  const { mode, theme, setMode, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentThemeLabel = () => {
    const currentTheme = themes.find(t => t.mode === mode && t.theme === theme);
    return currentTheme?.label || 'Change Theme';
  };

  const handleThemeChange = (newMode: 'light' | 'dark', newTheme: 'default' | 'bull' | 'bear') => {
    setMode(newMode);
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden sm:inline">{getCurrentThemeLabel()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-dark-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {themes.map((item) => {
              const Icon = item.icon;
              const isActive = mode === item.mode && theme === item.theme;
              return (
                <button
                  key={item.id}
                  onClick={() => handleThemeChange(item.mode, item.theme)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}