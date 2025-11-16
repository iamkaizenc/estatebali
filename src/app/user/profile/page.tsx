"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedUserRoute } from "@/components/ProtectedUserRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Mail, Phone, Save, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image size must be less than 5MB");
      return;
    }

    setAvatarFile(file);
    const preview = URL.createObjectURL(file);
    setAvatar(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');

      // Upload avatar if changed
      let avatarUrl = avatar;
      if (avatarFile && supabase) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user?.id || 'user'}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("property-images") // Using same bucket, or create avatars bucket
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        avatarUrl = urlData?.publicUrl || null;
      }

      // Update user profile
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          avatar: avatarUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setAvatarFile(null);
        // Reload page to update user context
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedUserRoute>
      <div className="min-h-screen bg-black">
        <Header />

        <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-gray-400">Manage your personal information</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Profile Picture
              </h2>

              <div className="flex items-center gap-6">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-dark-200 flex items-center justify-center border-2 border-dark-300">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                  <p className="text-sm text-gray-400 mt-2">JPG, PNG or WEBP. Max 5MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input w-full pl-10"
                      placeholder="Your full name"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="input w-full pl-10 bg-dark-200 opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input w-full pl-10"
                      placeholder="+62 812 3456 7890"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </ProtectedUserRoute>
  );
}

export default function ProfilePageWrapper() {
  return (
    <ProtectedUserRoute>
      <ProfilePage />
    </ProtectedUserRoute>
  );
}

