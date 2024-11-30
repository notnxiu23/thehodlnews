import { Link } from 'react-router-dom';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-800 border-t dark:border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-gray-200">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-gray-900 dark:hover:text-gray-200">
              Cookie Policy
            </Link>
            <Link to="/contact" className="hover:text-gray-900 dark:hover:text-gray-200">
              Contact Us
            </Link>
          </div>
          
          <SocialLinks />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} The HODL News. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}