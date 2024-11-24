import { Bitcoin, Cpu, Database, Wallet, Coins, Pickaxe, Image, Scale, LineChart, ShieldAlert, Blocks, Building2, Laugh, Gift, Rocket, Briefcase, Gamepad2, Globe, Users, Network, Star } from 'lucide-react';
import type { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  favoriteCategories: Category[];
  onToggleFavorite: (category: Category) => void;
}

const categories: { id: Category; label: string; icon: JSX.Element }[] = [
  { id: 'all', label: 'All News', icon: <Database className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'market', label: 'Market Insights', icon: <LineChart className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'bitcoin', label: 'Bitcoin', icon: <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'ethereum', label: 'Ethereum', icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'altcoins', label: 'Altcoins', icon: <Coins className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'memecoins', label: 'Meme Coins', icon: <Laugh className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'blockchain', label: 'Blockchain', icon: <Blocks className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'web3', label: 'Web3 & DAOs', icon: <Network className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'exchange', label: 'Exchanges', icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'gaming', label: 'Gaming & P2E', icon: <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'metaverse', label: 'Metaverse', icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'mining', label: 'Mining', icon: <Pickaxe className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'defi', label: 'DeFi', icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'nft', label: 'NFTs', icon: <Image className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'ico', label: 'ICO/IDO', icon: <Rocket className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'institutional', label: 'Institutional', icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'community', label: 'Community & Events', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'airdrops', label: 'Airdrops', icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'regulation', label: 'Regulations', icon: <Scale className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'security', label: 'Security & Scams', icon: <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" /> },
];

export function CategoryFilter({ selectedCategory, onCategoryChange, favoriteCategories, onToggleFavorite }: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      {favoriteCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Favorite Categories</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories
              .filter((cat) => favoriteCategories.includes(cat.id))
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`
                    inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-sm transition-colors
                    ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }
                  `}
                >
                  {category.icon}
                  <span className="truncate">{category.label}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">All Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div key={category.id} className="relative group">
              <button
                onClick={() => onCategoryChange(category.id)}
                className={`
                  inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-sm transition-colors
                  ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }
                `}
              >
                {category.icon}
                <span className="truncate">{category.label}</span>
              </button>
              <button
                onClick={() => onToggleFavorite(category.id)}
                className={`
                  absolute -right-1 -top-1 p-1 rounded-full shadow-sm
                  ${
                    favoriteCategories.includes(category.id)
                      ? 'bg-yellow-400 text-yellow-900'
                      : 'bg-white dark:bg-dark-800 text-gray-400 opacity-0 group-hover:opacity-100'
                  }
                  transition-opacity
                `}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4" fill={favoriteCategories.includes(category.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}