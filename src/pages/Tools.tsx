import { useState } from 'react';
import { BackButton } from '../components/BackButton';
import { CryptoCalculator } from '../components/CryptoCalculator';
import { TaxCalculator } from '../components/TaxCalculator';
import { PortfolioTracker } from '../components/PortfolioTracker';
import { Calculator, DollarSign, Wallet } from 'lucide-react';

export function Tools() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'tax' | 'portfolio'>('calculator');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Crypto Tools
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'calculator'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <Calculator className="w-5 h-5" />
          Crypto Calculator
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tax'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          Tax Calculator
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'portfolio'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <Wallet className="w-5 h-5" />
          Portfolio Tracker
        </button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
        {activeTab === 'calculator' && <CryptoCalculator />}
        {activeTab === 'tax' && <TaxCalculator />}
        {activeTab === 'portfolio' && <PortfolioTracker />}
      </div>
    </div>
  );
}