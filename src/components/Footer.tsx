import Link from "next/link";
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-100 border-t border-dark-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Estate Bali</span>
            </div>
            <p className="text-gray-400 mb-4">
              Bali's premier real estate platform. Find your dream property in paradise.
            </p>
            <div className="flex gap-3 mb-6">
              <a 
                href="https://www.instagram.com/estatebaliapp/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg hover:bg-primary hover:text-black transition-colors"
                aria-label="Instagram"
                title="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/estatebaliapp" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg hover:bg-primary hover:text-black transition-colors"
                aria-label="X (Twitter)"
                title="Follow us on X"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com/estatebali" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg hover:bg-primary hover:text-black transition-colors"
                aria-label="Facebook"
                title="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/estatebali" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg hover:bg-primary hover:text-black transition-colors"
                aria-label="LinkedIn"
                title="Follow us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            
            {/* App Store and Google Play Badges */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-400 mb-2">Download our app</p>
              <a
                href="https://apps.apple.com/app/estatebali"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:scale-105 transition-transform"
                aria-label="Download on App Store"
              >
                <div className="bg-black rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-700 hover:border-primary transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-white text-xs">
                    <div className="text-[10px] leading-tight">Download on the</div>
                    <div className="text-sm font-semibold leading-tight">App Store</div>
                  </div>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.estatebali.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:scale-105 transition-transform"
                aria-label="Get it on Google Play"
              >
                <div className="bg-black rounded-lg px-3 py-2 flex items-center gap-2 border border-gray-700 hover:border-primary transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-white text-xs">
                    <div className="text-[10px] leading-tight">GET IT ON</div>
                    <div className="text-sm font-semibold leading-tight">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/buy" className="hover:text-primary transition-colors">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-primary transition-colors">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-primary transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-primary transition-colors">
                  Find Agents
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-primary transition-colors">
                  Map Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h3 className="font-semibold mb-4">Popular Areas</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/area/seminyak" className="hover:text-primary transition-colors">
                  Seminyak
                </Link>
              </li>
              <li>
                <Link href="/area/canggu" className="hover:text-primary transition-colors">
                  Canggu
                </Link>
              </li>
              <li>
                <Link href="/area/ubud" className="hover:text-primary transition-colors">
                  Ubud
                </Link>
              </li>
              <li>
                <Link href="/area/uluwatu" className="hover:text-primary transition-colors">
                  Uluwatu
                </Link>
              </li>
              <li>
                <Link href="/area/sanur" className="hover:text-primary transition-colors">
                  Sanur
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Bali, Indonesia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@estatebali.app</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-dark-300 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Estate Bali. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
