import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function SitemapPage() {
  const pages = [
    { name: "Home", href: "/" },
    { name: "Buy Properties", href: "/buy" },
    { name: "Rent Properties", href: "/rent" },
    { name: "Rent Motorbike", href: "/rent-motorbike" },
    { name: "All Properties", href: "/properties" },
    { name: "Featured Properties", href: "/featured" },
    { name: "Map Search", href: "/map" },
    { name: "About", href: "/about" },
    { name: "Agents", href: "/agents" },
    { name: "Create Listing", href: "/create" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const areas = [
    "Seminyak",
    "Canggu",
    "Ubud",
    "Sanur",
    "Uluwatu",
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Sitemap</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Main Pages</h2>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link 
                    href={page.href} 
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Popular Areas</h2>
            <ul className="space-y-2">
              {areas.map((area) => (
                <li key={area}>
                  <Link 
                    href={`/area/${area.toLowerCase()}`} 
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    Properties in {area}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

