"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthSafe } from "@/contexts/AuthContext";
import { Home, Menu, X, Bell, Heart, MessageSquare, User, Plus, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Use useAuthSafe to handle SSR/static generation gracefully
  const { isAuthenticated, user, isAdmin, logout } = useAuthSafe();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.svg" 
              alt="Estate Bali Logo" 
              width={200} 
              height={80}
              className="h-10 w-auto"
              priority
            />
            <span className="text-xl font-bold hidden sm:inline">Estate Bali</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/buy" className="hover:text-primary transition-colors">
              Buy
            </Link>
            <Link href="/rent" className="hover:text-primary transition-colors">
              Rent
            </Link>
            <Link href="/map" className="hover:text-primary transition-colors">
              Map Search
            </Link>
            <Link href="/agents" className="hover:text-primary transition-colors">
              Agents
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <>
                    <Link 
                      href="/admin" 
                      className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                    >
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-dark-200 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/user" 
                      className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                    >
                      My Dashboard
                    </Link>
                    <Link 
                      href="/create" 
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Listing
                    </Link>
                    <button className="p-2 hover:bg-dark-200 rounded-lg transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-dark-200 rounded-lg transition-colors">
                      <MessageSquare className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-dark-200 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-200 rounded-lg">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{user?.name || user?.email}</span>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/create" 
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Listing
                </Link>
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-16 left-0 right-0 glass border-b border-white/10"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link 
                href="/buy" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Buy
              </Link>
              <Link 
                href="/rent" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rent
              </Link>
              <Link 
                href="/map" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Map Search
              </Link>
              <Link 
                href="/agents" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Agents
              </Link>
              <Link 
                href="/about" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link 
                        href="/admin" 
                        className="btn-primary text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors text-center"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/user" 
                        className="btn-primary text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Dashboard
                      </Link>
                      <Link 
                        href="/create" 
                        className="btn-primary text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Create Listing
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors text-center"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    href="/create" 
                    className="btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Listing
                  </Link>
                  <Link 
                    href="/login" 
                    className="px-4 py-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
