import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Users, Home, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">About Estate Bali</h1>
          
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-xl text-gray-300 mb-6">
              Estate Bali is Bali's premier real estate platform, connecting property seekers 
              with their dream homes in paradise. We're committed to making your property 
              journey in Bali seamless and successful.
            </p>
            
            <p className="text-gray-300 mb-6">
              Founded with a vision to revolutionize the real estate market in Bali, Estate Bali 
              brings together property owners, agents, and buyers in one comprehensive platform. 
              Whether you're looking for a luxury villa, modern apartment, or prime land, we've 
              got you covered.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              To provide the most comprehensive, transparent, and user-friendly real estate 
              platform in Bali, making it easier than ever to find, buy, or rent your perfect 
              property in paradise.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-dark-100 rounded-2xl">
                <Home className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                <p className="text-gray-400">
                  All our properties are verified and checked for authenticity
                </p>
              </div>
              
              <div className="p-6 bg-dark-100 rounded-2xl">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Agents</h3>
                <p className="text-gray-400">
                  Work with certified and experienced real estate professionals
                </p>
              </div>
              
              <div className="p-6 bg-dark-100 rounded-2xl">
                <Globe className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Wide Coverage</h3>
                <p className="text-gray-400">
                  Properties across all popular areas in Bali
                </p>
              </div>
              
              <div className="p-6 bg-dark-100 rounded-2xl">
                <Award className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Service</h3>
                <p className="text-gray-400">
                  Dedicated support throughout your property journey
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              Have questions? We're here to help! Reach out to us at:
            </p>
            <ul className="text-gray-300 space-y-2 mb-12">
              <li>Email: info@estatebali.app</li>
              <li>Phone: <a href="https://wa.me/306989273327" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+30 698 927 3327</a></li>
              <li>Location: Bali, Indonesia</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

