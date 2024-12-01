import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Cookie Policy', to: '/cookies' },
    { label: 'Contact Us', to: '/contact' }
  ];

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
          className="w-6 h-6"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <Link to="/" className="text-2xl font-bold">
              The HODL News
            </Link>
            <p className="mt-2 text-indigo-100 text-sm">
              Your trusted source for cryptocurrency news and insights.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-indigo-100 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-100 hover:text-white transition-colors"
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-indigo-400/20 text-center">
          <p className="text-sm text-indigo-100">
            © {currentYear} The HODL News. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}