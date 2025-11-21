"use client";

import { useAuthSafe } from "@/contexts/AuthContext";
import { ProtectedUserRoute } from "@/components/ProtectedUserRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Inbox } from "lucide-react";
import Link from "next/link";

function MessagesPage() {
  const { user } = useAuthSafe();

  return (
    <ProtectedUserRoute>
      <div className="min-h-screen bg-black">
        <Header />

        <main className="container mx-auto px-4 pt-24 pb-20">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              Messages
            </h1>
            <p className="text-gray-400">Your conversations with agents and property owners</p>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-20 card">
            <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Messaging Feature Coming Soon</h2>
            <p className="text-gray-400 mb-6">
              We're working on a direct messaging feature to help you connect with agents and property owners.
              For now, please use the contact buttons on property pages to reach out via phone, email, or WhatsApp.
            </p>
            <Link href="/properties" className="btn-primary">
              Browse Properties
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedUserRoute>
  );
}

export default function MessagesPageWrapper() {
  return (
    <ProtectedUserRoute>
      <MessagesPage />
    </ProtectedUserRoute>
  );
}
