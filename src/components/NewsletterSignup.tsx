import { useState } from 'react';
import { Mail, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-600 dark:bg-indigo-900 rounded-xl shadow-lg p-8 my-12">
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="w-12 h-12 text-white mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Stay Updated!
        </h2>
        <p className="text-indigo-100 mb-6">
          Get the latest crypto news and market updates delivered directly to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-white dark:bg-dark-700 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}