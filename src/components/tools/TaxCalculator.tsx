import { useState } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  date: string;
}

export function TaxCalculator() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'buy',
    symbol: '',
    amount: '',
    price: '',
    date: ''
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.symbol || !newTransaction.amount || !newTransaction.price || !newTransaction.date) {
      toast.error('Please fill in all fields');
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'buy' | 'sell',
      symbol: newTransaction.symbol.toUpperCase(),
      amount: parseFloat(newTransaction.amount),
      price: parseFloat(newTransaction.price),
      date: newTransaction.date
    };

    setTransactions(prev => [...prev, transaction]);
    setNewTransaction({
      type: 'buy',
      symbol: '',
      amount: '',
      price: '',
      date: ''
    });
    toast.success('Transaction added successfully');
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction removed');
  };

  const calculateTaxableGains = () => {
    const gainsBySymbol: { [key: string]: number } = {};
    
    transactions.forEach(transaction => {
      const value = transaction.amount * transaction.price;
      if (!gainsBySymbol[transaction.symbol]) {
        gainsBySymbol[transaction.symbol] = 0;
      }
      
      if (transaction.type === 'sell') {
        gainsBySymbol[transaction.symbol] += value;
      } else {
        gainsBySymbol[transaction.symbol] -= value;
      }
    });

    return Object.entries(gainsBySymbol).reduce((total, [_, gain]) => total + (gain > 0 ? gain : 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Estimated Tax Liability
          </h3>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          ${calculateTaxableGains().toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          *This is a simplified calculation. Please consult a tax professional for accurate tax advice.
        </p>
      </div>

      <form onSubmit={handleAddTransaction} className="flex flex-wrap gap-4">
        <select
          value={newTransaction.type}
          onChange={e => setNewTransaction(prev => ({ ...prev, type: e.target.value }))}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <input
          type="text"
          value={newTransaction.symbol}
          onChange={e => setNewTransaction(prev => ({ ...prev, symbol: e.target.value }))}
          placeholder="Symbol (e.g., BTC)"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="number"
          value={newTransaction.amount}
          onChange={e => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Amount"
          step="any"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="number"
          value={newTransaction.price}
          onChange={e => setNewTransaction(prev => ({ ...prev, price: e.target.value }))}
          placeholder="Price ($)"
          step="any"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="date"
          value={newTransaction.date}
          onChange={e => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b dark:border-dark-700">
              <th className="pb-3 text-gray-500 dark:text-gray-400">Type</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Asset</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Amount</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Price</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Total</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Date</th>
              <th className="pb-3 text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} className="border-b dark:border-dark-700">
                <td className="py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === 'buy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {transaction.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 font-medium text-gray-900 dark:text-white">
                  {transaction.symbol}
                </td>
                <td className="py-4 text-gray-700 dark:text-gray-300">
                  {transaction.amount}
                </td>
                <td className="py-4 text-gray-700 dark:text-gray-300">
                  ${transaction.price.toLocaleString()}
                </td>
                <td className="py-4 text-gray-700 dark:text-gray-300">
                  ${(transaction.amount * transaction.price).toLocaleString()}
                </td>
                <td className="py-4 text-gray-700 dark:text-gray-300">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <button
                    onClick={() => handleRemoveTransaction(transaction.id)}
                    className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}