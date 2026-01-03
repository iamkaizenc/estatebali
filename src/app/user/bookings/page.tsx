"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle } from "lucide-react";

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthSafe();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
          
          <div className="card p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold">Booking System Unavailable</h2>
              <p className="text-gray-400 max-w-md">
                The booking system is currently under development and will be available soon. 
                Please contact property owners directly for inquiries.
              </p>
              <button
                onClick={() => router.push("/properties")}
                className="btn-primary mt-4"
              >
                Browse Properties
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
