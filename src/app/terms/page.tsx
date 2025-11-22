import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using Estate Bali, you accept and agree to be bound by the 
              terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
            <p className="text-gray-300 mb-4">
              Permission is granted to temporarily access the materials on Estate Bali's 
              website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Property Listings</h2>
            <p className="text-gray-300 mb-4">
              Estate Bali provides property listings for informational purposes only. 
              We do not guarantee the accuracy, completeness, or availability of any property listing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. User Responsibilities</h2>
            <p className="text-gray-300 mb-4">Users are responsible for:</p>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>Providing accurate information</li>
              <li>Maintaining the security of their account</li>
              <li>Complying with all applicable laws</li>
              <li>Respecting the rights of other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-300">
              Estate Bali shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Contact Us</h2>
            <p className="text-gray-300">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-300 mt-2">
              Email: legal@estatebali.app<br />
              Phone: <a href="https://wa.me/306989273327" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+30 698 927 3327</a>
            </p>
          </section>

          <section>
            <p className="text-gray-400 text-sm mt-8">
              Last updated: January 2025
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

