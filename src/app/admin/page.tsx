"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { useAuthSafe } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types";
import { Edit, Trash2, Plus, Eye, EyeOff, Star, LogOut, User as UserIcon, X, Save } from "lucide-react";

function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthSafe();
  const { properties: initialProperties, loading: propertiesLoading, refetch } = useProperties();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [saving, setSaving] = useState(false);

  // Update properties when fetched from API
  useEffect(() => {
    if (initialProperties.length > 0) {
      setProperties(initialProperties);
    }
  }, [initialProperties]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/properties/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          setProperties(properties.filter(p => p.id !== id));
          refetch(); // Refresh from database
        } else {
          alert('Failed to delete property');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete property');
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    const updated = { ...property, featured: !property.featured };
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: updated.featured }),
      });
      
      if (response.ok) {
        setProperties(properties.map(p => p.id === id ? updated : p));
      }
    } catch (error) {
      // Fallback to local state update
      setProperties(properties.map(p => p.id === id ? updated : p));
    }
  };

  const handleToggleVerified = async (id: string) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    const updated = { ...property, verified: !property.verified };
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ verified: updated.verified }),
      });
      
      if (response.ok) {
        setProperties(properties.map(p => p.id === id ? updated : p));
      }
    } catch (error) {
      // Fallback to local state update
      setProperties(properties.map(p => p.id === id ? updated : p));
    }
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setFormData(property);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setSelectedProperty(null);
    setFormData({
      title: "",
      description: "",
      type: "villa",
      listingType: "sale",
      source: "agent",
      price: 0,
      location: {
        address: "",
        area: "",
        city: "",
      },
      details: {
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
      },
      features: {},
      images: [],
      contact: {
        name: "",
        phone: "",
        email: "",
      },
      available: true,
    });
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const url = isAdding ? '/api/properties' : `/api/properties/${selectedProperty?.id}`;
      const method = isAdding ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const saved = await response.json();
        if (isAdding) {
          setProperties([...properties, saved.data]);
        } else {
          setProperties(properties.map(p => p.id === selectedProperty?.id ? saved.data : p));
        }
        setIsEditing(false);
        setIsAdding(false);
        setSelectedProperty(null);
        setFormData({});
        refetch(); // Refresh from database
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save property');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Error saving property: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedProperty(null);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Admin Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage properties and listings - Full Access</p>
          </div>
          <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <UserIcon className="h-4 w-4" />
                    <span>{user?.name || user?.email}</span>
                  </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">{properties.length}</div>
            <div className="text-sm text-gray-400">Total Properties</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">
              {properties.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-gray-400">Featured</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">
              {properties.filter(p => p.listingType === "sale").length}
            </div>
            <div className="text-sm text-gray-400">For Sale</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">
              {properties.filter(p => p.listingType === "rent").length}
            </div>
            <div className="text-sm text-gray-400">For Rent</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <button 
            onClick={handleAddNew}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Property
          </button>
        </div>

        {/* Edit/Add Form Modal */}
        {(isEditing || isAdding) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {isAdding ? "Add New Property" : "Edit Property"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-dark-300 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={formData.type || "villa"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                    >
                      <option value="villa">Villa</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Listing Type</label>
                    <select
                      value={formData.listingType || "sale"}
                      onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
                      className="w-full px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area (m²)</label>
                    <input
                      type="number"
                      value={formData.details?.area || 0}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        details: { ...formData.details, area: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location Area</label>
                    <input
                      type="text"
                      value={formData.location?.area || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { 
                          address: formData.location?.address || "", 
                          area: e.target.value || "", 
                          city: formData.location?.city || "",
                          ...(formData.location?.coordinates && { coordinates: formData.location.coordinates })
                        }
                      })}
                      className="w-full px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={formData.location?.city || ""}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { 
                          address: formData.location?.address || "", 
                          area: formData.location?.area || "", 
                          city: e.target.value || "",
                          ...(formData.location?.coordinates && { coordinates: formData.location.coordinates })
                        }
                      })}
                      className="w-full px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Property"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-200 border-b border-dark-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Property</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b border-dark-300 hover:bg-dark-200 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold line-clamp-1">{property.title}</div>
                      <div className="text-xs text-gray-400">{property.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-dark-300 text-white">
                        {property.type}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">{property.listingType}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-primary">
                        Rp {property.price >= 1000000000 
                          ? `${(property.price / 1000000000).toFixed(1)}B` 
                          : `${(property.price / 1000000).toFixed(0)}M`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{property.location.area}</div>
                      <div className="text-xs text-gray-400">{property.location.city}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {property.featured && (
                          <span className="badge bg-primary text-black text-xs">Featured</span>
                        )}
                        {property.verified && (
                          <span className="badge bg-green-500 text-white text-xs">Verified</span>
                        )}
                        {property.available ? (
                          <span className="badge bg-blue-500 text-white text-xs">Available</span>
                        ) : (
                          <span className="badge bg-gray-500 text-white text-xs">Sold</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleFeatured(property.id)}
                          className="p-2 hover:bg-dark-300 rounded-lg transition-colors"
                          title={property.featured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star className={`h-4 w-4 ${property.featured ? 'fill-primary text-primary' : 'text-gray-400'}`} />
                        </button>
                        <button
                          onClick={() => handleToggleVerified(property.id)}
                          className="p-2 hover:bg-dark-300 rounded-lg transition-colors"
                          title={property.verified ? "Unverify" : "Verify"}
                        >
                          {property.verified ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(property)}
                          className="p-2 hover:bg-dark-300 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  );
}
