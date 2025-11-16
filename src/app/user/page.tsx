"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProtectedUserRoute } from "@/components/ProtectedUserRoute";
import { useAuth } from "@/contexts/AuthContext";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types";
import { Plus, Edit, Trash2, LogOut, User as UserIcon, Home, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function UserDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Get user's own properties by filtering with userId
  // First, we need to get user_id from users table
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get user_id from users table
        const userResponse = await fetch(`/api/users?email=${user.email}`);
        const userResult = await userResponse.json();
        
        if (userResult.success && userResult.data?.id) {
          // Fetch properties for this user
          const response = await fetch(`/api/properties?userId=${userResult.data.id}`);
          const result = await response.json();

          if (result.success) {
            setUserProperties(result.data);
          } else {
            setError(result.error || "Failed to fetch properties");
          }
        } else {
          // Fallback: filter by email if user_id not found
          const response = await fetch('/api/properties');
          const result = await response.json();
          if (result.success) {
            const filtered = result.data.filter((p: Property) => 
              p.contact?.email === user.email
            );
            setUserProperties(filtered);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* User Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.name || user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <UserIcon className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">{userProperties.length}</div>
            <div className="text-sm text-gray-400">My Properties</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">
              {userProperties.filter(p => p.available).length}
            </div>
            <div className="text-sm text-gray-400">Active Listings</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary mb-1">
              {userProperties.filter(p => !p.available).length}
            </div>
            <div className="text-sm text-gray-400">Sold/Rented</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <Link
            href="/create"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Listing
          </Link>
          <Link
            href="/user/favorites"
            className="px-6 py-3 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            My Favorites
          </Link>
        </div>

        {/* My Properties */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Properties</h2>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
            </div>
          ) : userProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProperties.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Link
                      href={`/property/${property.id}/edit`}
                      className="p-2 bg-dark-200/90 hover:bg-primary rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-white" />
                    </Link>
                    <button
                      onClick={async () => {
                        if (confirm("Are you sure you want to delete this property?")) {
                          try {
                            const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
                            const response = await fetch(`/api/properties/${property.id}`, {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                              },
                            });

                            if (response.ok) {
                              // Remove from local state
                              setUserProperties(userProperties.filter(p => p.id !== property.id));
                            } else {
                              const result = await response.json();
                              alert(result.error || 'Failed to delete property');
                            }
                          } catch (error: any) {
                            console.error('Delete error:', error);
                            alert('Error deleting property: ' + (error.message || 'Unknown error'));
                          }
                        }
                      }}
                      className="p-2 bg-red-500/90 hover:bg-red-500 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 card">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
              <p className="text-gray-400 mb-6">Start by creating your first property listing</p>
              <Link href="/create" className="btn-primary inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Listing
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/create"
              className="p-4 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
            >
              <div className="font-semibold mb-1">Create Listing</div>
              <div className="text-sm text-gray-400">Add a new property to your portfolio</div>
            </Link>
            <Link
              href="/user/profile"
              className="p-4 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
            >
              <div className="font-semibold mb-1">Edit Profile</div>
              <div className="text-sm text-gray-400">Update your personal information</div>
            </Link>
            <Link
              href="/user/messages"
              className="p-4 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
            >
              <div className="font-semibold mb-1">Messages</div>
              <div className="text-sm text-gray-400">View your inquiries and messages</div>
            </Link>
            <Link
              href="/user/settings"
              className="p-4 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
            >
              <div className="font-semibold mb-1">Settings</div>
              <div className="text-sm text-gray-400">Manage your account settings</div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function UserPage() {
  return (
    <ProtectedUserRoute>
      <UserDashboard />
    </ProtectedUserRoute>
  );
}

