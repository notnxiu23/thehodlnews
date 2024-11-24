import { BackButton } from '../components/BackButton';

export function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Cookie Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. What Are Cookies</h2>
        <p>Cookies are small text files stored on your device when you visit our website.</p>

        <h2>2. How We Use Cookies</h2>
        <p>We use cookies for:</p>
        <ul>
          <li>Essential website functionality</li>
          <li>User authentication</li>
          <li>Remembering preferences</li>
          <li>Analytics and performance</li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <p>Required for basic website functionality:</p>
        <ul>
          <li>Authentication status</li>
          <li>Session management</li>
          <li>Security features</li>
        </ul>

        <h3>Preference Cookies</h3>
        <p>Remember your settings and preferences:</p>
        <ul>
          <li>Language preferences</li>
          <li>Theme settings</li>
          <li>Favorite categories</li>
        </ul>

        <h3>Analytics Cookies</h3>
        <p>Help us understand how visitors use our website:</p>
        <ul>
          <li>Page views</li>
          <li>Navigation patterns</li>
          <li>Feature usage</li>
        </ul>

        <h2>4. Managing Cookies</h2>
        <p>You can control cookies through your browser settings:</p>
        <ul>
          <li>Block all cookies</li>
          <li>Delete existing cookies</li>
          <li>Allow cookies from specific sites</li>
        </ul>

        <h2>5. Updates to This Policy</h2>
        <p>We may update this Cookie Policy periodically. Continue using our service constitutes acceptance of changes.</p>

        <h2>6. Contact Us</h2>
        <p>For questions about our Cookie Policy, contact us at:</p>
        <p>Email: privacy@thehodlnews.com</p>
      </div>
    </div>
  );
}