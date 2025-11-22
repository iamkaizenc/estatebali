"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrendingUp, Phone, Mail, DollarSign, MapPin } from "lucide-react";

export default function AdminLeadsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuthSafe();
  const [leads, setLeads] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted" | "converted">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/investment-leads?status=${filter !== "all" ? filter : ""}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/investment-leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Failed to update lead:", error);
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
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-primary" />
            Investment Leads
          </h1>
          <p className="text-gray-400">Manage and track investment inquiries</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "all", label: "All Leads" },
            { key: "pending", label: "Pending" },
            { key: "contacted", label: "Contacted" },
            { key: "converted", label: "Converted" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === key
                  ? "bg-primary text-black"
                  : "bg-dark-200 hover:bg-dark-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Leads List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No leads found</h3>
            <p className="text-gray-400">New investment inquiries will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-dark-100 rounded-xl p-6 border border-dark-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{lead.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {lead.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="px-3 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {lead.investmentAmount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-gray-400">Budget</p>
                        <p className="font-semibold">${lead.investmentAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {lead.investmentType && (
                    <div>
                      <p className="text-xs text-gray-400">Type</p>
                      <p className="font-semibold capitalize">{lead.investmentType}</p>
                    </div>
                  )}
                  {lead.preferredLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="font-semibold">{lead.preferredLocation}</p>
                      </div>
                    </div>
                  )}
                </div>

                {lead.message && (
                  <div className="bg-dark-200 rounded-lg p-4">
                    <p className="text-sm text-gray-300">{lead.message}</p>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Submitted: {new Date(lead.createdAt).toLocaleString()}
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
