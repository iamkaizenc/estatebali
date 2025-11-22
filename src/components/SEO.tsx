import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

export default function SEO({
  title = "Estate Bali - Bali's Premier Real Estate Platform",
  description = "Find your dream property in Bali. Luxury villas, modern apartments, and prime land for sale and rent. Trusted by thousands of property investors.",
  keywords = "Bali real estate, Bali property, villa Bali, apartment Bali, land for sale Bali, property investment Bali, luxury villas Bali",
  ogImage = "/og-image.jpg",
  ogUrl = "https://estatebali.app",
  canonical,
}: SEOProps) {
  const fullTitle = title.includes("Estate Bali") ? title : `${title} | Estate Bali`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Estate Bali" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Estate Bali" />

      {/* Geo Tags */}
      <meta name="geo.region" content="ID-BA" />
      <meta name="geo.placename" content="Bali" />
      <meta name="geo.position" content="-8.3405;115.0920" />
      <meta name="ICBM" content="-8.3405, 115.0920" />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#00FF66" />

      {/* Favicons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
}
