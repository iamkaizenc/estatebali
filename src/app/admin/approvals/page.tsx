"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Property Approvals</h1>
          <p className="text-gray-400">Review and moderate property listings</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "all", label: "All", icon: Eye },
            { key: "pending", label: "Pending", icon: Clock },
            { key: "approved", label: "Approved", icon: CheckCircle },
            { key: "rejected", label: "Rejected", icon: XCircle },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                filter === key
                  ? "bg-primary text-black"
                  : "bg-dark-200 hover:bg-dark-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

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
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="bg-dark-100 rounded-xl p-6 border border-dark-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Type: {property.type}</span>
                      <span>Price: Rp {property.price?.toLocaleString()}</span>
                      <span>Location: {property.location?.area}</span>
                    </div>
                  </div>

                  {property.status === "pending" && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(property.id)}
                        className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(property.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => router.push(`/property/${property.id}`)}
                        className="px-4 py-2 bg-dark-200 rounded-lg hover:bg-dark-300 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {property.status === "approved" && (
                    <div className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approved
                    </div>
                  )}

                  {property.status === "rejected" && (
                    <div className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
