"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { Booking } from "@/types";

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthSafe();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        let filtered = data.bookings || [];

        if (filter === "upcoming") {
          filtered = filtered.filter((b: Booking) => new Date(b.checkIn) > new Date());
        } else if (filter === "past") {
          filtered = filtered.filter((b: Booking) => new Date(b.checkOut) < new Date());
        }

        setBookings(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      case "completed":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-400">Manage your property reservations</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "all", label: "All Bookings" },
            { key: "upcoming", label: "Upcoming" },
            { key: "past", label: "Past" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === key ? "bg-primary text-black" : "bg-dark-200 hover:bg-dark-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-gray-400 mb-6">Start exploring properties to make your first booking!</p>
            <button onClick={() => router.push("/properties")} className="btn-primary">
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-dark-100 rounded-xl p-6 border border-dark-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Booking #{booking.id.slice(0, 8)}</h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      Rp {booking.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">{booking.paymentStatus}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-400">Check-in</p>
                      <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-400">Check-out</p>
                      <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-400">Guests</p>
                      <p className="font-semibold">{booking.guests}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-200 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="text-gray-400">Guest:</span> {booking.guestName}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Email:</span> {booking.guestEmail}
                  </p>
                  {booking.guestPhone && (
                    <p className="text-sm">
                      <span className="text-gray-400">Phone:</span> {booking.guestPhone}
                    </p>
                  )}
                </div>

                {booking.specialRequests && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-1">Special Requests:</p>
                    <p className="text-sm bg-dark-200 rounded-lg p-3">{booking.specialRequests}</p>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Booked: {new Date(booking.createdAt).toLocaleString()}
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
