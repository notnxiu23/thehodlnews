import { useState } from 'react';
import { Twitter, X } from 'lucide-react';

export function TwitterFeed() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
        title="Crypto Twitter Feed"
      >
        <Twitter className="w-4 h-4" />
        <span className="hidden sm:inline">Crypto Feed</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
            <div className="p-4 border-b dark:border-dark-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Cryptocurrency Twitter Feed
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <a
                className="twitter-timeline"
                href="https://twitter.com/hashtag/cryptocurrency"
                data-theme="dark"
                data-chrome="noheader nofooter noborders transparent"
              >
                #Cryptocurrency Tweets
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}