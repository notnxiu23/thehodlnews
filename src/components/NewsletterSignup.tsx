import { useState } from 'react';
import { Star, Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeedbackForm() {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you for your feedback!');
      setRating(0);
      setFeedback('');
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-600 dark:bg-indigo-900 rounded-xl shadow-lg p-8 my-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          How are we doing?
        </h2>
        <p className="text-indigo-100 text-center mb-8">
          Your feedback helps us improve our service
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-white font-medium mb-2">Rate your experience</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-indigo-100 text-sm mt-2">
              {rating > 0 ? `You rated us ${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
            </span>
          </div>

          {/* Feedback Text */}
          <div>
            <label htmlFor="feedback" className="block text-white font-medium mb-2">
              Share your thoughts
            </label>
            <textarea
              id="feedback"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What can we improve?"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-white resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-dark-700 text-indigo-600 dark:text-white font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}