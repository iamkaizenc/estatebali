"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { useAuthSafe } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useProperties";
import { Property, User } from "@/types";
import { 
  Edit, Trash2, Plus, Eye, EyeOff, Star, LogOut, User as UserIcon, X, Save, 
  Home, TrendingUp, DollarSign, ShoppingBag, Settings, BarChart3, Shield, 
  Activity, Users, Image as ImageIcon, Search, Filter, ChevronDown, Mail, Phone
} from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "properties" | "users" | "images";

interface AdminUser extends Omit<User, 'createdAt'> {
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthSafe();
  const { properties: initialProperties, loading: propertiesLoading, refetch } = useProperties();
  const [activeTab, setActiveTab] = useState<TabType>("properties");
  
  // Custom logout handler for admin panel - redirects to home
  const handleLogout = () => {
    try {
      logout(); // Clear auth state
      router.push('/'); // Redirect to homepage
      router.refresh(); // Refresh the page
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/'); // Redirect even if logout fails
    }
  };
  
  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [saving, setSaving] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>("all");

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  // Update properties when fetched from API
  useEffect(() => {
    if (initialProperties.length > 0) {
      setProperties(initialProperties);
    }
  }, [initialProperties]);

  // Fetch users when users tab is active
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch("/api/users?all=true", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUsers(result.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
        if (!token) {
          alert('Authentication required. Please log in again.');
          router.push('/login');
          return;
        }
        
        const response = await fetch(`/api/properties/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setProperties(properties.filter(p => p.id !== id));
          refetch();
        } else {
          const result = await response.json();
          alert(result.error || 'Failed to delete property');
        }
      } catch (error: any) {
        console.error('Delete error:', error);
        alert('Failed to delete property: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/users?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          setUsers(users.filter(u => u.id !== id));
        } else {
          const result = await response.json();
          alert(result.error || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Delete user error:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    const updated = { ...property, featured: !property.featured };
    
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: updated.featured }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProperties(properties.map(p => p.id === id ? updated : p));
        } else {
          alert(result.error || 'Failed to update property');
        }
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to update property');
      }
    } catch (error: any) {
      console.error('Toggle featured error:', error);
      alert('Error updating property: ' + (error.message || 'Unknown error'));
    }
  };

  const handleToggleVerified = async (id: string) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    const updated = { ...property, verified: !property.verified };
    
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ verified: updated.verified }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProperties(properties.map(p => p.id === id ? updated : p));
        } else {
          alert(result.error || 'Failed to update property');
        }
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to update property');
      }
    } catch (error: any) {
      console.error('Toggle verified error:', error);
      alert('Error updating property: ' + (error.message || 'Unknown error'));
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
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      if (!token) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
        setSaving(false);
        return;
      }
      
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
        if (saved.success && saved.data) {
          if (isAdding) {
            setProperties([...properties, saved.data]);
          } else {
            setProperties(properties.map(p => p.id === selectedProperty?.id ? saved.data : p));
          }
          setIsEditing(false);
          setIsAdding(false);
          setSelectedProperty(null);
          setFormData({});
          refetch();
        } else {
          alert(saved.error || 'Failed to save property');
        }
      } else {
        const error = await response.json();
        console.error('Save error response:', error);
        alert(error.error || error.message || 'Failed to save property');
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

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
        } else {
          alert(result.error || 'Failed to update user role');
        }
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to update user role');
      }
    } catch (error: any) {
      console.error('Update user role error:', error);
      alert('Failed to update user role: ' + (error.message || 'Unknown error'));
    }
  };

  // Filter properties
  const filteredProperties = properties.filter(p => {
    const matchesSearch = !propertySearch || 
      p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(propertySearch.toLowerCase());
    const matchesType = propertyTypeFilter === "all" || p.type === propertyTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filter users
  const filteredUsers = users.filter(u => {
    if (!userSearch) return true;
    const search = userSearch.toLowerCase();
    return u.email.toLowerCase().includes(search) || 
           u.name.toLowerCase().includes(search);
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Admin Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-400">Manage properties, users, and content</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-dark-200 rounded-lg border border-dark-300">
              <UserIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors border border-red-500/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-dark-300">
          <button
            onClick={() => setActiveTab("properties")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "properties"
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Properties
            </div>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users ({users.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "images"
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </div>
          </button>
        </div>

        {/* Properties Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "properties" && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-6 bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <Activity className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{properties.length}</div>
                  <div className="text-sm text-gray-400">Total Properties</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-6 bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {properties.filter(p => p.featured).length}
                  </div>
                  <div className="text-sm text-gray-400">Featured Properties</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card p-6 bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {properties.filter(p => p.listingType === "sale").length}
                  </div>
                  <div className="text-sm text-gray-400">For Sale</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card p-6 bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <Activity className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {properties.filter(p => p.listingType === "rent").length}
                  </div>
                  <div className="text-sm text-gray-400">For Rent</div>
                </motion.div>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties by title or description..."
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={propertyTypeFilter}
                    onChange={(e) => setPropertyTypeFilter(e.target.value)}
                    className="pl-12 pr-10 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white appearance-none"
                  >
                    <option value="all" className="bg-dark-200">All Types</option>
                    <option value="villa" className="bg-dark-200">Villa</option>
                    <option value="apartment" className="bg-dark-200">Apartment</option>
                    <option value="house" className="bg-dark-200">House</option>
                    <option value="land" className="bg-dark-200">Land</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                <button 
                  onClick={handleAddNew}
                  className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </button>
              </div>

              {/* Properties Grid */}
              {propertiesLoading ? (
                <div className="text-center py-20">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading properties...</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="card p-12 text-center">
                  <Home className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                  <p className="text-gray-400 mb-6">
                    {propertySearch || propertyTypeFilter !== "all" 
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first property"}
                  </p>
                  {!propertySearch && propertyTypeFilter === "all" && (
                    <button 
                      onClick={handleAddNew}
                      className="btn-primary flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Property
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {property.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                            {property.description}
                          </p>
                        </div>
                        {property.featured && (
                          <Star className="h-5 w-5 fill-primary text-primary flex-shrink-0 ml-2" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                          {property.type}
                        </span>
                        <span className="px-3 py-1 bg-dark-300 text-gray-300 rounded-full text-xs">
                          {property.listingType}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="text-2xl font-bold text-primary mb-1">
                          Rp {property.price >= 1000000000 
                            ? `${(property.price / 1000000000).toFixed(1)}B` 
                            : `${(property.price / 1000000).toFixed(0)}M`}
                        </div>
                        <div className="text-sm text-gray-400">
                          {property.location.area}, {property.location.city}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {property.verified && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-medium flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                        {property.available ? (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-medium">
                            Sold
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-dark-300">
                        <button
                          onClick={() => handleToggleFeatured(property.id)}
                          className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm ${
                            property.featured 
                              ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                              : 'bg-dark-200 hover:bg-dark-300 text-gray-400'
                          }`}
                          title={property.featured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star className={`h-4 w-4 ${property.featured ? 'fill-primary' : ''}`} />
                          {property.featured ? 'Featured' : 'Feature'}
                        </button>
                        <button
                          onClick={() => router.push(`/property/${property.id}`)}
                          className="px-3 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleEdit(property)}
                          className="px-3 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats */}
              <div className="mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6 bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/20 rounded-xl">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-white">{users.length}</div>
                          <div className="text-sm text-gray-400">Total Users</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">
                        {users.filter(u => u.role === "admin" || u.role === "super_admin").length} Admins
                      </div>
                      <div className="text-sm text-gray-400">
                        {users.filter(u => u.role === "customer" || u.role === "user").length} Customers
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by email or name..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Users Table */}
              {usersLoading ? (
                <div className="text-center py-20">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="card p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2">No users found</h3>
                  <p className="text-gray-400">
                    {userSearch ? "Try adjusting your search" : "No users registered yet"}
                  </p>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-200 border-b border-dark-300">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Joined</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-dark-300 hover:bg-dark-200 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-white">{user.name}</div>
                                  <div className="text-xs text-gray-400">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {user.phone && (
                                <div className="flex items-center gap-1 text-sm text-gray-400">
                                  <Phone className="h-4 w-4" />
                                  {user.phone}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                className={`px-3 py-1 rounded-lg border transition-all text-sm font-medium ${
                                  user.role === "admin" || user.role === "super_admin"
                                    ? "bg-primary/20 text-primary border-primary/30"
                                    : "bg-dark-300 text-gray-300 border-dark-300"
                                }`}
                              >
                                <option value="customer" className="bg-dark-200">Customer</option>
                                <option value="owner" className="bg-dark-200">Owner</option>
                                <option value="agent" className="bg-dark-200">Agent</option>
                                <option value="admin" className="bg-dark-200">Admin</option>
                              </select>
                            </td>
                            <td className="px-4 py-4">
                              {user.verified ? (
                                <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-medium">
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-medium">
                                  Unverified
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-400">
                              {user.createdAt 
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="card p-12 text-center">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">Image Management</h3>
                <p className="text-gray-400 mb-6">
                  Image management is handled through property editing. 
                  Edit a property to add, remove, or manage images.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setActiveTab("properties");
                      handleAddNew();
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Property
                  </button>
                  <button
                    onClick={() => setActiveTab("properties")}
                    className="px-6 py-3 bg-dark-200 hover:bg-dark-300 rounded-xl transition-colors border border-dark-300"
                  >
                    Manage Properties
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit/Add Form Modal */}
        <AnimatePresence>
          {(isEditing || isAdding) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
              onClick={handleCancel}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-dark-300 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-dark-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">
                      {isAdding ? "Add New Property" : "Edit Property"}
                    </h2>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-dark-300 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Title *</label>
                      <input
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
                        placeholder="Enter property title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Price (IDR) *</label>
                      <input
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
                        placeholder="e.g., 8500000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Description *</label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-white placeholder-gray-500"
                      placeholder="Describe the property..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Property Type *</label>
                      <select
                        value={formData.type || "villa"}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white"
                      >
                        <option value="villa" className="bg-dark-200">Villa</option>
                        <option value="apartment" className="bg-dark-200">Apartment</option>
                        <option value="house" className="bg-dark-200">House</option>
                        <option value="land" className="bg-dark-200">Land</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Listing Type *</label>
                      <select
                        value={formData.listingType || "sale"}
                        onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
                        className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white"
                      >
                        <option value="sale" className="bg-dark-200">For Sale</option>
                        <option value="rent" className="bg-dark-200">For Rent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Area (m²) *</label>
                      <input
                        type="number"
                        value={formData.details?.area || 0}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          details: { ...formData.details, area: parseInt(e.target.value) }
                        })}
                        className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
                        placeholder="e.g., 450"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Location Area *</label>
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
                        className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
                        placeholder="e.g., Seminyak"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">City *</label>
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
                        className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
                        placeholder="e.g., Badung"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-dark-300">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Property"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-dark-200 hover:bg-dark-300 rounded-xl transition-colors border border-dark-300 text-gray-300 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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