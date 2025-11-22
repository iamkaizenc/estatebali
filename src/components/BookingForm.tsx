"use client";

import { useState } from "react";
import { X, Calendar, Users, DollarSign } from "lucide-react";
import { Property } from "@/types";

interface BookingFormProps {
  property: Property;
  onClose: () => void;
}

export default function BookingForm({ property, onClose }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
  });

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = property.shortTermBooking?.pricePerNight || 0;
    return nights * pricePerNight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          ...formData,
          totalPrice: calculateTotal(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-100 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Submitted!</h2>
          <p className="text-gray-400 mb-6">
            Your booking request has been sent to the property owner. They will contact you soon to confirm.
          </p>
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-dark-100 rounded-2xl p-6 md:p-8 max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Book Your Stay</h2>
            <p className="text-gray-400 text-sm">{property.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-200 rounded-lg transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Check-in *</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Check-out *</label>
              <input
                type="date"
                required
                min={formData.checkIn || new Date().toISOString().split("T")[0]}
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium mb-2">Number of Guests *</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                required
                min={1}
                max={property.shortTermBooking?.maximumGuests || 10}
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                className="w-full pl-12 pr-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none"
              />
            </div>
            {property.shortTermBooking?.maximumGuests && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum {property.shortTermBooking.maximumGuests} guests
              </p>
            )}
          </div>

          {/* Guest Details */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none"
                placeholder="+62 812 3456 7890"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium mb-2">Special Requests</label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none resize-none"
              placeholder="Any special requirements or requests..."
            />
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div className="bg-dark-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Rp {property.shortTermBooking?.pricePerNight?.toLocaleString()} × {nights} nights
                </span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
              <div className="border-t border-dark-300 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">Rp {total.toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || nights <= 0}
            className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Request Booking"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            You won't be charged yet. The property owner will review your request and contact you.
          </p>
        </form>
      </div>
    </div>
  );
}
