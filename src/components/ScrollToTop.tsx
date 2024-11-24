import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  show: boolean;
}

export function ScrollToTop({ show }: ScrollToTopProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}