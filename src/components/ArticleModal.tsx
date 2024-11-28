import { X } from 'lucide-react';
import type { NewsArticle } from '../types';

interface ArticleModalProps {
  article: NewsArticle;
  isOpen: boolean;
  onClose: () => void;
}

export function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b dark:border-dark-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
            {article.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {article.urlToImage && (
          <div className="relative aspect-video">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose dark:prose-invert max-w-none">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{article.source.name}</span>
              <span>•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>

            <p className="text-gray-900 dark:text-white whitespace-pre-line">
              {article.description}
            </p>

            <div className="mt-6">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Read full article on {article.source.name} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}