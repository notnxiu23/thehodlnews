import { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import { generateArticleSummary } from '../services/summarizer';

interface ArticleSummarizerProps {
  text: string;
}

export function ArticleSummarizer({ text }: ArticleSummarizerProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerateSummary = () => {
    setLoading(true);
    try {
      const generatedSummary = generateArticleSummary(text);
      setSummary(generatedSummary);
      setIsOpen(true);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGenerateSummary}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Summarizing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Quick Summary
          </>
        )}
      </button>

      {isOpen && summary && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Key Points</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}