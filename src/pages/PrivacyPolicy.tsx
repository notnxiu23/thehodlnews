import { BackButton } from '../components/BackButton';

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
          <li>Account information (email, username)</li>
          <li>User preferences and settings</li>
          <li>Favorite articles and categories</li>
          <li>Price alerts and notifications settings</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our services</li>
          <li>Send notifications about price alerts</li>
          <li>Improve and personalize your experience</li>
          <li>Communicate with you about updates and changes</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>We do not sell or share your personal information with third parties except:</p>
        <ul>
          <li>With your consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and safety</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your information, including:</p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments</li>
          <li>Access controls and authentication</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of communications</li>
        </ul>

        <h2>6. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at:</p>
        <p>Email: privacy@thehodlnews.com</p>
      </div>
    </div>
  );
}