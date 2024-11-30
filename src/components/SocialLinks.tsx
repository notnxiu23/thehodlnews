import { Instagram } from 'lucide-react';

export function SocialLinks() {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/thehodlnews/',
      icon: Instagram
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@thehodlnewsofficial',
      // Custom TikTok SVG icon since Lucide doesn't have one
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center justify-center space-x-6">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          aria-label={`Follow us on ${social.name}`}
        >
          <social.icon className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
}