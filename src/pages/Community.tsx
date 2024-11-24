import { BackButton } from '../components/BackButton';
import { SimpleChat } from '../components/SimpleChat';

export function Community() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Community Chat</h1>
      <SimpleChat />
    </div>
  );
}