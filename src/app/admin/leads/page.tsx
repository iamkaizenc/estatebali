"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrendingUp, Phone, Mail, DollarSign, MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";

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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/20 rounded-xl">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Investment Leads</h1>
              <p className="text-gray-400">Manage and track investment inquiries</p>
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
            { key: "all", label: "All Leads", color: "gray" },
            { key: "pending", label: "Pending", color: "yellow" },
            { key: "contacted", label: "Contacted", color: "blue" },
            { key: "converted", label: "Converted", color: "green" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-5 py-3 rounded-xl transition-all font-medium ${
                filter === key
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "bg-dark-200 hover:bg-dark-300 text-gray-400 hover:text-gray-300 border border-dark-300"
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{lead.name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-primary" />
                        {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-primary" />
                          {lead.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className={`px-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium ${
                      lead.status === "pending" 
                        ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                        : lead.status === "contacted"
                        ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                        : lead.status === "converted"
                        ? "bg-green-500/20 text-green-500 border-green-500/30"
                        : "bg-dark-200 text-gray-400 border-dark-300"
                    }`}
                  >
                    <option value="pending" className="bg-dark-200">Pending</option>
                    <option value="contacted" className="bg-dark-200">Contacted</option>
                    <option value="converted" className="bg-dark-200">Converted</option>
                    <option value="closed" className="bg-dark-200">Closed</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {lead.investmentAmount && (
                    <div className="p-3 bg-dark-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <p className="text-xs text-gray-400">Budget</p>
                      </div>
                      <p className="font-bold text-white text-lg">${lead.investmentAmount.toLocaleString()}</p>
                    </div>
                  )}
                  {lead.investmentType && (
                    <div className="p-3 bg-dark-200 rounded-xl">
                      <p className="text-xs text-gray-400 mb-1">Investment Type</p>
                      <p className="font-semibold text-white capitalize">{lead.investmentType}</p>
                    </div>
                  )}
                  {lead.preferredLocation && (
                    <div className="p-3 bg-dark-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        <p className="text-xs text-gray-400">Location</p>
                      </div>
                      <p className="font-semibold text-white">{lead.preferredLocation}</p>
                    </div>
                  )}
                </div>

                {lead.message && (
                  <div className="bg-dark-200 rounded-xl p-4 mb-4 border border-dark-300">
                    <p className="text-sm text-gray-300 leading-relaxed">{lead.message}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-dark-300 text-xs text-gray-500 flex items-center justify-between">
                  <span>Submitted: {new Date(lead.createdAt).toLocaleDateString()}</span>
                  <span>{new Date(lead.createdAt).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
