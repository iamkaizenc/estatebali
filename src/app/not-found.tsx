import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-8xl font-bold mb-4 text-primary">404</h1>
          <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-400 text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary flex items-center justify-center gap-2">
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            <Link href="/properties" className="btn-secondary flex items-center justify-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Browse Properties
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

