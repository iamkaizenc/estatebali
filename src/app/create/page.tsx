"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FormErrorBoundary } from "@/components/ErrorBoundary";
import { ImageUpload } from "@/components/ImageUpload";
import { Home, Upload, AlertCircle, Loader2 } from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthSafe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
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
    furnished: false,
  });

  // Redirect if not authenticated - only on client side
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      
      // Prepare property data
      const propertyData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        listingType: formData.listingType,
        source: "owner" as const,
        price: parseInt(formData.price),
        location: {
          address: formData.address,
          area: formData.area,
          city: formData.city,
        },
        details: {
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          area: parseInt(formData.propertyArea),
          furnished: formData.furnished,
        },
        features: {},
        images: images,
        contact: {
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
        },
        available: true,
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to user dashboard or property page
        router.push(`/user?created=${result.data.id}`);
      } else {
        setError(result.error || "Failed to create property");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the property");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Listing</h1>
          <p className="text-gray-400">List your property on Estate Bali</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <FormErrorBoundary>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Property Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Luxury Villa with Ocean View"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input w-full"
                  required
                  disabled={loading}
                >
                  <option value="">Select type</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Listing Type *</label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                  className="input w-full"
                  required
                  disabled={loading}
                >
                  <option value="">Select listing type</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (IDR) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., 8500000000"
                  required
                  min="0"
                  disabled={loading}
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
                  min="0"
                  disabled={loading}
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
                  min="0"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area (m²) *</label>
                <input
                  type="number"
                  value={formData.propertyArea}
                  onChange={(e) => setFormData({ ...formData, propertyArea: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., 450"
                  required
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="furnished"
                  checked={formData.furnished}
                  onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-300"
                  disabled={loading}
                />
                <label htmlFor="furnished" className="text-sm font-medium">
                  Furnished
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input w-full h-32"
                placeholder="Describe your property..."
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input w-full"
                  placeholder="Street address"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area *</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Seminyak"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Badung"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Upload className="h-6 w-6 text-primary" />
              Photos
            </h2>
            <ImageUpload 
              onImagesChange={setImages}
              maxImages={10}
              bucketName="property-images"
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </button>
            <button 
              type="button" 
              className="btn-secondary flex-1"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
        </FormErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
