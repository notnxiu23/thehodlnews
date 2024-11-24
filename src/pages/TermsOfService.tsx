import { BackButton } from '../components/BackButton';

export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Crypto News Hub, you agree to be bound by these Terms of Service.</p>

        <h2>2. Description of Service</h2>
        <p>Crypto News Hub provides cryptocurrency news aggregation, price tracking, and related services.</p>

        <h2>3. User Accounts</h2>
        <ul>
          <li>You must provide accurate information when creating an account</li>
          <li>You are responsible for maintaining account security</li>
          <li>We reserve the right to terminate accounts that violate these terms</li>
        </ul>

        <h2>4. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Interfere with service operation</li>
          <li>Attempt to gain unauthorized access</li>
          <li>Use the service for any illegal purpose</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>All content and materials available through our service are protected by intellectual property rights.</p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>The service is provided "as is" without any warranties, express or implied.</p>

        <h2>7. Limitation of Liability</h2>
        <p>We shall not be liable for any indirect, incidental, special, or consequential damages.</p>

        <h2>8. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes.</p>

        <h2>9. Contact Information</h2>
        <p>For questions about these Terms, contact us at:</p>
        <p>Email: legal@thehodlnews.com</p>
      </div>
    </div>
  );
}