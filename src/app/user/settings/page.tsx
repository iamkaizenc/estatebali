"use client";

import { useState } from "react";
import { useAuthSafe } from "@/contexts/AuthContext";
import { ProtectedUserRoute } from "@/components/ProtectedUserRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Settings, User, Bell, Lock, Globe, Save } from "lucide-react";

function SettingsPage() {
  const { user } = useAuthSafe();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedUserRoute>
      <div className="min-h-screen bg-black">
        <Header />

        <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              Settings
            </h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          {/* Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Profile Information</h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-100 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-dark-100 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-dark-100 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="+62 123 456 7890"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Notification Settings */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Notification Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates about your favorites and new listings</p>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-full h-full bg-gray-700 rounded-full peer-checked:bg-primary transition-colors cursor-pointer"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-400">Get text messages for important updates</p>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-full h-full bg-gray-700 rounded-full peer-checked:bg-primary transition-colors cursor-pointer"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Security</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <button className="btn-secondary">
                    Change Password
                  </button>
                  <p className="text-sm text-gray-400 mt-2">Update your password to keep your account secure</p>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <button className="text-red-400 hover:text-red-300 transition-colors">
                    Delete Account
                  </button>
                  <p className="text-sm text-gray-400 mt-2">Permanently delete your account and all associated data</p>
                </div>
              </div>
            </div>

            {/* Language & Region */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Language & Region</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select className="w-full bg-dark-100 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary">
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="he">עברית (Hebrew)</option>
                    <option value="ar">العربية (Arabic)</option>
                    <option value="zh">中文 (Chinese)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select className="w-full bg-dark-100 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary">
                    <option value="USD">USD ($)</option>
                    <option value="IDR">IDR (Rp)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedUserRoute>
  );
}

export default function SettingsPageWrapper() {
  return (
    <ProtectedUserRoute>
      <SettingsPage />
    </ProtectedUserRoute>
  );
}
