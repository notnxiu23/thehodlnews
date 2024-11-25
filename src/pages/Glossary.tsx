import { useState, useMemo } from 'react';
import { BackButton } from '../components/BackButton';
import { Search, Book, ArrowRight } from 'lucide-react';
import { cryptoGlossary } from '../data/glossaryData';

interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  seeAlso?: string[];
}

const categories = [
  { id: 'basicConcepts', label: 'Basic Concepts' },
  { id: 'tradingAndInvesting', label: 'Trading And Investing' },
  { id: 'blockchainAndTechnical', label: 'Blockchain And Technical' },
  { id: 'defi', label: 'DeFi' },
  { id: 'securityAndPrivacy', label: 'Security And Privacy' },
  { id: 'nftAndMetaverse', label: 'NFT And Metaverse' },
  { id: 'miscellaneous', label: 'Miscellaneous' },
  { id: 'beginnerFriendly', label: 'Beginner Friendly' },
  { id: 'forFun', label: 'For Fun' }
];

export function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTerms = useMemo(() => {
    let terms: { category: string; terms: GlossaryTerm[] }[] = [];

    // If a category is selected, only show terms from that category
    if (selectedCategory !== 'all') {
      const categoryTerms = cryptoGlossary[selectedCategory as keyof typeof cryptoGlossary];
      if (categoryTerms) {
        terms = [{ 
          category: categories.find(c => c.id === selectedCategory)?.label || selectedCategory, 
          terms: categoryTerms 
        }];
      }
    } else {
      // Show all categories
      terms = categories.map(category => ({
        category: category.label,
        terms: cryptoGlossary[category.id as keyof typeof cryptoGlossary]
      }));
    }

    // Filter by search term if one exists
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return terms.map(category => ({
        ...category,
        terms: category.terms.filter(term =>
          term.term.toLowerCase().includes(search) ||
          term.definition.toLowerCase().includes(search) ||
          term.example?.toLowerCase().includes(search)
        )
      })).filter(category => category.terms.length > 0);
    }

    return terms;
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackButton />
      
      <div className="flex items-center gap-3 mb-8">
        <Book className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Crypto Glossary
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Terms
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Terms List */}
        <div className="lg:col-span-3">
          {filteredTerms.length === 0 ? (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No terms found matching your search.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredTerms.map((category) => (
                <div key={category.category}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {category.category}
                  </h2>
                  <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm divide-y dark:divide-dark-700">
                    {category.terms.map((term) => (
                      <div key={term.term} className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {term.term}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {term.definition}
                        </p>
                        {term.example && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Example:
                            </span>
                            <p className="mt-1 text-gray-600 dark:text-gray-300 italic">
                              {term.example}
                            </p>
                          </div>
                        )}
                        {term.seeAlso && term.seeAlso.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              See also:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {term.seeAlso.map((related) => (
                                <button
                                  key={related}
                                  onClick={() => setSearchTerm(related)}
                                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                  {related}
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}