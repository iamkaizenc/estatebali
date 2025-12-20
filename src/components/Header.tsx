"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import { Home, Menu, X, Bell, Heart, MessageSquare, User, Plus, LogOut, Settings, ChevronDown, Shield, FileText, Building2, Scale, Users as UsersIcon, MessageCircle, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "@/components/NotificationBell";
import { logger } from "@/lib/logger";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const router = useRouter();
  // Use useAuthSafe to handle SSR/static generation gracefully
  const { isAuthenticated, user, isAdmin, logout } = useAuthSafe();

  const handleLogout = async () => {
    try {
      // Close mobile menu
      setMobileMenuOpen(false);
      
      // Clear auth state via context (this handles Supabase signOut, storage, cookies, and redirect)
      // The logout function in AuthContext will handle the hard redirect
      await logout();
    } catch (error) {
      logger.error('Logout error in header', error instanceof Error ? error : new Error(String(error)));
      // If logout fails, force hard redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.replace('/');
        router.refresh();
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-xl bg-black/80">
      <motion.div 
        className={`mx-auto ${
          isAuthenticated 
            ? 'max-w-[95%] px-8 xl:px-12' 
            : 'max-w-7xl px-6'
        }`}
        initial={false}
        animate={{
          paddingLeft: isAuthenticated ? '3rem' : '1.5rem',
          paddingRight: isAuthenticated ? '3rem' : '1.5rem',
        }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={`flex items-center justify-between h-16 transition-all duration-500 ${
          isAuthenticated ? 'gap-8' : 'gap-4'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="Estate Bali Logo" 
              width={200} 
              height={80}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center flex-1 justify-center transition-all duration-500 ${
            isAuthenticated ? 'gap-10 xl:gap-12' : 'gap-8'
          }`}>
            <Link href="/buy" className="hover:text-primary transition-colors">
              Buy
            </Link>
            <Link href="/rent-motorbike" className="hover:text-primary transition-colors">
              Rent Motorbike
            </Link>
            <Link href="/rent" className="hover:text-primary transition-colors">
              Rent
            </Link>
            <Link href="/map" className="hover:text-primary transition-colors">
              Map Search
            </Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link 
                href="/services" 
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                Services
                <span className="px-1.5 py-0.5 bg-primary text-black text-xs font-bold rounded">New</span>
                <ChevronDown className="h-4 w-4" />
              </Link>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-dark-100 border border-dark-300 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-dark-300 bg-orange-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs font-medium border border-orange-500/30">
                          🚧 Coming Soon
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Visa, Residency & Company Services</p>
                    </div>

                    <div className="p-2">
                      <Link 
                        href="/services#visa"
                        className="flex items-center gap-3 p-3 hover:bg-dark-200 rounded-lg transition-colors group"
                      >
                        <Shield className="h-5 w-5 text-blue-400" />
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-primary transition-colors">Visa Services</div>
                          <div className="text-xs text-gray-400">Tourist, Business & Social Visas</div>
                        </div>
                      </Link>

                      <Link 
                        href="/services#residency"
                        className="flex items-center gap-3 p-3 hover:bg-dark-200 rounded-lg transition-colors group"
                      >
                        <FileText className="h-5 w-5 text-green-400" />
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-primary transition-colors">Residency Permits</div>
                          <div className="text-xs text-gray-400">KITAS & KITAP Services</div>
                        </div>
                      </Link>

                      <Link 
                        href="/services#company"
                        className="flex items-center gap-3 p-3 hover:bg-dark-200 rounded-lg transition-colors group"
                      >
                        <Building2 className="h-5 w-5 text-purple-400" />
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-primary transition-colors">Company Setup</div>
                          <div className="text-xs text-gray-400">PT PMA & Business Registration</div>
                        </div>
                      </Link>

                      <Link 
                        href="/services#legal"
                        className="flex items-center gap-3 p-3 hover:bg-dark-200 rounded-lg transition-colors group"
                      >
                        <Scale className="h-5 w-5 text-orange-400" />
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-primary transition-colors">Legal Services</div>
                          <div className="text-xs text-gray-400">Documentation & Translation</div>
                        </div>
                      </Link>

                      <Link 
                        href="/services#relocation"
                        className="flex items-center gap-3 p-3 hover:bg-dark-200 rounded-lg transition-colors group"
                      >
                        <UsersIcon className="h-5 w-5 text-pink-400" />
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-primary transition-colors">Relocation Support</div>
                          <div className="text-xs text-gray-400">Smooth transition to Bali</div>
                        </div>
                      </Link>
                    </div>

                    <div className="p-4 border-t border-dark-300 bg-dark-200">
                      <a
                        href="https://wa.me/6282260613492?text=Hi! I would like to get information about your services in Bali."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-primary flex items-center justify-center gap-2 text-sm mb-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Phone className="h-3 w-3" />
                        <span>+6282260613492</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/agents" className="hover:text-primary transition-colors">
              Agents
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/beta" className="hover:text-primary transition-colors flex items-center gap-1">
              iOS Beta
              <span className="px-1.5 py-0.5 bg-primary text-black text-xs font-bold rounded">New</span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className={`hidden lg:flex items-center flex-nowrap transition-all duration-500 ${
            isAuthenticated ? 'gap-6 xl:gap-8' : 'gap-4'
          }`}>
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <>
                    <Link 
                      href="/admin" 
                      className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors whitespace-nowrap"
                    >
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-dark-200 rounded-lg transition-colors flex-shrink-0"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/user"
                      className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors whitespace-nowrap"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href="/create"
                      className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                      Create Listing
                    </Link>
                    <NotificationBell />
                    <Link href="/user/favorites" className="p-2 hover:bg-dark-200 rounded-lg transition-colors flex-shrink-0">
                      <Heart className="h-5 w-5" />
                    </Link>
                    <Link href="/user/messages" className="p-2 hover:bg-dark-200 rounded-lg transition-colors flex-shrink-0">
                      <MessageSquare className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-dark-200 rounded-lg transition-colors flex-shrink-0"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-200 rounded-lg flex-shrink-0 whitespace-nowrap">
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
      </motion.div>

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
                href="/rent-motorbike" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rent Motorbike
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
                href="/services" 
                className="py-2 hover:text-primary transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
                <span className="px-1.5 py-0.5 bg-primary text-black text-xs font-bold rounded">New</span>
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
              <Link 
                href="/beta" 
                className="py-2 hover:text-primary transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                iOS Beta
                <span className="px-1.5 py-0.5 bg-primary text-black text-xs font-bold rounded">New</span>
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
