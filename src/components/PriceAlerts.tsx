import { useState } from 'react';
import { Bell, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import type { PriceAlert, CryptoPrice } from '../types';

interface PriceAlertsProps {
  prices: CryptoPrice[];
  alerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onRemoveAlert: (id: string) => void;
}

export function PriceAlerts({ prices = [], alerts = [], onAddAlert, onRemoveAlert }: PriceAlertsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    symbol: prices[0]?.symbol || 'BTC',
    type: 'above' as const,
    price: prices[0]?.price || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert(newAlert);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Bell className="w-4 h-4" />
        Price Alerts ({alerts.length})
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-96 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Price Alerts</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <select
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {prices.map((crypto) => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.symbol}
                  </option>
                ))}
              </select>

              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as 'above' | 'below' })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>

              <input
                type="number"
                value={newAlert.price}
                onChange={(e) => setNewAlert({ ...newAlert, price: parseFloat(e.target.value) })}
                step="0.01"
                min="0"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4" />
              Add Alert
            </button>
          </form>

          <div className="space-y-3">
            {alerts.map((alert) => {
              const currentPrice = prices.find((p) => p.symbol === alert.symbol)?.price || 0;
              const isTriggered = alert.type === 'above' 
                ? currentPrice >= alert.price 
                : currentPrice <= alert.price;

              return (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isTriggered ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{alert.symbol}</span>
                      {alert.type === 'above' ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-gray-900">${alert.price.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Current: ${currentPrice.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })}

            {alerts.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No price alerts set
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}