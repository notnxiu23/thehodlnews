import { useState } from 'react';
import { Info } from 'lucide-react';

export function TaxCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [holdingPeriod, setHoldingPeriod] = useState('short'); // short or long
  const [taxBracket, setTaxBracket] = useState('10');

  const calculateTax = () => {
    const purchase = parseFloat(purchasePrice) || 0;
    const sale = parseFloat(salePrice) || 0;
    const profit = sale - purchase;
    const taxRate = parseFloat(taxBracket) / 100;
    const taxAmount = profit * taxRate;

    return {
      profit,
      taxAmount,
      netProfit: profit - taxAmount
    };
  };

  const { profit, taxAmount, netProfit } = calculateTax();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Crypto Tax Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your potential tax liability on cryptocurrency trades.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Purchase Price (USD)
          </label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sale Price (USD)
          </label>
          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Holding Period
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="short"
                checked={holdingPeriod === 'short'}
                onChange={(e) => setHoldingPeriod(e.target.value)}
                className="mr-2"
              />
              Short Term (&lt; 1 year)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="long"
                checked={holdingPeriod === 'long'}
                onChange={(e) => setHoldingPeriod(e.target.value)}
                className="mr-2"
              />
              Long Term (&gt; 1 year)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tax Bracket
          </label>
          <select
            value={taxBracket}
            onChange={(e) => setTaxBracket(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="10">10%</option>
            <option value="12">12%</option>
            <option value="22">22%</option>
            <option value="24">24%</option>
            <option value="32">32%</option>
            <option value="35">35%</option>
            <option value="37">37%</option>
          </select>
        </div>

        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total Profit:</span>
            <span className={`font-medium ${profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${profit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Tax Amount:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t dark:border-dark-600">
            <span className="text-gray-900 dark:text-white font-medium">Net Profit:</span>
            <span className={`font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${netProfit.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p>
            This calculator provides estimates only and should not be considered as financial or tax advice. Please consult with a qualified tax professional for accurate calculations based on your specific situation and local tax laws.
          </p>
        </div>
      </div>
    </div>
  );
}