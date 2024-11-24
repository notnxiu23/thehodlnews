import { Calendar } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export type DateRange = 'all' | '24h' | '7d' | '30d' | 'custom';

interface DateFilterProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  customStartDate: Date | null;
  customEndDate: Date | null;
  onCustomDateChange: (start: Date | null, end: Date | null) => void;
}

const ranges: { id: DateRange; label: string }[] = [
  { id: 'all', label: 'All Time' },
  { id: '24h', label: 'Last 24 Hours' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'custom', label: 'Custom Range' }
];

export function DateFilter({
  selectedRange,
  onRangeChange,
  customStartDate,
  customEndDate,
  onCustomDateChange
}: DateFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-600">Time Range:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {ranges.map((range) => (
          <button
            key={range.id}
            onClick={() => {
              onRangeChange(range.id);
              if (range.id !== 'custom') {
                let start = null;
                let end = null;
                
                switch (range.id) {
                  case '24h':
                    start = subDays(new Date(), 1);
                    break;
                  case '7d':
                    start = subDays(new Date(), 7);
                    break;
                  case '30d':
                    start = subDays(new Date(), 30);
                    break;
                }
                
                if (start) {
                  start = startOfDay(start);
                  end = endOfDay(new Date());
                }
                
                onCustomDateChange(start, end);
              }
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedRange === range.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {selectedRange === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStartDate ? format(customStartDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              onCustomDateChange(date ? startOfDay(date) : null, customEndDate);
            }}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={customEndDate ? format(customEndDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null;
              onCustomDateChange(customStartDate, date ? endOfDay(date) : null);
            }}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}
    </div>
  );
}