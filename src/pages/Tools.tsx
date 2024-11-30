import { useState } from 'react';
import { Calculator, Wallet, Fuel } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { PortfolioTracker } from '../components/tools/PortfolioTracker';
import { TaxCalculator } from '../components/tools/TaxCalculator';
import { GasFeeTracker } from '../components/tools/GasFeeTracker';

export function Tools() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'tax' | 'gas'>('portfolio');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Crypto Tools
      </h1>

      {/* Tool Navigation */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'portfolio'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <Wallet className="w-5 h-5" />
          Portfolio Tracker
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tax'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <Calculator className="w-5 h-5" />
          Tax Calculator
        </button>
        <button
          onClick={() => setActiveTab('gas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'gas'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <Fuel className="w-5 h-5" />
          Gas Tracker
        </button>
      </div>

      {/* Tool Content */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
        {activeTab === 'portfolio' && <PortfolioTracker />}
        {activeTab === 'tax' && <TaxCalculator />}
        {activeTab === 'gas' && <GasFeeTracker />}
      </div>
    </div>
  );
}