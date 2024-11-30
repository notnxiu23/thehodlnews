import { useState, useEffect } from 'react';
import { Loader, Fuel, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchGasFees } from '../../services/gas';
import toast from 'react-hot-toast';

interface GasFee {
  network: string;
  baseFee: number;
  priorityFee: number;
  totalFee: number;
  timeEstimate: string;
}

export function GasFeeTracker() {
  const [fees, setFees] = useState<GasFee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGasFees = async () => {
      try {
        const data = await fetchGasFees();
        setFees(data);
      } catch (error) {
        console.error('Failed to fetch gas fees:', error);
        toast.error('Failed to fetch gas fees');
      } finally {
        setLoading(false);
      }
    };

    loadGasFees();
    const interval = setInterval(loadGasFees, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fees.map((fee) => (
          <div
            key={fee.network}
            className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {fee.network}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {fee.timeEstimate}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Base Fee
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {fee.baseFee} Gwei
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Priority Fee (Tip)
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {fee.priorityFee} Gwei
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Total Fee
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {fee.totalFee} Gwei
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Gas fees update automatically every 15 seconds
      </div>
    </div>
  );
}