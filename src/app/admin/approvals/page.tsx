"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, Eye, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminApprovalsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuthSafe();
  const [properties, setProperties] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      const response = await fetch(`/api/properties?status=${filter !== 'all' ? filter : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        // Filter by status if needed
        let filtered = result.data || [];
        if (filter !== 'all') {
          filtered = filtered.filter((p: any) => p.status === filter);
        }
        setProperties(filtered);
      } else {
        console.error("Failed to fetch properties:", result.error);
        setProperties([]);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      const result = await response.json();
      if (!result.success) {
        console.error("Failed to approve property:", result.error);
        alert(result.error || 'Failed to approve property');
        return;
      }

      fetchProperties();
    } catch (error) {
      console.error("Failed to approve property:", error);
      alert('Error approving property');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      const result = await response.json();
      if (!result.success) {
        console.error("Failed to reject property:", result.error);
        alert(result.error || 'Failed to reject property');
        return;
      }

      fetchProperties();
    } catch (error) {
      console.error("Failed to reject property:", error);
      alert('Error rejecting property');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Property Approvals</h1>
              <p className="text-gray-400">Review and moderate property listings</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-8 flex-wrap"
        >
          {[
            { key: "all", label: "All", icon: Eye, color: "gray" },
            { key: "pending", label: "Pending", icon: Clock, color: "yellow" },
            { key: "approved", label: "Approved", icon: CheckCircle, color: "green" },
            { key: "rejected", label: "Rejected", icon: XCircle, color: "red" },
          ].map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-medium ${
                filter === key
                  ? `bg-primary text-black shadow-lg shadow-primary/20`
                  : "bg-dark-200 hover:bg-dark-300 text-gray-400 hover:text-gray-300 border border-dark-300"
              }`}
            >
              <Icon className={`h-4 w-4 ${filter === key ? '' : `text-${color}-500`}`} />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Properties List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-400">
              {filter === "pending"
                ? "All properties have been reviewed!"
                : `No ${filter} properties at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>
                  </div>
                  {property.status === "pending" && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-medium flex items-center gap-1 ml-2">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                  {property.status === "approved" && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium flex items-center gap-1 ml-2">
                      <CheckCircle className="h-3 w-3" />
                      Approved
                    </span>
                  )}
                  {property.status === "rejected" && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-medium flex items-center gap-1 ml-2">
                      <XCircle className="h-3 w-3" />
                      Rejected
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Type</div>
                    <div className="font-medium text-white">{property.type}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Price</div>
                    <div className="font-medium text-primary">
                      Rp {property.price >= 1000000000 
                        ? `${(property.price / 1000000000).toFixed(1)}B` 
                        : `${(property.price / 1000000).toFixed(0)}M`}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-gray-400 text-sm mb-1">Location</div>
                  <div className="font-medium text-white">{property.location?.area}, {property.location?.city}</div>
                </div>

                {property.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t border-dark-300">
                    <button
                      onClick={() => handleApprove(property.id)}
                      className="flex-1 px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2 font-medium border border-green-500/30"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(property.id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 font-medium border border-red-500/30"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => router.push(`/property/${property.id}`)}
                      className="px-4 py-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors border border-dark-300"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}

                {property.status !== "pending" && (
                  <button
                    onClick={() => router.push(`/property/${property.id}`)}
                    className="w-full px-4 py-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors flex items-center justify-center gap-2 border border-dark-300 mt-4"
                  >
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">View Details</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
