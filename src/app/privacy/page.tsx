import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-300">
              Estate Bali ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and disclose your personal 
              information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-gray-300 mb-4">We collect the following types of information:</p>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>Personal information (name, email, phone number)</li>
              <li>Property information and preferences</li>
              <li>Usage data and analytics</li>
              <li>Device information and cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use your information to:</p>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>Provide and improve our services</li>
              <li>Communicate with you about properties</li>
              <li>Personalize your experience</li>
              <li>Send you updates and notifications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-300 mt-2">
              Email: privacy@estatebali.app<br />
              Phone: <a href="https://wa.me/306989273327" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+30 698 927 3327</a>
            </p>
          </section>

          <section>
            <p className="text-gray-400 text-sm mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

