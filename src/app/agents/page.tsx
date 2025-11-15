"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Mail, Phone, MessageCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const agents = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@estatebali.com",
    phone: "+62 812 3456 7890",
    verified: true,
    propertiesCount: 45,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@estatebali.com",
    phone: "+62 817 7788 9900",
    verified: true,
    propertiesCount: 32,
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
  {
    id: "3",
    name: "Ketut Dharma",
    email: "ketut@estatebali.com",
    phone: "+62 811 2233 4455",
    verified: true,
    propertiesCount: 28,
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Agent</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect with verified real estate agents in Bali. Our experienced professionals 
            are here to help you find your perfect property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="card p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {agent.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-black" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  {agent.verified && (
                    <p className="text-xs text-primary">Verified Agent</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span>⭐ {agent.rating}</span>
                  <span>•</span>
                  <span>{agent.propertiesCount} properties</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {agent.email}
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {agent.phone}
                </a>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${agent.phone}`}
                  className="btn-primary flex-1 text-center text-sm py-2"
                >
                  Call
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="btn-secondary flex-1 text-center text-sm py-2"
                >
                  Email
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

