"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RentMotorbikePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rent Motorbike in Bali</h1>
          <p className="text-gray-400">Explore Bali on two wheels</p>
        </div>

        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-8">
            Motorbike rental service coming soon...
          </p>
          <p className="text-gray-500">
            We're working on bringing you the best motorbike rental options in Bali.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

