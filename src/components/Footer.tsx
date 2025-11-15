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
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/estatebali" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg hover:bg-primary hover:text-black transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/estatebali" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg hover:bg-primary hover:text-black transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/estatebali" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg hover:bg-primary hover:text-black transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/estatebali" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg hover:bg-primary hover:text-black transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
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
