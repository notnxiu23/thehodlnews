import { Twitter, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
  url: string;
  title: string;
  source: string;
}

export function ShareButtons({ url, title, source }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareText = `${title}\n\nShared by The HODL News`;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <button
        onClick={handleCopyLink}
        className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
        title="Copy link"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}