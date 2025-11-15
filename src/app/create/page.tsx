"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home, Upload } from "lucide-react";

export default function CreateListingPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    listingType: "",
    price: "",
    address: "",
    area: "",
    city: "",
    bedrooms: "",
    bathrooms: "",
    propertyArea: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Listing creation feature coming soon! This form would submit to the backend.");
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Listing</h1>
          <p className="text-gray-400">List your property on Estate Bali</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Property Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Luxury Villa with Ocean View"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input w-full"
                  required
                >
                  <option value="">Select type</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Listing Type</label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                  className="input w-full"
                  required
                >
                  <option value="">Select listing type</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (IDR)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., 8500000000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., 4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area (m²)</label>
                <input
                  type="number"
                  value={formData.propertyArea}
                  onChange={(e) => setFormData({ ...formData, propertyArea: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., 450"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input w-full h-32"
                placeholder="Describe your property..."
                required
              />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input w-full"
                  placeholder="Street address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Seminyak"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Badung"
                  required
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Upload className="h-6 w-6 text-primary" />
              Photos
            </h2>
            <div className="border-2 border-dashed border-dark-300 rounded-xl p-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Upload property photos</p>
              <p className="text-sm text-gray-500">Feature coming soon</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              Create Listing
            </button>
            <button type="button" className="btn-secondary flex-1">
              Save Draft
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

